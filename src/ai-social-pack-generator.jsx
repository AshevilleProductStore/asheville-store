import { useState } from "react";

// ── Tokens ─────────────────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  surface: "#111111",
  card: "#1a1a1a",
  border: "#2a2a2a",
  accent: "#c8f542",
  accentDim: "#8fb82e",
  text: "#f0ede6",
  muted: "#666",
  warm: "#e8b86d",
  error: "#f87171",
  success: "#4ade80",
};
const FB = "'DM Sans', system-ui, sans-serif";
const FD = "'Bebas Neue', Impact, sans-serif";

// ── Steps ──────────────────────────────────────────────────────
const STEPS = [
  { id: "brand",    label: "Brand",    icon: "◎" },
  { id: "audience", label: "Audience", icon: "◈" },
  { id: "content",  label: "Content",  icon: "▦" },
  { id: "style",    label: "Style",    icon: "▤" },
];

const INIT = {
  brand: { name: "", tagline: "", industry: "", website: "", handle: "" },
  audience: { who: "", painPoint: "", transformation: "", tone: "inspirational" },
  content: { topics: "", cta: "", offer: "", postCount: "10" },
  style: { vibe: "bold-dark", primaryColor: "#c8f542", accentColor: "#ffffff", fontStyle: "display" },
};

// ── Helpers ────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>
    {children}{required && <span style={{ color: T.warm, marginLeft: 3 }}>*</span>}
  </div>
);

const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 12px", fontSize: 13, color: T.text, background: T.card, fontFamily: FB, outline: "none" }}
    onFocus={e => e.target.style.borderColor = T.accent}
    onBlur={e => e.target.style.borderColor = T.border}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 12px", fontSize: 13, color: T.text, background: T.card, fontFamily: FB, resize: "vertical", outline: "none", lineHeight: 1.6 }}
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

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 12px", fontSize: 13, color: T.text, background: T.card, fontFamily: FB }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ── Post card renderer ─────────────────────────────────────────
function PostCard({ post, brandName, primaryColor, accentColor, fontStyle, index }) {
  const [copied, setCopied] = useState(false);
  const isDisplay = fontStyle === "display";
  const isTall = post.type === "story" || post.type === "tiktok";

  const copy = () => {
    navigator.clipboard?.writeText(`${post.headline}\n\n${post.caption}\n\n${post.hashtags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
      {/* Visual preview */}
      <div style={{
        background: post.bg || "#0d0d0d",
        aspectRatio: isTall ? "9/16" : "1/1",
        maxHeight: isTall ? 280 : 200,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: 16, position: "relative", overflow: "hidden",
      }}>
        <div style={{ width: 20, height: 3, background: primaryColor, borderRadius: 2 }} />
        <div style={{
          fontFamily: isDisplay ? FD : "'Cormorant Garamond', Georgia, serif",
          fontSize: isDisplay ? (isTall ? 28 : 22) : (isTall ? 24 : 18),
          color: primaryColor, lineHeight: 1.05,
          fontWeight: isDisplay ? 700 : 400,
          whiteSpace: "pre-line",
        }}>
          {post.headline}
        </div>
        <div>
          <div style={{ fontSize: 8, color: primaryColor, opacity: 0.6, marginBottom: 2 }}>{post.subtext}</div>
          <div style={{ fontSize: 7, color: primaryColor, opacity: 0.35, letterSpacing: "0.1em", textTransform: "uppercase" }}>@{brandName?.toLowerCase().replace(/\s/g, "") || "yourbrand"}</div>
        </div>
        <div style={{ position: "absolute", top: 10, right: 10, fontSize: 8, color: primaryColor, opacity: 0.3, fontFamily: FB, letterSpacing: "0.06em", textTransform: "uppercase" }}>{post.type}</div>
      </div>

      {/* Caption + hashtags */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Caption</div>
        <div style={{ fontSize: 11, color: T.text, lineHeight: 1.65, marginBottom: 10 }}>{post.caption}</div>
        <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.6, marginBottom: 10 }}>{post.hashtags}</div>
        <button onClick={copy} style={{
          background: copied ? T.success : "none", border: `1px solid ${copied ? T.success : T.border}`,
          borderRadius: 4, padding: "4px 10px", fontSize: 10, color: copied ? "#000" : T.muted,
          cursor: "pointer", fontFamily: FB, fontWeight: 600, transition: "all 0.2s",
        }}>
          {copied ? "✓ Copied" : "Copy caption + hashtags"}
        </button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function SocialPackGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INIT);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (section, k, v) => setForm(f => ({ ...f, [section]: { ...f[section], [k]: v } }));

  const vibeOptions = [
    { value: "bold-dark", label: "Bold & Dark (high contrast, acid colors)" },
    { value: "clean-light", label: "Clean & Light (minimal, airy)" },
    { value: "warm-editorial", label: "Warm Editorial (cream, serif, gold)" },
    { value: "neon-pop", label: "Neon Pop (vibrant, Gen Z energy)" },
  ];

  const vibeBackgrounds = {
    "bold-dark": ["#0d0d0d", "#111122", "#1a1a1a", "#0a0a14"],
    "clean-light": ["#f5f5f0", "#ffffff", "#f0ede6", "#fafaf8"],
    "warm-editorial": ["#1a1208", "#2a1f0e", "#fdf6ec", "#1e1508"],
    "neon-pop": ["#050510", "#0a0520", "#10051a", "#050a1a"],
  };

  const generate = async () => {
    if (!form.brand.name) { setErrorMsg("Please enter your brand name before generating."); return; }
    setStatus("loading"); setErrorMsg("");

    const bgPool = vibeBackgrounds[form.style.vibe] || vibeBackgrounds["bold-dark"];
    const postTypes = ["quote", "quote", "promo", "educational", "educational", "story", "quote", "promo", "tiktok", "educational"];

    const prompt = `You are a world-class social media strategist and copywriter. Generate a complete, personalized social media content pack based on the brand below. Return ONLY valid JSON, no markdown, no explanation.

BRAND INFO:
Name: ${form.brand.name}
Tagline: ${form.brand.tagline}
Industry: ${form.brand.industry}
Handle: @${form.brand.handle || form.brand.name.toLowerCase().replace(/\s/g, "")}
Website: ${form.brand.website}

AUDIENCE:
Who they are: ${form.audience.who}
Their pain point: ${form.audience.painPoint}
Transformation offered: ${form.audience.transformation}
Tone: ${form.audience.tone}

CONTENT DIRECTION:
Key topics: ${form.content.topics}
Primary CTA: ${form.content.cta}
Current offer: ${form.content.offer}
Number of posts: ${form.content.postCount}

STYLE:
Vibe: ${form.style.vibe}
Primary color name: custom
Font style: ${form.style.fontStyle}

Generate exactly ${form.content.postCount} posts. Each post must be highly specific to THIS brand — no generic filler.

Return this exact JSON:
{
  "brandSummary": "2-sentence brand voice summary",
  "contentPillars": ["pillar1", "pillar2", "pillar3"],
  "posts": [
    {
      "type": "quote|promo|educational|story|tiktok",
      "headline": "SHORT PUNCHY HEADLINE (2-6 words, all caps if display font, title case if serif)",
      "subtext": "short supporting line under headline (8-12 words)",
      "caption": "Full Instagram/TikTok caption, 3-5 sentences. Conversational, ends with the CTA. Specific to this brand.",
      "hashtags": "#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5 #hashtag6 #hashtag7 #hashtag8 #hashtag9 #hashtag10",
      "bg": "${bgPool[0]}"
    }
  ],
  "weeklySchedule": {
    "monday": "post type suggestion",
    "tuesday": "post type suggestion", 
    "wednesday": "post type suggestion",
    "thursday": "post type suggestion",
    "friday": "post type suggestion",
    "saturday": "post type suggestion",
    "sunday": "post type suggestion"
  },
  "bioSuggestion": "Optimized Instagram bio (150 chars max)",
  "highlightCovers": ["cover1 label", "cover2 label", "cover3 label", "cover4 label", "cover5 label"]
}

Rules:
- Headlines must be brand-specific, not generic motivational filler
- Captions must sound human, not AI-generated — conversational, specific, direct
- Vary the post types across the set
- Hashtags: mix of niche (low competition) and broad (high volume)
- bg values must alternate between: ${bgPool.join(", ")}
- Return ONLY the JSON object`;

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
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: FB, padding: "24px 16px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: FD, fontSize: 26, color: T.accent, letterSpacing: "0.04em" }}>
                {form.brand.name} · Social Pack
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{result.brandSummary}</div>
            </div>
            <button onClick={() => { setStatus("idle"); setResult(null); setStep(0); }}
              style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 14px", fontSize: 12, color: T.muted, cursor: "pointer" }}>
              Start over
            </button>
          </div>

          {/* Content pillars + bio */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Content Pillars</div>
              {result.contentPillars?.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: T.text }}>{p}</div>
                </div>
              ))}
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Instagram Bio</div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6, marginBottom: 10 }}>{result.bioSuggestion}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 12, marginBottom: 6 }}>Highlight Covers</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {result.highlightCovers?.map(h => (
                  <span key={h} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: T.muted }}>{h}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly schedule */}
          {result.weeklySchedule && (
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Posting Schedule</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                {Object.entries(result.weeklySchedule).map(([day, type]) => (
                  <div key={day} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{day.slice(0, 3)}</div>
                    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 4px", fontSize: 9, color: T.text, lineHeight: 1.4 }}>{type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts grid */}
          <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            {result.posts?.length} Posts — Click any card to copy caption + hashtags
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {result.posts?.map((post, i) => (
              <PostCard
                key={i} post={post} index={i}
                brandName={form.brand.name}
                primaryColor={form.style.primaryColor}
                accentColor={form.style.accentColor}
                fontStyle={form.style.fontStyle}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Form view ──────────────────────────────────────────────
  const stepPanels = [
    // Brand
    <div key="brand">
      <Row><Field label="Brand name" required><Input value={form.brand.name} onChange={v => set("brand","name",v)} placeholder="Bloom Wellness Co." /></Field>
      <Field label="Your handle"><Input value={form.brand.handle} onChange={v => set("brand","handle",v)} placeholder="bloomwellness" /></Field></Row>
      <Row cols={1}><Field label="Tagline / mission (one line)"><Input value={form.brand.tagline} onChange={v => set("brand","tagline",v)} placeholder="Helping women 40+ reclaim their energy through movement and nutrition" /></Field></Row>
      <Row><Field label="Industry / niche"><Input value={form.brand.industry} onChange={v => set("brand","industry",v)} placeholder="Health & wellness coaching" /></Field>
      <Field label="Website"><Input value={form.brand.website} onChange={v => set("brand","website",v)} placeholder="bloomwellness.com" /></Field></Row>
    </div>,

    // Audience
    <div key="audience">
      <Row cols={1}><Field label="Who is your audience?" required><Textarea value={form.audience.who} onChange={v => set("audience","who",v)} placeholder="Women 35–55, busy professionals and moms, dealing with low energy and weight gain after 40" rows={2} /></Field></Row>
      <Row cols={1}><Field label="Their #1 pain point"><Textarea value={form.audience.painPoint} onChange={v => set("audience","painPoint",v)} placeholder="They've tried every diet but nothing sticks. They're exhausted and don't recognize their body." rows={2} /></Field></Row>
      <Row cols={1}><Field label="Transformation you offer"><Input value={form.audience.transformation} onChange={v => set("audience","transformation",v)} placeholder="Sustainable energy, confidence, and a body that feels like theirs again" /></Field></Row>
      <Row cols={1}><Field label="Brand tone">
        <Select value={form.audience.tone} onChange={v => set("audience","tone",v)} options={[
          { value: "inspirational", label: "Inspirational & motivating" },
          { value: "educational", label: "Educational & authoritative" },
          { value: "conversational", label: "Conversational & relatable" },
          { value: "bold", label: "Bold & direct — no fluff" },
          { value: "premium", label: "Premium & aspirational" },
        ]} />
      </Field></Row>
    </div>,

    // Content
    <div key="content">
      <Row cols={1}><Field label="Key content topics (comma-separated)"><Textarea value={form.content.topics} onChange={v => set("content","topics",v)} placeholder="hormone health, meal prep, morning routines, mindset, strength training for women over 40" rows={2} /></Field></Row>
      <Row><Field label="Primary call to action"><Input value={form.content.cta} onChange={v => set("content","cta",v)} placeholder="Book a free consult / Link in bio" /></Field>
      <Field label="Current offer or product"><Input value={form.content.offer} onChange={v => set("content","offer",v)} placeholder="12-week coaching program, $997" /></Field></Row>
      <Row cols={1}><Field label="Number of posts to generate">
        <Select value={form.content.postCount} onChange={v => set("content","postCount",v)} options={[
          { value: "5", label: "5 posts (quick start)" },
          { value: "10", label: "10 posts (recommended)" },
        ]} />
      </Field></Row>
    </div>,

    // Style
    <div key="style">
      <Row cols={1}><Field label="Visual vibe">
        <Select value={form.style.vibe} onChange={v => set("style","vibe",v)} options={vibeOptions} />
      </Field></Row>
      <Row><Field label="Primary color (hex)"><Input value={form.style.primaryColor} onChange={v => set("style","primaryColor",v)} placeholder="#c8f542" /></Field>
      <Field label="Accent color (hex)"><Input value={form.style.accentColor} onChange={v => set("style","accentColor",v)} placeholder="#ffffff" /></Field></Row>
      <Row cols={1}><Field label="Headline font style">
        <Select value={form.style.fontStyle} onChange={v => set("style","fontStyle",v)} options={[
          { value: "display", label: "Display / Impact — bold, uppercase, high energy" },
          { value: "serif", label: "Serif / Editorial — elegant, premium, authoritative" },
        ]} />
      </Field></Row>
      {/* Color preview */}
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        {[form.style.primaryColor, form.style.accentColor].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, background: c, border: `1px solid ${T.border}` }} />
            <div style={{ fontSize: 11, color: T.muted }}>{c}</div>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: FB }}>
      {/* Header */}
      <div style={{ background: "#111", borderBottom: `1px solid ${T.border}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: FD, fontSize: 20, color: T.accent, letterSpacing: "0.06em" }}>AI Social Media Pack Generator</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Powered by Claude · Personalized captions, hashtags & schedule</div>
        </div>
        <div style={{ fontSize: 11, color: T.muted }}>Step {step + 1} / {STEPS.length}</div>
      </div>

      {/* Step tabs */}
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

      {/* Form */}
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, padding: "24px 24px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{STEPS[step].label}</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>
            {["Your brand's core identity.", "Who you're talking to.", "What you want to post about.", "How your posts should look and feel."][step]}
          </div>
          {stepPanels[step]}
        </div>

        {errorMsg && (
          <div style={{ marginTop: 12, background: "#1a0505", border: `1px solid #5a1a1a`, borderRadius: 6, padding: "10px 14px", fontSize: 12, color: T.error }}>{errorMsg}</div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 20px", fontSize: 13, color: step === 0 ? T.border : T.muted, cursor: step === 0 ? "default" : "pointer" }}>
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              style={{ background: T.accent, color: "#000", border: "none", borderRadius: 6, padding: "9px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Next →
            </button>
          ) : (
            <button onClick={generate} disabled={status === "loading"}
              style={{ background: status === "loading" ? T.muted : T.accent, color: "#000", border: "none", borderRadius: 6, padding: "9px 28px", fontSize: 13, fontWeight: 700, cursor: status === "loading" ? "default" : "pointer", minWidth: 200 }}>
              {status === "loading" ? "Generating your pack…" : "✦ Generate social pack"}
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
