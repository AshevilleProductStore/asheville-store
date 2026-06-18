import { useState } from "react";
import AIResumeBuilder from "./ai-resume-builder";
import SocialPackGenerator from "./ai-social-pack-generator";
import DigitalPlannerGenerator from "./ai-planner-generator";
import BrandingKitGenerator from "./ai-branding-kit-generator";

const TOOLS = [
  { id: "resume",   label: "AI Resume Builder",          component: AIResumeBuilder },
  { id: "social",   label: "AI Social Pack Generator",   component: SocialPackGenerator },
  { id: "planner",  label: "AI Planner Generator",       component: DigitalPlannerGenerator },
  { id: "branding", label: "AI Branding Kit Generator",  component: BrandingKitGenerator },
];

export default function App() {
  const [active, setActive] = useState(null);

  if (active) {
    const Tool = TOOLS.find(t => t.id === active).component;
    return (
      <div>
        <button onClick={() => setActive(null)} style={{ position: "fixed", top: 16, left: 16, zIndex: 1000, background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          ← Back
        </button>
        <Tool />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ marginBottom: 8, fontSize: 11, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase" }}>Asheville Product Store</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#f0ede6", marginBottom: 4 }}>AI Tool Suite</div>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 40 }}>Powered by Claude</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%", maxWidth: 500 }}>
        {TOOLS.map(tool => (
          <button key={tool.id} onClick={() => setActive(tool.id)} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "20px 16px", color: "#f0ede6", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
            {tool.label}
          </button>
        ))}
      </div>
    </div>
  );
}