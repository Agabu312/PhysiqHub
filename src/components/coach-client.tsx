"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareHeart, Send, Sparkles, User2 } from "lucide-react";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { adaptiveSuggestion, readinessFromJournal, weeklyWeightDeltaKg } from "@/lib/insights";
import { loadJournalEntries, sortEntriesByDateDesc } from "@/lib/journal-storage";
import { goalLabel } from "@/lib/nutrition";
import { loadProfileFromStorage } from "@/lib/profile";
import { getItem, STORAGE_KEYS } from "@/lib/storage";
import type { JournalEntry, MacroResults, UserProfile, WaterDailyLog } from "@/lib/types";

type CoachQuestionId =
  | "focus"
  | "hydration"
  | "calories"
  | "weight"
  | "recovery"
  | "next-step";

type CoachAnswer = {
  title: string;
  body: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "coach";
  text: string;
  meta?: string;
};

function parseMacroResults(raw: string | null): MacroResults | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as MacroResults;
    if (typeof o.bmr === "number" && typeof o.tdee === "number") return o;
    return null;
  } catch {
    return null;
  }
}

function parseWaterLog(raw: string | null): WaterDailyLog | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as WaterDailyLog;
    if (typeof o.date === "string" && typeof o.targetMl === "number") return o;
    return null;
  } catch {
    return null;
  }
}

function buildCoachAnswer(
  id: CoachQuestionId,
  profile: UserProfile | null,
  macros: MacroResults | null,
  water: WaterDailyLog | null,
  entries: JournalEntry[],
): CoachAnswer {
  const readiness = readinessFromJournal(entries);
  const suggestion = adaptiveSuggestion({ profile, water, entries });
  const weeklyDelta = weeklyWeightDeltaKg(entries);
  const latest = entries[0];

  if (!profile) {
    return {
      title: "Complete your setup first",
      body: "Coach works best once onboarding is finished and you’ve saved a profile. That gives the app enough context to personalize suggestions.",
    };
  }

  if (id === "focus") {
    return {
      title: "Today’s focus",
      body: suggestion.body,
    };
  }

  if (id === "hydration") {
    if (!water || water.targetMl <= 0) {
      return {
        title: "Hydration status unavailable",
        body: "You haven’t initialized today’s hydration target yet. Open Water Intake once so Coach can judge whether hydration is supporting your goal.",
      };
    }

    const percent = Math.round((water.consumedMl / water.targetMl) * 100);

    if (percent < 50) {
      return {
        title: "Hydration is likely lagging",
        body: `You’re at about ${percent}% of today’s target. That may affect training quality, appetite regulation, and how flat you feel. Bring intake up steadily rather than all at once.`,
      };
    }

    if (percent < 90) {
      return {
        title: "Hydration is decent, but not finished",
        body: `You’re at about ${percent}% of your target. You’re in a workable range, but finishing the day closer to target will support consistency and recovery.`,
      };
    }

    return {
      title: "Hydration is on track",
      body: `You’re around ${percent}% of today’s target. Keep that consistency—hydration works best when it’s steady rather than reactive.`,
    };
  }

  if (id === "calories") {
    if (!macros) {
      return {
        title: "No calorie calculation saved",
        body: "Run the calorie and macro calculator first. Once that data exists, Coach can compare your intake strategy against your goal.",
      };
    }

    return {
      title: "Calories vs goal",
      body: `Your current goal is ${goalLabel(profile.goal).toLowerCase()}. Your estimated BMR is ${macros.bmr} kcal and your estimated TDEE is ${macros.tdee} kcal. The main thing now is not chasing random numbers—it’s following your plan consistently long enough to evaluate the trend honestly.`,
    };
  }

  if (id === "weight") {
    if (weeklyDelta == null) {
      return {
        title: "Not enough trend data yet",
        body: "Coach needs more than one isolated weigh-in. A small run of journal entries with bodyweight gives a much clearer picture than daily noise.",
      };
    }

    if (profile.goal === "lose_fat") {
      if (weeklyDelta >= 0) {
        return {
          title: "Fat-loss progress may be stalled",
          body: `Your recent trend looks roughly ${weeklyDelta.toFixed(1)} kg per week. That suggests you may be near maintenance, or adherence may be less tight than it feels. Before cutting harder, tighten consistency and compare a longer trend window.`,
        };
      }

      return {
        title: "Weight is moving downward",
        body: `Your recent trend is about ${weeklyDelta.toFixed(1)} kg per week. That suggests the deficit is doing something. The key now is whether recovery, performance, and adherence still feel sustainable.`,
      };
    }

    if (profile.goal === "muscle_gain") {
      if (weeklyDelta <= 0) {
        return {
          title: "Scale movement may be too slow for a gain phase",
          body: `Your recent trend is about ${weeklyDelta.toFixed(1)} kg per week. If building muscle is the priority, intake may be too conservative or consistency may be too uneven to create momentum.`,
        };
      }

      return {
        title: "Weight is moving in a gain-friendly direction",
        body: `Your recent trend is about +${weeklyDelta.toFixed(1)} kg per week. That can support a gain phase if training quality and recovery are also staying strong.`,
      };
    }

    return {
      title: "Weight trend is context, not judgment",
      body: `Your recent trend is about ${weeklyDelta > 0 ? "+" : ""}${weeklyDelta.toFixed(1)} kg per week. Whether that’s useful depends on your actual goal, performance, and sustainability.`,
    };
  }

  if (id === "recovery") {
    return {
      title: readiness.title,
      body: readiness.detail,
    };
  }

  if (id === "next-step") {
    const lines: string[] = [];

    if (!macros) lines.push("run the calorie and macro calculator");
    if (!water || water.targetMl <= 0) lines.push("initialize your hydration target");
    if (!latest) lines.push("log a short journal entry");
    if (entries.length > 0 && latest) lines.push("review whether your recent entries reflect a real pattern");

    if (lines.length === 0) {
      return {
        title: "Best next step",
        body: "You already have enough data to stop collecting blindly and start tightening execution. Focus on consistency this week: hit calories, hydrate properly, and keep journal notes honest and brief.",
      };
    }

    return {
      title: "Best next step",
      body: `Right now, your highest-value move is to ${lines[0]}${lines[1] ? `, then ${lines[1]}` : ""}. Coach becomes more useful when the basics are actually logged.`,
    };
  }

  return {
    title: "Coach",
    body: "No answer available yet.",
  };
}

const SUGGESTED_QUESTIONS: { id: CoachQuestionId; label: string }[] = [
  { id: "focus", label: "What should I focus on today?" },
  { id: "hydration", label: "Is my hydration on track?" },
  { id: "calories", label: "Are my calories aligned with my goal?" },
  { id: "weight", label: "Why might my weight not be changing?" },
  { id: "recovery", label: "How does my recovery look?" },
  { id: "next-step", label: "What should I improve first?" },
];

function mapInputToQuestion(input: string): CoachQuestionId {
  const text = input.toLowerCase();

  if (text.includes("hydration") || text.includes("water") || text.includes("drink")) return "hydration";
  if (text.includes("calorie") || text.includes("macro") || text.includes("bulk") || text.includes("cut")) return "calories";
  if (text.includes("weight") || text.includes("scale") || text.includes("fat loss") || text.includes("gain")) return "weight";
  if (text.includes("recover") || text.includes("recovery") || text.includes("fatigue") || text.includes("tired")) return "recovery";
  if (text.includes("focus") || text.includes("today")) return "focus";
  return "next-step";
}

export function CoachClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [macros, setMacros] = useState<MacroResults | null>(null);
  const [water, setWater] = useState<WaterDailyLog | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setProfile(loadProfileFromStorage());
    setMacros(parseMacroResults(getItem(STORAGE_KEYS.macroResults)));
    setWater(parseWaterLog(getItem(STORAGE_KEYS.waterDaily)));
    setEntries(sortEntriesByDateDesc(loadJournalEntries()));
  }, []);

  const summaryChips = useMemo(() => {
    const chips: string[] = [];
    if (profile) chips.push(`Goal: ${goalLabel(profile.goal)}`);
    if (water && water.targetMl > 0) {
      chips.push(`Hydration: ${Math.round((water.consumedMl / water.targetMl) * 100)}%`);
    }
    if (entries[0]) chips.push(`Latest mood: ${entries[0].mood}/5`);
    return chips;
  }, [profile, water, entries]);

  useEffect(() => {
    if (chat.length === 0) {
      setChat([
        {
          id: "intro-coach",
          role: "coach",
          text: "I’m your local Coach. Ask one of the suggested questions or type your own. I’ll use your saved data on this device to give the best answer I can.",
          meta: "Local · rule-based · profile-aware",
        },
      ]);
    }
  }, [chat.length]);

  function askQuestion(label: string, id: CoachQuestionId) {
    const answer = buildCoachAnswer(id, profile, macros, water, entries);

    setChat((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}-${Math.random()}`,
        role: "user",
        text: label,
      },
      {
        id: `coach-${Date.now()}-${Math.random()}`,
        role: "coach",
        text: answer.body,
        meta: answer.title,
      },
    ]);
  }

  function submitInput() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const mapped = mapInputToQuestion(trimmed);
    askQuestion(trimmed, mapped);
    setInput("");
  }

  return (
    <div className="space-y-8">
      <ToolPageHeader
        category="settings"
        title="Ask Coach"
        subtitle="A smart local coach that uses your saved profile, hydration, calculator data, and journal patterns to answer practical fitness questions."
      />

      <Card className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-secondary/15 text-accent-secondary ring-1 ring-white/10">
            <MessageSquareHeart className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-secondary/85">
              Coach console
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Ask better questions</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              This isn’t a generic chatbot. It uses your saved data on this device to give focused, practical guidance.
            </p>

            {summaryChips.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {summaryChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-surface-elevated/35 px-3 py-1 text-xs text-muted"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="p-5 lg:col-span-4 xl:col-span-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Suggested prompts</p>
          <div className="mt-4 grid gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => askQuestion(q.label, q.id)}
                className="rounded-2xl border border-border bg-surface-elevated/30 px-4 py-3 text-left text-sm text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-elevated/45 hover:text-foreground"
              >
                {q.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex min-h-[520px] flex-col p-0 lg:col-span-8 xl:col-span-9">
          <div className="border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-white/10">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/80">Conversation</p>
                <h3 className="text-base font-semibold text-foreground">Coach thread</h3>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            {chat.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl border px-4 py-3 shadow-sm",
                    message.role === "user"
                      ? "border-accent-secondary/25 bg-accent-secondary/10 text-foreground"
                      : "border-border bg-surface-elevated/35 text-foreground",
                  )}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-white/10",
                        message.role === "user"
                          ? "bg-accent-secondary/15 text-accent-secondary"
                          : "bg-accent/10 text-accent",
                      )}
                    >
                      {message.role === "user" ? (
                        <User2 className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <MessageSquareHeart className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {message.role === "user" ? "You" : "Coach"}
                    </span>
                  </div>

                  {message.meta ? (
                    <p className="mb-1 text-xs font-semibold text-accent-secondary">{message.meta}</p>
                  ) : null}

                  <p className="text-sm leading-relaxed text-muted">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 px-5 py-4 sm:px-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitInput();
                }}
                placeholder="Ask something like: why is my weight not changing?"
                className="flex-1 rounded-2xl border border-border bg-surface-elevated/30 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent-secondary/35 focus:bg-surface-elevated/45"
              />
              <button
                type="button"
                onClick={submitInput}
                className="inline-flex items-center gap-2 rounded-2xl border border-accent-secondary/30 bg-accent-secondary/10 px-4 py-3 text-sm font-semibold text-accent-secondary transition hover:bg-accent-secondary/15"
              >
                <Send className="h-4 w-4" aria-hidden />
                Send
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}