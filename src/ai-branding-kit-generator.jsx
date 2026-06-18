import { useState } from "react";

// ── Tokens ─────────────────────────────────────────────────────
const T = {
  bg: "#0c0c0e",
  surface: "#141418",
  card: "#1c1c22",
  border: "#2c2c36",
  accent: "#7c6af7",
  accentLight: "#a99df9",
  gold: "#e8b86d",
  text: "#f0ede6",
  muted: "#666",
  success: "#4ade80",
  error: "#f87171",
};
const FB = "'DM Sans', system-ui, sans-serif";
const FS = "'Cormorant Garamond', Georgia, serif";
const FD = "'Bebas Neue', Impact, sans-serif";

const STEPS = [
  { id: "business", label: "Business",   icon: "◎" },
  { id: "audience", label: "Audience",   icon: "◈" },
  { id: "identity", label: "Identity",   icon: "▦" },
  { id: "style",    label: "Style",      icon: "▤" },
];

const INIT = {
  business: { name: "", tagline: "", industry: "", offering: "", founded: "" },
  audience: { who: "", ageRange: "", income: "middle", values: "" },
  identity: { personality: [], differentiator: "", avoid: "", competitors: "" },
  style: { direction: "modern-minimal", colorMood: "professional", logoStyle: "wordmark" },
};

const PERSONALITY_TRAITS = [
  "Bold","Trustworthy","Playful","Sophisticated","Warm","Innovative",
  "Earthy","Premium","Minimal","Energetic","Expert","Approachable",
];

const DIRECTIONS = [
  { value: "modern-minimal", label: "Modern Minimal", desc: "Clean, spacious, confident" },
  { value: "bold-editorial", label: "Bold Editorial", desc: "Strong type, high contrast" },
  { value: "warm-artisan", label: "Warm Artisan", desc: "Handcrafted, organic, textured" },
  { value: "premium-luxury", label: "Premium Luxury", desc: "Elegant, refined, exclusive" },
  { value: "tech-forward", label: "Tech Forward", desc: "Crisp, systematic, precise" },
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

// ── Brand Board Renderer ───────────────────────────────────────
function BrandBoard({ result, businessName }) {
  const palette = result.palette || [];
  const primaryColor = palette[0]?.hex || "#333";
  const secondaryColor = palette[1]?.hex || "#666";
  const accentColor = palette[2]?.hex || "#999";
  const bgColor = palette[4]?.hex || "#f5f5f0";
  const darkColor = palette[3]?.hex || "#1a1a1a";
  const isLightBg = bgColor.startsWith("#f") || bgColor.startsWith("#e");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Logo mockup */}
      <div style={{ background: bgColor, borderRadius: 10, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, border: `1px solid ${isLightBg ? "#e0e0e0" : "rgba(255,255,255,0.08)"}` }}>
        {result.logoStyle === "monogram" ? (
          <div style={{ fontFamily: FS, fontSize: 56, color: primaryColor, lineHeight: 1, fontWeight: 400, letterSpacing: "-0.02em" }}>
            {businessName.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
        ) : result.logoStyle === "icon-wordmark" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: result.logoShape === "circle" ? "50%" : 6, background: primaryColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 16, height: 16, borderRadius: 2, background: bgColor, opacity: 0.9 }} />
            </div>
            <div style={{ fontFamily: result.displayFont === "serif" ? FS : FD, fontSize: 22, color: isLightBg ? darkColor : primaryColor, letterSpacing: "0.04em", fontWeight: result.displayFont === "serif" ? 400 : 700 }}>
              {businessName}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: result.displayFont === "serif" ? FS : FD, fontSize: result.displayFont === "serif" ? 32 : 36, color: isLightBg ? darkColor : primaryColor, letterSpacing: result.displayFont === "display" ? "0.08em" : "0", fontWeight: result.displayFont === "serif" ? 400 : 700, lineHeight: 1 }}>
              {businessName}
            </div>
            {result.taglineFormatted && (
              <div style={{ fontFamily: FB, fontSize: 10, color: isLightBg ? "#666" : "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 6 }}>
                {result.taglineFormatted}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Color palette */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Color Palette</div>
        <div style={{ display: "flex", gap: 6 }}>
          {palette.map((color, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ height: 52, borderRadius: 6, background: color.hex, border: "1px solid rgba(255,255,255,0.06)" }} />
              <div style={{ fontSize: 9, fontWeight: 700, color: T.text, marginTop: 4, textAlign: "center" }}>{color.name}</div>
              <div style={{ fontSize: 8, color: T.muted, textAlign: "center", fontFamily: "'DM Mono', monospace" }}>{color.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Typography</div>
        {result.typography?.map((font, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{font.role}</div>
            <div style={{ fontFamily: i === 0 ? FS : FB, fontSize: i === 0 ? 22 : 14, color: T.text, fontWeight: i === 0 ? 400 : 600 }}>{font.name}</div>
            <div style={{ fontSize: 9, color: T.muted }}>{font.usage}</div>
          </div>
        ))}
      </div>

      {/* Social template preview */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Social Template Preview</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {/* Feed post */}
          <div style={{ background: primaryColor, borderRadius: 8, aspectRatio: "1/1", padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ width: 16, height: 2, background: bgColor, opacity: 0.6, borderRadius: 1 }} />
            <div style={{ fontFamily: result.displayFont === "serif" ? FS : FD, fontSize: result.displayFont === "serif" ? 16 : 18, color: bgColor, lineHeight: 1.1 }}>
              {result.samplePost?.headline || "Your message here."}
            </div>
            <div style={{ fontSize: 7, color: bgColor, opacity: 0.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>@{businessName.toLowerCase().replace(/\s/g, "")}</div>
          </div>
          {/* Story */}
          <div style={{ background: darkColor, borderRadius: 8, aspectRatio: "9/16", maxHeight: 160, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ width: 14, height: 2, background: accentColor, borderRadius: 1 }} />
            <div style={{ fontFamily: result.displayFont === "serif" ? FS : FD, fontSize: 14, color: accentColor, lineHeight: 1.1 }}>
              {result.sampleStory?.headline || "Story slide."}
            </div>
            <div style={{ fontSize: 6, color: accentColor, opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase" }}>TAP →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function BrandingKitGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INIT);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("board");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (section, k, v) => setForm(f => ({ ...f, [section]: { ...f[section], [k]: v } }));
  const toggleTrait = trait => setForm(f => {
    const cur = f.identity.personality;
    const next = cur.includes(trait) ? cur.filter(t => t !== trait) : cur.length < 5 ? [...cur, trait] : cur;
    return { ...f, identity: { ...f.identity, personality: next } };
  });

  const generate = async () => {
    if (!form.business.name) { setErrorMsg("Please enter your business name."); return; }
    setStatus("loading"); setErrorMsg("");

    const directionLabel = DIRECTIONS.find(d => d.value === form.style.direction)?.label || form.style.direction;

    const prompt = `You are a world-class brand strategist and visual identity designer. Generate a complete, professional brand kit for this business. Return ONLY valid JSON, no markdown, no explanation.

BUSINESS: ${form.business.name}
TAGLINE: ${form.business.tagline}
INDUSTRY: ${form.business.industry}
OFFERING: ${form.business.offering}
FOUNDED: ${form.business.founded}

AUDIENCE:
Who: ${form.audience.who}
Age range: ${form.audience.ageRange}
Income: ${form.audience.income}
Values: ${form.audience.values}

BRAND IDENTITY:
Personality traits: ${form.identity.personality.join(", ")}
Differentiator: ${form.identity.differentiator}
Avoid: ${form.identity.avoid}
Competitors: ${form.identity.competitors}

STYLE DIRECTION: ${directionLabel}
COLOR MOOD: ${form.style.colorMood}
LOGO STYLE: ${form.style.logoStyle}

Return this exact JSON:
{
  "brandName": "${form.business.name}",
  "taglineFormatted": "refined version of their tagline (or generate one if blank)",
  "brandEssence": "one sentence capturing the soul of this brand",
  "logoStyle": "${form.style.logoStyle}",
  "logoShape": "circle|square|hexagon|none",
  "displayFont": "serif|display|sans",
  "palette": [
    { "name": "Primary", "hex": "#xxxxxx", "usage": "Logo, headlines, CTAs" },
    { "name": "Secondary", "hex": "#xxxxxx", "usage": "Supporting elements" },
    { "name": "Accent", "hex": "#xxxxxx", "usage": "Highlights, links" },
    { "name": "Dark", "hex": "#xxxxxx", "usage": "Body text, dark backgrounds" },
    { "name": "Light", "hex": "#xxxxxx", "usage": "Backgrounds, white space" }
  ],
  "typography": [
    { "role": "Display / Headlines", "name": "Font name", "usage": "Hero text, titles, pull quotes" },
    { "role": "Body / UI", "name": "Font name", "usage": "Paragraphs, captions, buttons" }
  ],
  "voiceGuidelines": {
    "tone": "2-sentence description of brand voice",
    "doSay": ["example phrase 1", "example phrase 2", "example phrase 3"],
    "dontSay": ["avoid phrase 1", "avoid phrase 2", "avoid phrase 3"]
  },
  "brandValues": ["value1", "value2", "value3"],
  "taglines": ["primary tagline", "alt tagline 1", "alt tagline 2"],
  "samplePost": { "headline": "sample Instagram feed post headline (5-8 words)", "caption": "sample caption 2-3 sentences" },
  "sampleStory": { "headline": "sample story headline (3-5 words)" },
  "logoDescription": "Detailed description of the logo concept — what it looks like, what it communicates, how to build it in Canva",
  "canvaInstructions": "Step-by-step Canva instructions for building the brand board (3-4 steps)",
  "moodWords": ["word1", "word2", "word3", "word4", "word5"]
}

Color rules for ${form.style.colorMood} mood:
- professional: deep navy/slate primary, white/cream light, gold or teal accent
- warm: terracotta/rust or amber primary, cream light, forest green or rust accent  
- bold: near-black primary, electric accent (lime, coral, or electric blue), white light
- natural: forest green or sage primary, warm off-white light, earth tone accent
- luxury: deep charcoal or midnight primary, champagne gold accent, near-white light

Make colors specific and distinctive — not the generic defaults. The palette should feel designed for THIS brand specifically.
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

  // ── Result ──────────────────────────────────────────────────
  if (status === "done" && result) {
    const tabs = ["board", "voice", "taglines", "canva"];

    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: FB }}>
        {/* Header */}
        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{form.business.name} — Brand Kit</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{result.brandEssence}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setStatus("idle"); setResult(null); setStep(0); }}
              style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 14px", fontSize: 11, color: T.muted, cursor: "pointer" }}>
              Start over
            </button>
            <button onClick={() => window.print()}
              style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 28px", display: "flex", background: T.surface }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: "none", border: "none",
              borderBottom: activeTab === tab ? `2px solid ${T.accent}` : "2px solid transparent",
              color: activeTab === tab ? T.accent : T.muted,
              fontFamily: FB, fontSize: 12, fontWeight: 600,
              padding: "12px 18px", cursor: "pointer", textTransform: "capitalize",
            }}>
              {tab === "board" ? "Brand Board" : tab === "voice" ? "Voice & Values" : tab === "taglines" ? "Taglines" : "Canva Build Guide"}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>

          {/* Brand Board */}
          {activeTab === "board" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <BrandBoard result={result} businessName={form.business.name} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Mood words */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Brand Mood</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {result.moodWords?.map((w, i) => (
                      <span key={i} style={{ fontFamily: FS, fontSize: 16, color: T.gold, marginRight: 8 }}>{w}</span>
                    ))}
                  </div>
                </div>

                {/* Brand values */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Brand Values</div>
                  {result.brandValues?.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                      <div style={{ fontSize: 12, color: T.text }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Logo description */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Logo Concept</div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7 }}>{result.logoDescription}</div>
                </div>

                {/* Sample post */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Sample Post</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6 }}>{result.samplePost?.headline}</div>
                  <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.65 }}>{result.samplePost?.caption}</div>
                </div>
              </div>
            </div>
          )}

          {/* Voice & Values */}
          {activeTab === "voice" && (
            <div style={{ maxWidth: 620 }}>
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Brand Voice</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, marginBottom: 16 }}>{result.voiceGuidelines?.tone}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.success, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Do say</div>
                    {result.voiceGuidelines?.doSay?.map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: T.text, marginBottom: 6, display: "flex", gap: 6 }}>
                        <span style={{ color: T.success }}>✓</span>"{s}"
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.error, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Avoid</div>
                    {result.voiceGuidelines?.dontSay?.map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: T.text, marginBottom: 6, display: "flex", gap: 6 }}>
                        <span style={{ color: T.error }}>✗</span>"{s}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Taglines */}
          {activeTab === "taglines" && (
            <div style={{ maxWidth: 560 }}>
              {result.taglines?.map((tag, i) => (
                <div key={i} style={{ background: T.card, border: `1px solid ${i === 0 ? T.accent : T.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    {i === 0 && <div style={{ fontSize: 9, fontWeight: 700, color: T.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Primary Tagline</div>}
                    <div style={{ fontFamily: FS, fontSize: 20, color: T.text }}>{tag}</div>
                  </div>
                  <button onClick={() => navigator.clipboard?.writeText(tag)} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 10px", fontSize: 10, color: T.muted, cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>Copy</button>
                </div>
              ))}
            </div>
          )}

          {/* Canva Build Guide */}
          {activeTab === "canva" && (
            <div style={{ maxWidth: 620 }}>
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Canva Build Instructions</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8 }}>{result.canvaInstructions}</div>
              </div>
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>What's in the Kit — Canva Pages to Build</div>
                {[
                  { name: "Brand Board", desc: "Logo, palette, typography, and mood in one page" },
                  { name: "Logo Variations", desc: "Primary, horizontal, icon-only, and monochrome" },
                  { name: "Color Palette Sheet", desc: "5 colors with hex codes and usage notes" },
                  { name: "Typography Guide", desc: "Font pairings with sample headlines and body text" },
                  { name: "Instagram Feed Template ×5", desc: "1080×1080px branded post templates" },
                  { name: "Instagram Story Template ×3", desc: "1080×1920px story templates" },
                  { name: "Business Card", desc: "3.5×2in, front and back" },
                  { name: "Brand Voice One-Pager", desc: "Do/don't say, tone description, taglines" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, paddingBottom: 10, borderBottom: i < 7 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 4, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.bg, flexShrink: 0 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────
  const stepPanels = [
    // Business
    <div key="business">
      <Row><Field label="Business name" required><Input value={form.business.name} onChange={v => set("business","name",v)} placeholder="Bloom Studio" /></Field>
      <Field label="Industry"><Input value={form.business.industry} onChange={v => set("business","industry",v)} placeholder="Interior design, wellness coaching, SaaS…" /></Field></Row>
      <Row cols={1}><Field label="What do you offer?"><Textarea value={form.business.offering} onChange={v => set("business","offering",v)} placeholder="What you sell, do, or provide — be specific" rows={2} /></Field></Row>
      <Row cols={1}><Field label="Tagline (or leave blank — Claude will write one)"><Input value={form.business.tagline} onChange={v => set("business","tagline",v)} placeholder="Design that makes people feel at home" /></Field></Row>
    </div>,

    // Audience
    <div key="audience">
      <Row cols={1}><Field label="Who is your customer?" required><Textarea value={form.audience.who} onChange={v => set("audience","who",v)} placeholder="Small business owners who want a professional brand but can't afford a $10K agency" rows={2} /></Field></Row>
      <Row><Field label="Age range"><Input value={form.audience.ageRange} onChange={v => set("audience","ageRange",v)} placeholder="28–45" /></Field>
      <Field label="Income level">
        <Select value={form.audience.income} onChange={v => set("audience","income",v)} options={[
          { value: "budget", label: "Budget-conscious" },
          { value: "middle", label: "Middle income" },
          { value: "affluent", label: "Affluent" },
          { value: "luxury", label: "Luxury / high-net-worth" },
        ]} />
      </Field></Row>
      <Row cols={1}><Field label="What do they value most?"><Input value={form.audience.values} onChange={v => set("audience","values",v)} placeholder="Authenticity, quality craftsmanship, saving time, looking credible…" /></Field></Row>
    </div>,

    // Identity
    <div key="identity">
      <div style={{ marginBottom: 14 }}>
        <Label>Brand personality (pick up to 5)</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {PERSONALITY_TRAITS.map(trait => (
            <button key={trait} onClick={() => toggleTrait(trait)} style={{
              background: form.identity.personality.includes(trait) ? T.accent : T.card,
              color: form.identity.personality.includes(trait) ? T.bg : T.muted,
              border: `1px solid ${form.identity.personality.includes(trait) ? T.accent : T.border}`,
              borderRadius: 20, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: FB,
            }}>{trait}</button>
          ))}
        </div>
      </div>
      <Row cols={1}><Field label="What makes you different?"><Textarea value={form.identity.differentiator} onChange={v => set("identity","differentiator",v)} placeholder="We're the only branding service that includes a full copywriting kit — not just visuals" rows={2} /></Field></Row>
      <Row><Field label="What do you want to avoid?"><Input value={form.identity.avoid} onChange={v => set("identity","avoid",v)} placeholder="Corporate, cold, generic, clipart-looking" /></Field>
      <Field label="Competitors / references"><Input value={form.identity.competitors} onChange={v => set("identity","competitors",v)} placeholder="Squarespace, 99designs, Fiverr" /></Field></Row>
    </div>,

    // Style
    <div key="style">
      <div style={{ marginBottom: 14 }}>
        <Label>Visual direction</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DIRECTIONS.map(d => (
            <div key={d.value} onClick={() => set("style","direction",d.value)} style={{
              background: form.style.direction === d.value ? `${T.accent}18` : T.card,
              border: `1px solid ${form.style.direction === d.value ? T.accent : T.border}`,
              borderRadius: 8, padding: "10px 14px", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: form.style.direction === d.value ? T.accent : T.text }}>{d.label}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{d.desc}</div>
              </div>
              {form.style.direction === d.value && <div style={{ color: T.accent, fontSize: 14 }}>✓</div>}
            </div>
          ))}
        </div>
      </div>
      <Row><Field label="Color mood">
        <Select value={form.style.colorMood} onChange={v => set("style","colorMood",v)} options={[
          { value: "professional", label: "Professional — navy, slate, gold" },
          { value: "warm", label: "Warm — rust, amber, cream" },
          { value: "bold", label: "Bold — high contrast, electric accents" },
          { value: "natural", label: "Natural — greens, earth tones" },
          { value: "luxury", label: "Luxury — dark, champagne, refined" },
        ]} />
      </Field>
      <Field label="Logo style">
        <Select value={form.style.logoStyle} onChange={v => set("style","logoStyle",v)} options={[
          { value: "wordmark", label: "Wordmark — business name as logo" },
          { value: "monogram", label: "Monogram — initials only" },
          { value: "icon-wordmark", label: "Icon + Wordmark — symbol and name" },
        ]} />
      </Field></Row>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: FB }}>
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>AI Branding Kit Generator</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Powered by Claude · Full brand identity in minutes</div>
        </div>
        <div style={{ fontSize: 11, color: T.muted }}>Step {step + 1} / {STEPS.length}</div>
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
            {["Tell Claude about your business.", "Who are you building this brand for?", "What does your brand stand for?", "How should it look and feel?"][step]}
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
              style={{ background: T.accent, color: T.bg, border: "none", borderRadius: 6, padding: "9px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Next →
            </button>
          ) : (
            <button onClick={generate} disabled={status === "loading"}
              style={{ background: status === "loading" ? T.muted : T.accent, color: T.bg, border: "none", borderRadius: 6, padding: "9px 28px", fontSize: 13, fontWeight: 700, cursor: status === "loading" ? "default" : "pointer", minWidth: 210 }}>
              {status === "loading" ? "Building your brand kit…" : "✦ Generate brand kit"}
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
