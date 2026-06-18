import { useState } from "react";

// ── Design tokens ──────────────────────────────────────────────
const T = {
  bg: "#f7f5f2",
  surface: "#ffffff",
  border: "#e4e0d8",
  accent: "#1e3a5f",
  accentLight: "#2d5a8e",
  gold: "#c8953a",
  text: "#1a1a1a",
  muted: "#6b6560",
  success: "#2d6a4f",
  error: "#c0392b",
};

const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const FONT_RESUME_NAME = "'Libre Baskerville', Georgia, serif";

// ── Step definitions ───────────────────────────────────────────
const STEPS = [
  { id: "basics",     label: "Basics",      icon: "◎" },
  { id: "summary",    label: "Focus",       icon: "◈" },
  { id: "experience", label: "Experience",  icon: "▦" },
  { id: "education",  label: "Education",   icon: "◫" },
  { id: "skills",     label: "Skills",      icon: "▤" },
];

const INITIAL = {
  basics: { name: "", title: "", email: "", phone: "", location: "", linkedin: "", portfolio: "" },
  summary: { role: "", yearsExp: "", tone: "professional", topStrengths: "", targetCompany: "" },
  experience: [{ company: "", title: "", dates: "", bullets: "" }],
  education: [{ school: "", degree: "", dates: "", note: "" }],
  skills: { list: "", certifications: "", languages: "" },
};

// ── Tiny helpers ───────────────────────────────────────────────
const Label = ({ children, required }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>
    {children}{required && <span style={{ color: T.gold, marginLeft: 3 }}>*</span>}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%", boxSizing: "border-box",
      border: `1px solid ${T.border}`, borderRadius: 6,
      padding: "9px 12px", fontSize: 13, color: T.text,
      background: T.surface, fontFamily: FONT_BODY,
      outline: "none", transition: "border 0.15s",
    }}
    onFocus={e => e.target.style.borderColor = T.accent}
    onBlur={e => e.target.style.borderColor = T.border}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: "100%", boxSizing: "border-box",
      border: `1px solid ${T.border}`, borderRadius: 6,
      padding: "9px 12px", fontSize: 13, color: T.text,
      background: T.surface, fontFamily: FONT_BODY,
      resize: "vertical", outline: "none", lineHeight: 1.6,
    }}
    onFocus={e => e.target.style.borderColor = T.accent}
    onBlur={e => e.target.style.borderColor = T.border}
  />
);

const Row = ({ children, cols = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12, marginBottom: 14 }}>
    {children}
  </div>
);

const Field = ({ label, required, children }) => (
  <div><Label required={required}>{label}</Label>{children}</div>
);

// ── Resume renderer ────────────────────────────────────────────
function ResumePreview({ data }) {
  const { basics, generated } = data;
  if (!generated) return null;

  const g = generated;

  return (
    <div id="resume-output" style={{
      background: "#fff", fontFamily: FONT_BODY,
      width: "100%", maxWidth: 740, margin: "0 auto",
      boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
      display: "flex", minHeight: 960,
    }}>
      {/* Sidebar */}
      <div style={{ width: 210, background: T.accent, padding: "32px 18px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Avatar */}
        <div style={{
          width: 58, height: 58, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT_RESUME_NAME, fontSize: 20, color: "#fff", marginBottom: 18,
        }}>
          {basics.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>

        {/* Contact */}
        <SideSection title="Contact">
          {[
            { l: "Email", v: basics.email },
            { l: "Phone", v: basics.phone },
            { l: "Location", v: basics.location },
            basics.linkedin && { l: "LinkedIn", v: basics.linkedin },
            basics.portfolio && { l: "Portfolio", v: basics.portfolio },
          ].filter(Boolean).map(({ l, v }) => v ? (
            <div key={l} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 1 }}>{l}</div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, wordBreak: "break-all" }}>{v}</div>
            </div>
          ) : null)}
        </SideSection>

        {/* Skills */}
        {g.skills && g.skills.length > 0 && (
          <SideSection title="Skills">
            {g.skills.map(s => (
              <div key={s} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.08)", borderRadius: 3, padding: "2px 6px", marginBottom: 3 }}>{s}</div>
            ))}
          </SideSection>
        )}

        {/* Certifications */}
        {g.certifications && g.certifications.length > 0 && (
          <SideSection title="Certifications">
            {g.certifications.map(c => (
              <div key={c} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.85)", marginBottom: 4, lineHeight: 1.4 }}>{c}</div>
            ))}
          </SideSection>
        )}

        {/* Languages */}
        {g.languages && g.languages.length > 0 && (
          <SideSection title="Languages">
            {g.languages.map(l => (
              <div key={l} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.85)", marginBottom: 3 }}>{l}</div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "32px 28px" }}>
        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: FONT_RESUME_NAME, fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1.1, marginBottom: 4 }}>{basics.name}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>{basics.title}</div>
        </div>

        {/* Summary */}
        {g.summary && (
          <ResSection title="Professional Summary">
            <p style={{ fontSize: 11, color: T.text, lineHeight: 1.65, margin: 0 }}>{g.summary}</p>
          </ResSection>
        )}

        {/* Experience */}
        {g.experience && g.experience.length > 0 && (
          <ResSection title="Experience">
            {g.experience.map((job, i) => (
              <div key={i} style={{ marginBottom: i < g.experience.length - 1 ? 14 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{job.title}</span>
                    {job.company && <span style={{ fontSize: 11, color: T.muted, marginLeft: 5 }}>· {job.company}</span>}
                  </div>
                  {job.dates && <div style={{ fontSize: 10, color: T.muted, whiteSpace: "nowrap", marginLeft: 8 }}>{job.dates}</div>}
                </div>
                {job.bullets && job.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 15 }}>
                    {job.bullets.map((b, j) => (
                      <li key={j} style={{ fontSize: 11, color: T.text, lineHeight: 1.6, marginBottom: 2 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ResSection>
        )}

        {/* Education */}
        {g.education && g.education.length > 0 && (
          <ResSection title="Education">
            {g.education.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: i < g.education.length - 1 ? 10 : 0 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{e.degree}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{e.school}{e.note ? ` · ${e.note}` : ""}</div>
                </div>
                {e.dates && <div style={{ fontSize: 10, color: T.muted, whiteSpace: "nowrap", marginLeft: 8 }}>{e.dates}</div>}
              </div>
            ))}
          </ResSection>
        )}
      </div>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 4, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function ResSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accent, borderBottom: `2px solid ${T.accent}`, paddingBottom: 3, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

// ── Main app ───────────────────────────────────────────────────
export default function AIResumeBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Form helpers ──
  const setBasics = (k, v) => setForm(f => ({ ...f, basics: { ...f.basics, [k]: v } }));
  const setSummary = (k, v) => setForm(f => ({ ...f, summary: { ...f.summary, [k]: v } }));
  const setSkills = (k, v) => setForm(f => ({ ...f, skills: { ...f.skills, [k]: v } }));
  const setExp = (i, k, v) => setForm(f => {
    const exp = [...f.experience]; exp[i] = { ...exp[i], [k]: v }; return { ...f, experience: exp };
  });
  const addExp = () => setForm(f => ({ ...f, experience: [...f.experience, { company: "", title: "", dates: "", bullets: "" }] }));
  const removeExp = (i) => setForm(f => ({ ...f, experience: f.experience.filter((_, j) => j !== i) }));
  const setEdu = (i, k, v) => setForm(f => {
    const edu = [...f.education]; edu[i] = { ...edu[i], [k]: v }; return { ...f, education: edu };
  });
  const addEdu = () => setForm(f => ({ ...f, education: [...f.education, { school: "", degree: "", dates: "", note: "" }] }));

  // ── Claude API call ──
  const generate = async () => {
    if (!form.basics.name || !form.basics.email) {
      setErrorMsg("Please fill in at least your name and email before generating.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const prompt = `You are an expert resume writer. Generate a complete, polished, ATS-optimized resume based on the following input. Return ONLY valid JSON with no markdown, no explanation.

INPUT:
Name: ${form.basics.name}
Target title: ${form.basics.title || form.summary.role}
Years of experience: ${form.summary.yearsExp}
Tone: ${form.summary.tone}
Top strengths: ${form.summary.topStrengths}
Target company/industry: ${form.summary.targetCompany}

Experience entries:
${form.experience.map((e, i) => `${i+1}. ${e.title} at ${e.company} (${e.dates})\nRaw bullets: ${e.bullets}`).join("\n\n")}

Education:
${form.education.map(e => `${e.degree} - ${e.school} (${e.dates}) ${e.note}`).join("\n")}

Skills: ${form.skills.list}
Certifications: ${form.skills.certifications}
Languages: ${form.skills.languages}

Return this exact JSON structure:
{
  "summary": "2-3 sentence professional summary, tailored to the target role and tone",
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "dates": "date range",
      "bullets": ["bullet 1 with strong action verb and metric", "bullet 2", "bullet 3"]
    }
  ],
  "education": [
    { "degree": "degree name", "school": "school name", "dates": "years", "note": "minor or honors if any" }
  ],
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8", "skill9", "skill10"],
  "certifications": ["cert1", "cert2"],
  "languages": ["language1", "language2"]
}

Rules:
- Start every bullet with a strong past-tense action verb (Led, Built, Drove, Reduced, Increased, etc.)
- Add plausible quantified metrics to each bullet if not provided (e.g. "reduced onboarding time by 30%")
- Match tone: ${form.summary.tone === "executive" ? "senior, strategic, board-level language" : form.summary.tone === "creative" ? "dynamic, energetic, personality-forward" : "clear, direct, professional"}
- Skills list: extract from the skills input and supplement intelligently based on the role
- If certifications or languages are empty, return empty arrays
- Return ONLY the JSON object, no other text`;

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

      setResult({ basics: form.basics, generated: parsed });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Something went wrong generating your resume. Please try again.");
      console.error(err);
    }
  };

  const reset = () => { setStatus("idle"); setResult(null); setStep(0); };

  // ── Step panels ──
  const stepPanels = [
    // 0 — Basics
    <div key="basics">
      <Row><Field label="Full name" required><Input value={form.basics.name} onChange={v => setBasics("name", v)} placeholder="Alexandra Chen" /></Field>
      <Field label="Job title"><Input value={form.basics.title} onChange={v => setBasics("title", v)} placeholder="Senior Product Manager" /></Field></Row>
      <Row><Field label="Email" required><Input value={form.basics.email} onChange={v => setBasics("email", v)} placeholder="alex@email.com" /></Field>
      <Field label="Phone"><Input value={form.basics.phone} onChange={v => setBasics("phone", v)} placeholder="(415) 555-0100" /></Field></Row>
      <Row><Field label="Location"><Input value={form.basics.location} onChange={v => setBasics("location", v)} placeholder="San Francisco, CA" /></Field>
      <Field label="LinkedIn URL"><Input value={form.basics.linkedin} onChange={v => setBasics("linkedin", v)} placeholder="linkedin.com/in/yourname" /></Field></Row>
      <Row cols={1}><Field label="Portfolio / Website"><Input value={form.basics.portfolio} onChange={v => setBasics("portfolio", v)} placeholder="yoursite.com (optional)" /></Field></Row>
    </div>,

    // 1 — Focus
    <div key="summary">
      <Row><Field label="Target role"><Input value={form.summary.role} onChange={v => setSummary("role", v)} placeholder="Head of Product, PM at Stripe, etc." /></Field>
      <Field label="Years of experience"><Input value={form.summary.yearsExp} onChange={v => setSummary("yearsExp", v)} placeholder="8" /></Field></Row>
      <Row cols={1}><Field label="Top 3 strengths (free text)"><Textarea value={form.summary.topStrengths} onChange={v => setSummary("topStrengths", v)} placeholder="e.g. 0-to-1 product launches, cross-functional leadership, data-driven roadmap decisions" rows={2} /></Field></Row>
      <Row><Field label="Target company / industry"><Input value={form.summary.targetCompany} onChange={v => setSummary("targetCompany", v)} placeholder="Fintech startup, Google, consulting, etc." /></Field>
      <Field label="Tone">
        <select value={form.summary.tone} onChange={e => setSummary("tone", e.target.value)} style={{ width: "100%", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 12px", fontSize: 13, color: T.text, background: T.surface, fontFamily: FONT_BODY }}>
          <option value="professional">Professional (default)</option>
          <option value="executive">Executive / senior leadership</option>
          <option value="creative">Creative / personality-forward</option>
          <option value="technical">Technical / engineering</option>
        </select>
      </Field></Row>
    </div>,

    // 2 — Experience
    <div key="experience">
      {form.experience.map((exp, i) => (
        <div key={i} style={{ background: T.bg, borderRadius: 8, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>Position {i + 1}</div>
            {i > 0 && <button onClick={() => removeExp(i)} style={{ fontSize: 11, color: T.error, background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
          </div>
          <Row><Field label="Job title"><Input value={exp.title} onChange={v => setExp(i, "title", v)} placeholder="Senior Product Manager" /></Field>
          <Field label="Company"><Input value={exp.company} onChange={v => setExp(i, "company", v)} placeholder="Stripe" /></Field></Row>
          <Row cols={1}><Field label="Dates"><Input value={exp.dates} onChange={v => setExp(i, "dates", v)} placeholder="Jan 2021 – Present" /></Field></Row>
          <Row cols={1}><Field label="Key accomplishments (raw notes — AI will polish these)"><Textarea value={exp.bullets} onChange={v => setExp(i, "bullets", v)} placeholder="Led launch of new product in 35 countries, hit $18M ARR. Reduced onboarding dropoff. Managed 4 squads." rows={3} /></Field></Row>
        </div>
      ))}
      <button onClick={addExp} style={{ background: "none", border: `1px dashed ${T.border}`, borderRadius: 6, padding: "8px 16px", fontSize: 12, color: T.muted, cursor: "pointer", width: "100%" }}>+ Add another position</button>
    </div>,

    // 3 — Education
    <div key="education">
      {form.education.map((edu, i) => (
        <div key={i} style={{ background: T.bg, borderRadius: 8, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
          <Row><Field label="Degree"><Input value={edu.degree} onChange={v => setEdu(i, "degree", v)} placeholder="B.S. Computer Science" /></Field>
          <Field label="School"><Input value={edu.school} onChange={v => setEdu(i, "school", v)} placeholder="UC Berkeley" /></Field></Row>
          <Row><Field label="Dates"><Input value={edu.dates} onChange={v => setEdu(i, "dates", v)} placeholder="2012 – 2016" /></Field>
          <Field label="Minor / honors (optional)"><Input value={edu.note} onChange={v => setEdu(i, "note", v)} placeholder="Minor in Business Administration" /></Field></Row>
        </div>
      ))}
      <button onClick={addEdu} style={{ background: "none", border: `1px dashed ${T.border}`, borderRadius: 6, padding: "8px 16px", fontSize: 12, color: T.muted, cursor: "pointer", width: "100%" }}>+ Add another degree</button>
    </div>,

    // 4 — Skills
    <div key="skills">
      <Row cols={1}><Field label="Skills (comma-separated)"><Textarea value={form.skills.list} onChange={v => setSkills("list", v)} placeholder="Product Strategy, Roadmap Planning, SQL, Figma, A/B Testing, Agile, Stakeholder Management" rows={2} /></Field></Row>
      <Row><Field label="Certifications (one per line)"><Textarea value={form.skills.certifications} onChange={v => setSkills("certifications", v)} placeholder="AWS Cloud Practitioner (2023)&#10;Google Analytics Certified" rows={3} /></Field>
      <Field label="Languages"><Textarea value={form.skills.languages} onChange={v => setSkills("languages", v)} placeholder="English (Native)&#10;Mandarin (Fluent)" rows={3} /></Field></Row>
    </div>,
  ];

  // ── Render ──
  if (status === "done" && result) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, padding: "24px 16px", fontFamily: FONT_BODY }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.accent }}>Your resume is ready</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Use Ctrl+P / ⌘+P to save as PDF</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={reset} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 14px", fontSize: 12, color: T.muted, cursor: "pointer" }}>Start over</button>
              <button onClick={() => window.print()} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 6, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Print / Save PDF</button>
            </div>
          </div>
          <ResumePreview data={result} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: FONT_BODY }}>
      {/* Header */}
      <div style={{ background: T.accent, padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: FONT_RESUME_NAME, fontSize: 20, color: "#fff", letterSpacing: "0.01em" }}>AI Resume Builder</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Powered by Claude · Personalized in seconds</div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
          Step {step + 1} of {STEPS.length}
        </div>
      </div>

      {/* Step nav */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 28px", display: "flex", overflowX: "auto" }}>
        {STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setStep(i)} style={{
            background: "none", border: "none",
            borderBottom: step === i ? `2px solid ${T.accent}` : "2px solid transparent",
            color: step === i ? T.accent : i < step ? T.success : T.muted,
            fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
            padding: "13px 16px", cursor: "pointer", whiteSpace: "nowrap",
            letterSpacing: "0.02em",
          }}>
            {i < step ? "✓ " : `${s.icon} `}{s.label}
          </button>
        ))}
      </div>

      {/* Form body */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, padding: "24px 24px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{STEPS[step].label}</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>
            {["Your contact information.", "Tell Claude what you're targeting.", "Where have you worked?", "Your academic background.", "Skills, certifications, and languages."][step]}
          </div>
          {stepPanels[step]}
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{ marginTop: 12, background: "#fdf2f2", border: `1px solid #f5c6c6`, borderRadius: 6, padding: "10px 14px", fontSize: 12, color: T.error }}>{errorMsg}</div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 20px", fontSize: 13, color: step === 0 ? T.border : T.muted, cursor: step === 0 ? "default" : "pointer" }}
          >
            ← Back
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 6, padding: "9px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Next →
            </button>
          ) : (
            <button
              onClick={generate}
              disabled={status === "loading"}
              style={{ background: status === "loading" ? T.muted : T.gold, color: "#fff", border: "none", borderRadius: 6, padding: "9px 28px", fontSize: 13, fontWeight: 700, cursor: status === "loading" ? "default" : "pointer", minWidth: 180 }}
            >
              {status === "loading" ? "Building your resume…" : "✦ Generate my resume"}
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? T.accent : i < step ? T.success : T.border, transition: "all 0.2s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
