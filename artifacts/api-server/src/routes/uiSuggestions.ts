import { Router, type Request, type Response } from "express";
import { Resend } from "resend";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { logger } from "../lib/logger";

const router = Router();

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dir, "../../data");
const DATA_FILE = join(DATA_DIR, "ui-suggestions.json");
const OWNER_EMAIL = "dangert913@gmail.com";
const FROM_ADDR = "MYSTICFUSION7X <onboarding@resend.dev>";

interface UISuggestion {
  id: string;
  suggestion: string;
  createdAt: string;
}

function loadSuggestions(): UISuggestion[] {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    const raw = readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as UISuggestion[];
  } catch {
    // First run or an unreadable file starts with an empty list.
  }
  return [];
}

function saveSuggestions(list: UISuggestion[]): boolean {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
    return true;
  } catch (err) {
    logger.error({ err }, "[ui-suggestions] failed to save suggestions");
    return false;
  }
}

const suggestions = loadSuggestions();

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 8;
const RATE_WINDOW = 60_000;
const suggestionCooldowns = new Map<string, number>();
const SUGGESTION_COOLDOWN = 10 * 60_000;

function getIP(req: Request) {
  return (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim()
    ?? req.socket.remoteAddress
    ?? "unknown";
}

function rateOk(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimits) {
    if (now > value.resetAt) rateLimits.delete(key);
  }
  for (const [key, submittedAt] of suggestionCooldowns) {
    if (now - submittedAt >= SUGGESTION_COOLDOWN) suggestionCooldowns.delete(key);
  }
}, 300_000);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function notifyOwner(entry: UISuggestion): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_ADDR,
      to: OWNER_EMAIL,
      subject: "✦ New UI Practice Suggestion — MYSTICFUSION7X",
      html: `
        <div style="font-family:Arial,sans-serif;background:#05040a;color:#f5f3ff;padding:28px;border-radius:16px;max-width:560px;">
          <p style="color:#a855f7;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin:0 0 10px;">
            UI Practice Suggestion
          </p>
          <h1 style="font-size:24px;margin:0 0 20px;color:#fff;">Someone gave you an idea to build.</h1>
          <div style="background:#0b0914;border:1px solid rgba(139,61,255,.28);border-radius:12px;padding:18px;color:#fff;font-size:16px;line-height:1.6;">
            ${escapeHtml(entry.suggestion)}
          </div>
          <p style="color:rgba(255,255,255,.42);font-size:12px;margin:18px 0 0;">
            Submitted ${escapeHtml(new Date(entry.createdAt).toLocaleString())}
          </p>
        </div>
      `,
    });

    if (result.error) {
      logger.warn({ err: result.error }, "[ui-suggestions] owner email failed");
      return false;
    }
    return true;
  } catch (err) {
    logger.warn({ err }, "[ui-suggestions] owner email threw");
    return false;
  }
}

router.post("/ui-suggestions", async (req: Request, res: Response) => {
  const ip = getIP(req);

  if (!rateOk(ip)) {
    res.status(429).json({ error: "Too many suggestions. Please wait a minute and try again." });
    return;
  }

  const raw = req.body?.suggestion;
  if (typeof raw !== "string") {
    res.status(400).json({ error: "Please enter a UI idea." });
    return;
  }

  const suggestion = raw.trim().slice(0, 300);
  if (suggestion.length < 3) {
    res.status(400).json({ error: "Please enter at least 3 characters." });
    return;
  }

  const lastSubmittedAt = suggestionCooldowns.get(ip);
  if (lastSubmittedAt !== undefined) {
    const remainingMs = SUGGESTION_COOLDOWN - (Date.now() - lastSubmittedAt);
    if (remainingMs > 0) {
      res.status(429).json({
        error: "You can submit one UI idea every 10 minutes. Please try again later.",
        retryAfter: Math.ceil(remainingMs / 1000),
      });
      return;
    }
    suggestionCooldowns.delete(ip);
  }

  const entry: UISuggestion = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    suggestion,
    createdAt: new Date().toISOString(),
  };

  suggestions.push(entry);
  if (!saveSuggestions(suggestions)) {
    suggestions.pop();
    res.status(500).json({ error: "Could not save your suggestion. Please try again." });
    return;
  }

  suggestionCooldowns.set(ip, Date.now());
  const notified = await notifyOwner(entry);
  res.status(201).json({ ok: true, notified });
});

export default router;