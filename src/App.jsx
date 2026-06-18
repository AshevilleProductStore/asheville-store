import { useState, useEffect } from "react";
import AIResumeBuilder from "./ai-resume-builder";
import SocialPackGenerator from "./ai-social-pack-generator";
import DigitalPlannerGenerator from "./ai-planner-generator";
import BrandingKitGenerator from "./ai-branding-kit-generator";

const ROUTES = {
  "/resume": AIResumeBuilder,
  "/social": SocialPackGenerator,
  "/planner": DigitalPlannerGenerator,
  "/branding": BrandingKitGenerator,
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const Tool = ROUTES[path];
  if (Tool) return <Tool />;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ fontSize: 11, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Asheville Product Store</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#f0ede6", marginBottom: 4 }}>AI Tool Suite</div>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 40 }}>Select a tool</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%", maxWidth: 500 }}>
        {Object.entries(ROUTES).map(([route]) => (
          <button key={route} onClick={() => { window.history.pushState({}, "", route); setPath(route); }}
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "20px 16px", color: "#f0ede6", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
            {route === "/resume" && "AI Resume Builder"}
            {route === "/social" && "AI Social Pack Generator"}
            {route === "/planner" && "AI Planner Generator"}
            {route === "/branding" && "AI Branding Kit Generator"}
          </button>
        ))}
      </div>
    </div>
  );
}