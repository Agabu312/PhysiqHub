import { createId } from "@/lib/id";
import type {
  GeneratedWorkoutSplit,
  Goal,
  SplitDayPlan,
  SplitEmphasis,
  SplitExercise,
  TrainingExperience,
} from "@/lib/types";

export type SplitGeneratorInput = {
  goal: Goal;
  experience: TrainingExperience;
  daysPerWeek: 2 | 3 | 4 | 5 | 6;
  emphasis: SplitEmphasis;
  injuryNotes?: string;
  /** Increment on “Regenerate” to nudge copy without changing core structure */
  regenIndex?: number;
};

function ex(name: string, setsReps: string): SplitExercise {
  return { name, setsReps };
}

function vol(exp: TrainingExperience): string {
  if (exp === "beginner") return "3×8–12";
  if (exp === "intermediate") return "4×6–10";
  return "4–5×4–8";
}

function accessory(exp: TrainingExperience): string {
  if (exp === "beginner") return "3×10–15";
  return "3×12–20";
}

function injurySuffix(notes?: string): string {
  if (!notes?.trim()) return "";
  return ` Injury note: ${notes.trim()}—reduce ranges of motion or loads if anything sharpens pain.`;
}

export function generateWorkoutSplit(input: SplitGeneratorInput): GeneratedWorkoutSplit {
  const v = vol(input.experience);
  const a = accessory(input.experience);
  const inj = injurySuffix(input.injuryNotes);
  const days = input.daysPerWeek;
  const g = input.goal;
  const em = input.emphasis;
  const regen = input.regenIndex ?? 0;

  let title = "";
  let summary = "";
  let plan: SplitDayPlan[] = [];

  const fatLossNote =
    g === "lose_fat"
      ? " Keep rest periods honest and finish sessions with a brisk 10–15 min walk when possible."
      : "";
  const strengthBias =
    em === "push_strength" ? " Prioritize main lifts first while fresh." : "";
  const aestheticBias =
    em === "aesthetics" ? " Add 1–2 isolation finishers per session for arms/calves/delts." : "";

  if (days === 2) {
    title = "2-day full body";
    summary = `Two full-body sessions per week. Ideal for minimum effective dose.${fatLossNote}${inj}`;
    plan = [
      {
        dayLabel: "Day 1",
        focus: "Full body A · squat pattern + push + pull",
        exercises: [
          ex("Back squat or goblet squat", v),
          ex("Bench press or dumbbell press", v),
          ex("Barbell row or chest-supported row", v),
          ex("Core (dead bug / plank)", "3×30–60s"),
        ],
        guidance: `Start conservative on RPE. ${a} for arms or calves if time.${strengthBias}`,
      },
      {
        dayLabel: "Day 2",
        focus: "Full body B · hinge + single-leg + shoulders",
        exercises: [
          ex("Romanian deadlift or hip hinge", v),
          ex("Split squat or lunge", v),
          ex("Overhead press", v),
          ex("Lat pulldown or pull-up variation", v),
        ],
        guidance: `Alternate A/B weekly if desired (swap hinge/squat emphasis).${aestheticBias}${inj}`,
      },
    ];
  } else if (days === 3) {
    if (em === "upper" || em === "push_strength") {
      title = "3-day upper / lower / upper";
      summary = `Upper-leaning week with three quality exposures.${fatLossNote}${inj}`;
      plan = [
        {
          dayLabel: "Day 1",
          focus: "Upper · horizontal push/pull",
          exercises: [
            ex("Bench or incline press", v),
            ex("Row variation", v),
            ex("Lateral raise", a),
            ex("Triceps pressdown", a),
          ],
          guidance: `Keep shoulders packed; stop sets before form breaks.${strengthBias}`,
        },
        {
          dayLabel: "Day 2",
          focus: "Lower · hinge + quad",
          exercises: [
            ex("Squat or leg press", v),
            ex("Romanian deadlift", v),
            ex("Leg curl or Nordic curl", a),
            ex("Calf raise", a),
          ],
          guidance: `Brace hard; match hinge depth to mobility.${inj}`,
        },
        {
          dayLabel: "Day 3",
          focus: "Upper · vertical pull + arms",
          exercises: [
            ex("Pull-up or pulldown", v),
            ex("Overhead press", v),
            ex("Chest-supported rear delt", a),
            ex("Hammer curl", a),
          ],
          guidance: `If elbows bother you, rotate grips week to week.${inj}`,
        },
      ];
    } else if (em === "lower") {
      title = "3-day lower / upper / lower";
      summary = `Lower emphasis with one upper maintenance day.${fatLossNote}${inj}`;
      plan = [
        {
          dayLabel: "Day 1",
          focus: "Lower · squat bias",
          exercises: [
            ex("Squat pattern", v),
            ex("Leg press or hack squat", v),
            ex("Leg extension", a),
            ex("Standing calf", a),
          ],
          guidance: `Knees track toes; control eccentrics.${inj}`,
        },
        {
          dayLabel: "Day 2",
          focus: "Upper · maintenance",
          exercises: [
            ex("Bench press", v),
            ex("Row", v),
            ex("Face pull", a),
          ],
          guidance: `Maintain strength without trashing recovery.${inj}`,
        },
        {
          dayLabel: "Day 3",
          focus: "Lower · hinge bias",
          exercises: [
            ex("Deadlift or RDL", v),
            ex("Lunge or split squat", v),
            ex("Leg curl", a),
            ex("Core carry", "3×40m"),
          ],
          guidance: `Hinge with neutral spine; stop if low back rounds.${inj}`,
        },
      ];
    } else {
      title = "3-day full body";
      summary = `Three full-body sessions; great for beginners and busy schedules.${fatLossNote}${inj}`;
      plan = [
        {
          dayLabel: "Day 1",
          focus: "Full body · squat + push + pull",
          exercises: [
            ex("Squat", v),
            ex("Push (bench or DB press)", v),
            ex("Row", v),
            ex("Core", "3×8–12"),
          ],
          guidance: `Leave 1–2 reps in reserve on most sets.${inj}`,
        },
        {
          dayLabel: "Day 2",
          focus: "Full body · hinge + single leg",
          exercises: [
            ex("Hinge (RDL)", v),
            ex("Single-leg squat", v),
            ex("Vertical push", v),
            ex("Vertical pull", v),
          ],
          guidance: `Quality over load.${aestheticBias}${inj}`,
        },
        {
          dayLabel: "Day 3",
          focus: "Full body · compounds + arms",
          exercises: [
            ex("Leg press or front squat", v),
            ex("Incline press", v),
            ex("Pulldown", v),
            ex("Arms superset", a),
          ],
          guidance: `Optional finisher: 10 min easy bike.${inj}`,
        },
      ];
    }
  } else if (days === 4) {
    title = "4-day upper / lower";
    summary = `Classic split for balanced frequency and recovery.${fatLossNote}${inj}`;
    plan = [
      {
        dayLabel: "Day 1",
        focus: "Upper strength",
        exercises: [
          ex("Bench press", v),
          ex("Weighted pull-up or lat pulldown", v),
          ex("Shoulder accessory", a),
        ],
        guidance: `Main lifts first.${strengthBias}${inj}`,
      },
      {
        dayLabel: "Day 2",
        focus: "Lower strength",
        exercises: [
          ex("Squat", v),
          ex("Romanian deadlift", v),
          ex("Leg curl", a),
        ],
        guidance: `Brace and film a set occasionally for form checks.${inj}`,
      },
      {
        dayLabel: "Day 3",
        focus: "Upper volume",
        exercises: [
          ex("Incline DB press", v),
          ex("Cable row", v),
          ex("Arms + rear delts", a),
        ],
        guidance: `Chase quality reps; add a drop set on one isolation if recovered.${aestheticBias}`,
      },
      {
        dayLabel: "Day 4",
        focus: "Lower volume + posterior chain",
        exercises: [
          ex("Leg press or hack squat", v),
          ex("Hip thrust or glute bridge", v),
          ex("Calf + core", a),
        ],
        guidance: `Keep joints comfortable; adjust stance width as needed.${inj}`,
      },
    ];
  } else if (days === 5) {
    title = "5-day hybrid (push / pull / legs + upper / lower)";
    summary = `High frequency with a pragmatic 5th day for weak points.${fatLossNote}${inj}`;
    plan = [
      {
        dayLabel: "Day 1",
        focus: "Push",
        exercises: [
          ex("Bench press", v),
          ex("Overhead press", v),
          ex("Triceps + lateral raise", a),
        ],
        guidance: `Stop before grinding reps.${inj}`,
      },
      {
        dayLabel: "Day 2",
        focus: "Pull",
        exercises: [
          ex("Deadlift or rack pull", v),
          ex("Row variation", v),
          ex("Face pull + curl", a),
        ],
        guidance: `Hinge technique beats ego weight.${inj}`,
      },
      {
        dayLabel: "Day 3",
        focus: "Legs",
        exercises: [
          ex("Squat", v),
          ex("Leg press or lunge", v),
          ex("Leg curl + calf", a),
        ],
        guidance: `Knee-friendly variations welcome.${inj}`,
      },
      {
        dayLabel: "Day 4",
        focus: "Upper (weak point)",
        exercises: [
          ex("Incline press or row (rotate weekly)", v),
          ex("Chest-supported row or pulldown", v),
          ex("Arm superset", a),
        ],
        guidance: `Pick the pattern you are trying to bring up.${aestheticBias}`,
      },
      {
        dayLabel: "Day 5",
        focus: "Lower (weak point)",
        exercises: [
          ex("Hinge emphasis (RDL or good morning)", v),
          ex("Single-leg quad work", v),
          ex("Core carry", "3×40m"),
        ],
        guidance: `Keep total hard sets sane if sleep is short.${inj}`,
      },
    ];
  } else {
    title = "6-day push / pull / legs ×2";
    summary = `High-frequency PPL. Best for advanced trainees with recovery headroom.${fatLossNote}${inj}`;
    plan = [
      {
        dayLabel: "Day 1",
        focus: "Push A",
        exercises: [
          ex("Bench press", v),
          ex("Incline press", v),
          ex("Lateral raise + triceps", a),
        ],
        guidance: `Rotate bench variations every 4–6 weeks if joints need it.${inj}`,
      },
      {
        dayLabel: "Day 2",
        focus: "Pull A",
        exercises: [
          ex("Deadlift or trap bar", v),
          ex("Row", v),
          ex("Pulldown + curl", a),
        ],
        guidance: `Manage low-back fatigue heading into leg days.${inj}`,
      },
      {
        dayLabel: "Day 3",
        focus: "Legs A",
        exercises: [
          ex("Squat", v),
          ex("Leg press", v),
          ex("Leg curl + calf", a),
        ],
        guidance: `Depth you own every rep.${inj}`,
      },
      {
        dayLabel: "Day 4",
        focus: "Push B",
        exercises: [
          ex("Overhead press", v),
          ex("Dumbbell press", v),
          ex("Triceps + rear delt", a),
        ],
        guidance: `Second exposure—slightly less load than A.${strengthBias}`,
      },
      {
        dayLabel: "Day 5",
        focus: "Pull B",
        exercises: [
          ex("Rack pull or hip hinge", v),
          ex("Chest-supported row", v),
          ex("Pull-down + hammer curl", a),
        ],
        guidance: `Bias volume to upper back if deadlift-heavy earlier.${inj}`,
      },
      {
        dayLabel: "Day 6",
        focus: "Legs B",
        exercises: [
          ex("Front squat or safety bar squat", v),
          ex("Romanian deadlift", v),
          ex("Split squat + core", a),
        ],
        guidance: `If performance drops, insert a rest day before repeating.${inj}`,
      },
    ];
  }

  if (em === "fat_loss_support" && days <= 4) {
    summary += " Conditioning: add 2×20 min Zone 2 weekly on off days if recovery allows.";
  }

  const regenNotes = [
    "",
    " Rotation note: keep one “easy” day weekly if sleep is inconsistent.",
    " Rotation note: swap barbell and dumbbell variants every 3–4 weeks.",
    " Rotation note: add a deload week after two hard weeks if performance dips.",
  ];
  const regenSuffix = regenNotes[regen % regenNotes.length];

  return {
    id: createId(),
    generatedAt: new Date().toISOString(),
    title,
    summary: summary + strengthBias + regenSuffix,
    daysPerWeek: days,
    days: plan,
  };
}
