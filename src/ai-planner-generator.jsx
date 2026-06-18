import { useState } from "react";

// ── Tokens ─────────────────────────────────────────────────────
const T = {
  bg: "#f7f4ef",
  surface: "#fdfbf8",
  card: "#ffffff",
  border: "#e8e0d4",
  accent: "#2d5a27",
  accentLight: "#4a8f42",
  gold: "#c8953a",
  text: "#1a1a1a",
  muted: "#7a6e62",
  dark: "#1a2018",
  error: "#c0392b",
  success: "#2d6a4f",
};
const FB = "'DM Sans', system-ui, sans-serif";
const FS = "'Cormorant Garamond', Georgia, serif";

const STEPS = [
  { id: "life",    label: "Your Life",   icon: "◎" },
  { id: "goals",   label: "Goals",       icon: "◈" },
  { id: "routine", label: "Routine",     icon: "▦" },
  { id: "style",   label: "Style",       icon: "▤" },
];

const INIT = {
  life: { name: "", occupation: "", lifestyle: "busy-professional", device: "ipad" },
  goals: { yearGoal: "", topThree: "", areasOfFocus: [], trackingNeeds: "" },
  routine: { wakeTime: "6:00 AM", sleepTime: "10:00 PM", morningHabits: "", eveningHabits: "", keyBlocks: "" },
  style: { theme: "forest", layout: "structured", coverWord: "" },
};

const FOCUS_AREAS = ["Health & fitness","Career & work","Finance","Relationships","Learning","Creativity","Spirituality","Side project","Travel","Home & family"];
const THEMES = [
  { value: "forest", label: "Forest & Moss", bg: "#1a2018", accent: "#4a8f42", card: "#243022" },
  { value: "sand", label: "Sand & Rust", bg: "#2a1f14", accent: "#c8953a", card: "#352718" },
  { value: "slate", label: "Slate & Sky", bg: "#141e2a", accent: "#5a9fc8", card: "#1a2535" },
  { value: "cream", label: "Cream & Ink", bg: "#f7f4ef", accent: "#1a1a1a", card: "#ffffff" },
  { value: "plum", label: "Plum & Gold", bg: "#1a1028", accent: "#c8a96e", card: "#221535" },
];

// ── Helpers ────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>
    {children}{required && <span style={{ color: T.gold, marginLeft: 3 }}>*</span>}
  </div>
);
const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 12px", fontSize: 13, color: T.text, background: T.card, fontFamily: FB, outline: "none" }}
    onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
);
const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 12px", fontSize: 13, color: T.text, background: T.card, fontFamily: FB, resize: "vertical", outline: "none", lineHeight: 1.6 }}
    onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
);
const Row = ({ children, cols = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12, marginBottom: 14 }}>{children}</div>
);
const Field = ({ label, required, children }) => <div><Label required={required}>{label}</Label>{children}</div>;
const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 12px", fontSize: 13, color: T.text, background: T.card, fontFamily: FB }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ── Page previews ──────────────────────────────────────────────
function PagePreview({ page, theme }) {
  const th = THEMES.find(t => t.value === theme) || THEMES[0];
  const isLight = theme === "cream";
  const textColor = isLight ? th.accent : "#f0ede6";
  const mutedColor = isLight ? "#7a6e62" : "rgba(240,237,230,0.45)";
  const borderColor = isLight ? "#e8e0d4" : "rgba(240,237,230,0.12)";

  const renderContent = () => {
    switch (page.type) {
      case "cover":
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: mutedColor, textTransform: "uppercase", marginBottom: 10 }}>2026</div>
            <div style={{ fontFamily: FS, fontSize: 26, color: th.accent, lineHeight: 1.1, marginBottom: 6 }}>{page.title || "My Planner"}</div>
            <div style={{ width: 28, height: 2, background: th.accent, margin: "8px auto" }} />
            <div style={{ fontSize: 8, color: mutedColor, letterSpacing: "0.1em", lineHeight: 1.8, textTransform: "uppercase" }}>{page.subtitle || ""}</div>
          </div>
        );
      case "daily":
        return (
          <div style={{ padding: 10, height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: FS, fontSize: 14, color: th.accent, marginBottom: 2 }}>{page.dayName || "Monday"}</div>
            <div style={{ fontSize: 7, color: mutedColor, marginBottom: 8 }}>{page.date || "June 17, 2026"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, flex: 1 }}>
              <div>
                <div style={{ fontSize: 6, fontWeight: 700, color: th.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Time Blocks</div>
                {(page.timeBlocks || ["6am","7am","8am","9am","10am","11am","12pm","1pm"]).map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                    <div style={{ fontSize: 6, color: mutedColor, width: 20 }}>{t}</div>
                    <div style={{ flex: 1, height: 1, background: borderColor }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {(page.sections || ["Top 3","Gratitude","Notes"]).map((s, i) => (
                  <div key={i} style={{ background: isLight ? T.bg : "rgba(255,255,255,0.04)", borderRadius: 4, padding: "5px 6px", flex: i === 2 ? 1 : "none" }}>
                    <div style={{ fontSize: 6, fontWeight: 700, color: th.accent, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 3 }}>{s}</div>
                    {Array.from({ length: 2 }).map((_, j) => <div key={j} style={{ height: 1, background: borderColor, marginBottom: 4 }} />)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "habit":
        return (
          <div style={{ padding: 10, height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: FS, fontSize: 14, color: th.accent, marginBottom: 6 }}>Habit Tracker</div>
            <div style={{ fontSize: 7, color: mutedColor, marginBottom: 8 }}>June 2026</div>
            {(page.habits || ["Morning pages","Exercise","Read","Water","Meditate"]).map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 4 }}>
                <div style={{ fontSize: 7, color: textColor, width: 60, flexShrink: 0, lineHeight: 1.2 }}>{h}</div>
                <div style={{ display: "flex", gap: 1 }}>
                  {Array.from({ length: 15 }).map((_, j) => (
                    <div key={j} style={{ width: 7, height: 7, borderRadius: 1, background: Math.random() > 0.4 ? th.accent : "transparent", border: `1px solid ${borderColor}`, opacity: Math.random() > 0.4 ? 0.8 : 1 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case "weekly":
        return (
          <div style={{ padding: 10, height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
              <div style={{ fontFamily: FS, fontSize: 14, color: th.accent }}>Week {page.weekNum || 24}</div>
              <div style={{ fontSize: 6, color: mutedColor }}>Jun 9–15</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, flex: 1 }}>
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ background: i >= 5 ? T.gold : th.accent, borderRadius: "2px 2px 0 0", padding: "3px 2px", textAlign: "center" }}>
                    <div style={{ fontSize: 6, fontWeight: 700, color: "#fff" }}>{d}</div>
                  </div>
                  <div style={{ flex: 1, background: isLight ? T.bg : "rgba(255,255,255,0.04)", border: `1px solid ${borderColor}`, borderTop: "none", borderRadius: "0 0 2px 2px" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginTop: 4 }}>
              {["Priorities","Notes"].map(l => (
                <div key={l} style={{ background: isLight ? T.bg : "rgba(255,255,255,0.04)", borderRadius: 3, padding: "4px 5px" }}>
                  <div style={{ fontSize: 5, fontWeight: 700, color: th.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                  {Array.from({ length: 3 }).map((_, j) => <div key={j} style={{ height: 1, background: borderColor, marginBottom: 3 }} />)}
                </div>
              ))}
            </div>
          </div>
        );
      case "goals":
        return (
          <div style={{ padding: 10, height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: FS, fontSize: 14, color: th.accent, marginBottom: 6 }}>Goals 2026</div>
            {(page.quarters || ["Q1","Q2","Q3","Q4"]).map((q, i) => (
              <div key={i} style={{ background: isLight ? T.bg : "rgba(255,255,255,0.04)", borderRadius: 4, padding: "5px 7px", marginBottom: 4 }}>
                <div style={{ fontSize: 6, fontWeight: 700, color: th.accent, letterSpacing: "0.08em", marginBottom: 3 }}>{q}</div>
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 3 }}>
                    <div style={{ width: 6, height: 6, border: `1px solid ${borderColor}`, borderRadius: 1 }} />
                    <div style={{ flex: 1, height: 1, background: borderColor }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ background: th.bg, borderRadius: 8, aspectRatio: "3/4", overflow: "hidden", border: `1px solid ${isLight ? T.border : "rgba(255,255,255,0.08)"}`, position: "relative" }}>
      {renderContent()}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function DigitalPlannerGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INIT);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [activePreview, setActivePreview] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (section, k, v) => setForm(f => ({ ...f, [section]: { ...f[section], [k]: v } }));
  const toggleFocus = (area) => setForm(f => {
    const cur = f.goals.areasOfFocus;
    const next = cur.includes(area) ? cur.filter(a => a !== area) : [...cur, area];
    return { ...f, goals: { ...f.goals, areasOfFocus: next } };
  });

  const generate = async () => {
    if (!form.life.name) { setErrorMsg("Please enter your name to personalize the planner."); return; }
    setStatus("loading"); setErrorMsg("");

    const prompt = `You are an expert productivity coach and planner designer. Generate a completely personalized digital planner structure for this person. Return ONLY valid JSON, no markdown, no explanation.

PERSON: ${form.life.name}
OCCUPATION: ${form.life.occupation}
LIFESTYLE: ${form.life.lifestyle}
DEVICE: ${form.life.device}

YEARLY GOAL: ${form.goals.yearGoal}
TOP 3 PRIORITIES: ${form.goals.topThree}
FOCUS AREAS: ${form.goals.areasOfFocus.join(", ")}
TRACKING NEEDS: ${form.goals.trackingNeeds}

WAKE TIME: ${form.routine.wakeTime}
SLEEP TIME: ${form.routine.sleepTime}
MORNING HABITS: ${form.routine.morningHabits}
EVENING HABITS: ${form.routine.eveningHabits}
KEY TIME BLOCKS: ${form.routine.keyBlocks}

PLANNER THEME: ${form.style.theme}
LAYOUT STYLE: ${form.style.layout}
COVER WORD: ${form.style.coverWord || "intentional"}

Return this exact JSON:
{
  "plannerTitle": "personalized planner title (3-5 words, e.g. 'The Focused Year' or their name + 'Planner')",
  "plannerSubtitle": "short personalized tagline (8-12 words)",
  "intention": "one powerful sentence that captures what this planner is for — personal to this person",
  "coverPage": {
    "title": "planner title",
    "subtitle": "subtitle",
    "word": "the one word that defines this year for them based on their goals"
  },
  "habits": ["habit1 (personalized)", "habit2", "habit3", "habit4", "habit5", "habit6", "habit7", "habit8"],
  "dailyPageSections": ["section1 (personalized)", "section2", "section3", "section4"],
  "dailyTimeBlocks": ["time1", "time2", "time3", "time4", "time5", "time6", "time7", "time8"],
  "weeklyPageSections": ["section1", "section2", "section3"],
  "quarterlyGoals": {
    "Q1": "suggested Q1 goal based on their priorities",
    "Q2": "suggested Q2 goal",
    "Q3": "suggested Q3 goal",
    "Q4": "suggested Q4 goal"
  },
  "morningRoutine": ["step1 (time-stamped)", "step2", "step3", "step4", "step5"],
  "eveningRoutine": ["step1 (time-stamped)", "step2", "step3", "step4"],
  "affirmation": "one personalized daily affirmation based on their goals",
  "plannerPages": [
    { "type": "cover", "name": "Cover", "purpose": "why this cover is designed this way" },
    { "type": "yearly", "name": "Year at a Glance", "purpose": "..." },
    { "type": "goals", "name": "Quarterly Goals", "purpose": "..." },
    { "type": "monthly", "name": "Monthly Calendar", "purpose": "..." },
    { "type": "weekly", "name": "Weekly Spread", "purpose": "..." },
    { "type": "daily", "name": "Daily Page", "purpose": "..." },
    { "type": "habit", "name": "Habit Tracker", "purpose": "..." },
    { "type": "notes", "name": "Reflection Notes", "purpose": "..." }
  ],
  "gumroadDescription": "3-sentence personalized product description for selling this planner type on Gumroad"
}

Make everything specific to this person's actual life — their occupation, wake time, habits, and goals should be reflected throughout. The quarterly goals should feel like a real roadmap, not generic placeholders.
Return ONLY the JSON object.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Generation failed. Please try again.");
      console.error(err);
    }
  };

  // ── Result view ────────────────────────────────────────────
  if (status === "done" && result) {
    const previewPages = [
      { type: "cover", title: result.coverPage?.title, subtitle: result.coverPage?.subtitle },
      { type: "daily", dayName: "Monday", timeBlocks: result.dailyTimeBlocks, sections: result.dailyPageSections },
      { type: "habit", habits: result.habits },
      { type: "weekly", weekNum: 24 },
      { type: "goals", quarters: ["Q1","Q2","Q3","Q4"] },
    ];
    const th = THEMES.find(t => t.value === form.style.theme) || THEMES[0];

    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: FB }}>
        {/* Header */}
        <div style={{ background: T.dark, padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: FS, fontSize: 22, color: T.gold }}>{result.plannerTitle}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{result.plannerSubtitle}</div>
          </div>
          <button onClick={() => { setStatus("idle"); setResult(null); setStep(0); }}
            style={{ background: "none", border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 6, padding: "6px 14px", fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
            Start over
          </button>
        </div>

        <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Left: Page previews */}
          <div>
            <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Page Previews — {previewPages.length} page types</div>

            {/* Main preview */}
            <div style={{ marginBottom: 12 }}>
              <PagePreview page={previewPages[activePreview]} theme={form.style.theme} />
            </div>

            {/* Thumb row */}
            <div style={{ display: "flex", gap: 8 }}>
              {previewPages.map((p, i) => (
                <div key={i} onClick={() => setActivePreview(i)} style={{ flex: 1, cursor: "pointer", opacity: activePreview === i ? 1 : 0.5, transition: "opacity 0.15s", border: activePreview === i ? `2px solid ${T.accent}` : "2px solid transparent", borderRadius: 5 }}>
                  <PagePreview page={p} theme={form.style.theme} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: T.muted, textAlign: "center" }}>
              {["Cover","Daily","Habit Tracker","Weekly","Goals"][activePreview]} page — tap thumbnails to browse
            </div>
          </div>

          {/* Right: Generated content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Intention */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Your Planner Intention</div>
              <div style={{ fontFamily: FS, fontSize: 16, color: T.text, lineHeight: 1.6, fontStyle: "italic" }}>"{result.intention}"</div>
              <div style={{ marginTop: 10, fontSize: 11, color: T.muted }}>Word of the year: <strong style={{ color: T.accent }}>{result.coverPage?.word}</strong></div>
            </div>

            {/* Habits */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Your Habit Tracker</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {result.habits?.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 1, background: T.accent, flexShrink: 0 }} />
                    <div style={{ fontSize: 11, color: T.text }}>{h}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarterly goals */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Quarterly Roadmap</div>
              {result.quarterlyGoals && Object.entries(result.quarterlyGoals).map(([q, goal]) => (
                <div key={q} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{ background: T.accent, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, flexShrink: 0, marginTop: 2 }}>{q}</div>
                  <div style={{ fontSize: 11, color: T.text, lineHeight: 1.5 }}>{goal}</div>
                </div>
              ))}
            </div>

            {/* Morning + evening routines */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Morning Routine", items: result.morningRoutine, color: T.gold },
                { label: "Evening Routine", items: result.eveningRoutine, color: T.accent },
              ].map(({ label, items, color }) => (
                <div key={label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                  {items?.map((item, i) => (
                    <div key={i} style={{ fontSize: 10, color: T.text, lineHeight: 1.5, marginBottom: 4, display: "flex", gap: 5 }}>
                      <span style={{ color, flexShrink: 0 }}>·</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Affirmation */}
            <div style={{ background: T.dark, borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Daily Affirmation</div>
              <div style={{ fontFamily: FS, fontSize: 14, color: T.gold, lineHeight: 1.6, fontStyle: "italic" }}>"{result.affirmation}"</div>
            </div>

            {/* Print note */}
            <div style={{ background: "#eef5ee", border: `1px solid #c8e0c4`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: T.accent, lineHeight: 1.6 }}>
                <strong>To build in Canva:</strong> Set canvas to A4 (2480×3508px), use the {THEMES.find(t=>t.value===form.style.theme)?.label} color theme, and recreate each page type above. Export as multi-page PDF. This is your sellable product.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────
  const stepPanels = [
    // Life
    <div key="life">
      <Row><Field label="Your name" required><Input value={form.life.name} onChange={v => set("life","name",v)} placeholder="Jamie" /></Field>
      <Field label="Occupation"><Input value={form.life.occupation} onChange={v => set("life","occupation",v)} placeholder="Marketing manager, freelance designer, teacher…" /></Field></Row>
      <Row><Field label="Lifestyle">
        <Select value={form.life.lifestyle} onChange={v => set("life","lifestyle",v)} options={[
          { value: "busy-professional", label: "Busy professional — always on" },
          { value: "entrepreneur", label: "Entrepreneur / self-employed" },
          { value: "student", label: "Student" },
          { value: "parent", label: "Parent — family-first" },
          { value: "creative", label: "Creative / freelancer" },
          { value: "minimalist", label: "Minimalist — keep it simple" },
        ]} />
      </Field>
      <Field label="Primary device">
        <Select value={form.life.device} onChange={v => set("life","device",v)} options={[
          { value: "ipad", label: "iPad (GoodNotes / Notability)" },
          { value: "android", label: "Android tablet" },
          { value: "pdf", label: "PDF on laptop / print" },
        ]} />
      </Field></Row>
    </div>,

    // Goals
    <div key="goals">
      <Row cols={1}><Field label="Your #1 goal for 2026" required><Input value={form.goals.yearGoal} onChange={v => set("goals","yearGoal",v)} placeholder="Launch my business and replace my salary" /></Field></Row>
      <Row cols={1}><Field label="Top 3 priorities this year"><Textarea value={form.goals.topThree} onChange={v => set("goals","topThree",v)} placeholder="1. Hit $5K/month revenue&#10;2. Exercise 4x/week&#10;3. Read 24 books" rows={3} /></Field></Row>
      <div style={{ marginBottom: 14 }}>
        <Label>Focus areas (pick all that apply)</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {FOCUS_AREAS.map(area => (
            <button key={area} onClick={() => toggleFocus(area)} style={{
              background: form.goals.areasOfFocus.includes(area) ? T.accent : T.card,
              color: form.goals.areasOfFocus.includes(area) ? "#fff" : T.muted,
              border: `1px solid ${form.goals.areasOfFocus.includes(area) ? T.accent : T.border}`,
              borderRadius: 20, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: FB,
            }}>{area}</button>
          ))}
        </div>
      </div>
      <Row cols={1}><Field label="What do you most want to track?"><Input value={form.goals.trackingNeeds} onChange={v => set("goals","trackingNeeds",v)} placeholder="Sleep, water, workouts, spending, reading, mood…" /></Field></Row>
    </div>,

    // Routine
    <div key="routine">
      <Row><Field label="Wake time"><Input value={form.routine.wakeTime} onChange={v => set("routine","wakeTime",v)} placeholder="6:00 AM" /></Field>
      <Field label="Sleep time"><Input value={form.routine.sleepTime} onChange={v => set("routine","sleepTime",v)} placeholder="10:00 PM" /></Field></Row>
      <Row cols={1}><Field label="Morning habits (what do you do or want to do each morning?)"><Textarea value={form.routine.morningHabits} onChange={v => set("routine","morningHabits",v)} placeholder="Journal, workout, meditate, read, cold shower…" rows={2} /></Field></Row>
      <Row cols={1}><Field label="Evening habits"><Textarea value={form.routine.eveningHabits} onChange={v => set("routine","eveningHabits",v)} placeholder="Review tomorrow, read, no screens after 9pm…" rows={2} /></Field></Row>
      <Row cols={1}><Field label="Key time blocks in your day"><Input value={form.routine.keyBlocks} onChange={v => set("routine","keyBlocks",v)} placeholder="Deep work 8–11am, calls 1–3pm, gym 5pm" /></Field></Row>
    </div>,

    // Style
    <div key="style">
      <div style={{ marginBottom: 14 }}>
        <Label>Color theme</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {THEMES.map(th => (
            <div key={th.value} onClick={() => set("style","theme",th.value)} style={{
              cursor: "pointer", borderRadius: 8, overflow: "hidden",
              border: form.style.theme === th.value ? `2px solid ${T.accent}` : `2px solid transparent`,
            }}>
              <div style={{ height: 40, background: th.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: th.accent }} />
              </div>
              <div style={{ fontSize: 9, color: T.muted, textAlign: "center", padding: "3px 2px", background: T.card }}>{th.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Row><Field label="Layout style">
        <Select value={form.style.layout} onChange={v => set("style","layout",v)} options={[
          { value: "structured", label: "Structured — time blocks, clear sections" },
          { value: "flexible", label: "Flexible — open space, freeform" },
          { value: "minimal", label: "Minimal — less is more" },
          { value: "detailed", label: "Detailed — every hour planned" },
        ]} />
      </Field>
      <Field label="Your word for the year"><Input value={form.style.coverWord} onChange={v => set("style","coverWord",v)} placeholder="Focus, expand, bloom, build…" /></Field></Row>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: FB }}>
      <div style={{ background: T.dark, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: FS, fontSize: 20, color: T.gold }}>AI Digital Planner Generator</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Powered by Claude · Personalized to your life and goals</div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Step {step + 1} / {STEPS.length}</div>
      </div>

      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 28px", display: "flex", background: T.surface }}>
        {STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setStep(i)} style={{
            background: "none", border: "none",
            borderBottom: step === i ? `2px solid ${T.accent}` : "2px solid transparent",
            color: step === i ? T.accent : i < step ? T.success : T.muted,
            fontFamily: FB, fontSize: 12, fontWeight: 600,
            padding: "12px 16px", cursor: "pointer", whiteSpace: "nowrap",
          }}>
            {i < step ? "✓ " : `${s.icon} `}{s.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, padding: "24px 24px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{STEPS[step].label}</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>
            {["Tell Claude about your life so the planner fits you.", "What are you working toward this year?", "How do your days actually run?", "How should your planner look and feel?"][step]}
          </div>
          {stepPanels[step]}
        </div>

        {errorMsg && (
          <div style={{ marginTop: 12, background: "#fdf2f2", border: `1px solid #f5c6c6`, borderRadius: 6, padding: "10px 14px", fontSize: 12, color: T.error }}>{errorMsg}</div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 20px", fontSize: 13, color: step === 0 ? T.border : T.muted, cursor: step === 0 ? "default" : "pointer" }}>
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 6, padding: "9px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Next →
            </button>
          ) : (
            <button onClick={generate} disabled={status === "loading"}
              style={{ background: status === "loading" ? T.muted : T.gold, color: "#fff", border: "none", borderRadius: 6, padding: "9px 28px", fontSize: 13, fontWeight: 700, cursor: status === "loading" ? "default" : "pointer", minWidth: 210 }}>
              {status === "loading" ? "Building your planner…" : "✦ Generate my planner"}
            </button>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? T.accent : i < step ? T.success : T.border, transition: "all 0.2s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
