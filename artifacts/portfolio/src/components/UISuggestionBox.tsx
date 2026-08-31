import { useState, type FormEvent } from "react";
import { Check, Lightbulb, Loader2, Send } from "lucide-react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function UISuggestionBox() {
  const [suggestion, setSuggestion] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = suggestion.trim();

    if (value.length < 3) {
      setState("error");
      setMessage("Please enter at least 3 characters.");
      return;
    }

    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/ui-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion: value }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Could not submit your idea. Try again.");
        return;
      }

      setSuggestion("");
      setState("success");
      setMessage("Thanks — I’ll add the best ideas to my practice list.");
    } catch {
      setState("error");
      setMessage("Could not reach the server. Please try again.");
    }
  };

  return (
    <div className="glass rounded-2xl p-5 md:p-6 max-w-3xl mx-auto mt-10">
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(224,0,255,0.12)",
            border: "1px solid rgba(224,0,255,0.25)",
            color: "var(--c-primary)",
          }}
        >
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--c-primary)" }}>
            Help shape the next one
          </p>
          <h3 className="text-lg font-bold text-white">Suggest a UI to build</h3>
          <p className="text-xs text-white/35 leading-relaxed mt-1">
            Give me a screen idea and I may turn it into my next roleplay practice piece.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="ui-suggestion" className="sr-only">Your UI suggestion</label>
        <textarea
          id="ui-suggestion"
          value={suggestion}
          onChange={(event) => {
            setSuggestion(event.target.value.slice(0, 300));
            if (state !== "idle") {
              setState("idle");
              setMessage("");
            }
          }}
          placeholder="e.g. Evidence locker, dispatch board, or warrant system..."
          maxLength={300}
          rows={2}
          className="w-full sm:flex-1 min-h-11 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none resize-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
          disabled={state === "loading"}
        />
        <button
          type="submit"
          disabled={state === "loading" || !suggestion.trim()}
          className="sm:self-stretch min-h-11 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all btn-primary disabled:opacity-40"
        >
          {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {state === "loading" ? "Sending..." : "Submit"}
        </button>
      </form>

      <div className="flex items-center justify-between gap-3 mt-2 min-h-5">
        <p
          className={`text-xs ${state === "success" ? "text-emerald-400/80" : state === "error" ? "text-red-400" : "text-white/25"}`}
          aria-live="polite"
        >
          {state === "success" && <Check className="w-3 h-3 inline-block mr-1 -mt-0.5" />}
          {message}
        </p>
        <span className="text-[10px] text-white/20 flex-shrink-0">{suggestion.length}/300</span>
      </div>
    </div>
  );
}