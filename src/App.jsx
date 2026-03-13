import { useState, useEffect, useRef, Component } from "react";
import PropTypes from "prop-types";

// ─────────────────────────────────────────────────────────────
// PSYCHOLOGICAL COLOR SYSTEM — Light/Gradient Theme
// INDIGO/PURPLE → trust, intelligence, authority  (primary brand, AI)
// VIOLET        → creativity, innovation, vision  (headers, accents)
// WHITE/GLASS   → clarity, open thinking          (cards, input)
// RED           → urgency, error, retry           (error states)
// CYAN/TEAL     → action, download, export        (export buttons)
// ─────────────────────────────────────────────────────────────

// ERROR BOUNDARY
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError:false, error:null }; }
  static getDerivedStateFromError(error) { return { hasError:true, error }; }
  componentDidCatch(e,i) { console.error("ErrorBoundary:", e, i); }
  render() {
    if (this.state.hasError) return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        background:"#f5f3ff", fontFamily:"system-ui,sans-serif" }}>
        <div style={{ textAlign:"center", padding:"40px 24px" }}>
          <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
          <h2 style={{ fontSize:20, fontWeight:700, color:"#7c3aed", marginBottom:8 }}>Something went wrong</h2>
          <p style={{ fontSize:14, color:"#6b7280", marginBottom:20 }}>{this.state.error?.message}</p>
          <button onClick={()=>this.setState({hasError:false,error:null})}
            style={{ padding:"10px 24px", borderRadius:10, border:"none",
              background:"#6d28d9", color:"white", fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Try Again
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}
ErrorBoundary.propTypes = { children: PropTypes.node.isRequired };

// Responsive hook — makes every layout mobile-aware
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function Particles() {
  const pts = Array.from({ length: 18 }, (_, i) => ({
    id: i, size: Math.random() * 7 + 3,
    x: Math.random() * 100, y: Math.random() * 100,
    dur: Math.random() * 14 + 8, delay: Math.random() * 7,
    op: Math.random() * 0.15 + 0.05,
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
      {pts.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background:"radial-gradient(circle,#818cf8,#c4b5fd)", opacity:p.op,
          animation:`floatBob ${p.dur}s ${p.delay}s infinite ease-in-out`,
        }}/>
      ))}
    </div>
  );
}

function ShimmerRow({ width="100%" }) {
  return <div style={{ height:11, borderRadius:8, marginBottom:9, width,
    background:"linear-gradient(90deg,#e0e7ff 25%,#f5f3ff 50%,#e0e7ff 75%)",
    backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite" }}/>;
}

function ShimmerCard({ delay=0 }) {
  return (
    <div style={{ background:"white", borderRadius:16, padding:"20px 24px", marginBottom:12,
      boxShadow:"0 2px 12px rgba(99,102,241,0.07)", animation:`fadeUp 0.4s ${delay}s both` }}>
      <ShimmerRow width="42%"/><ShimmerRow/><ShimmerRow width="85%"/><ShimmerRow width="68%"/>
    </div>
  );
}

// Renders **bold** markdown as real bold spans
function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ fontWeight:700, color:"#1e1b4b" }}>{part}</strong>
      : part
  );
}

function PRDCard({ icon, title, content, delay, accent }) {
  // clean line: remove leading bullet variants, we add our own
  const lines = content.split("\n").filter(Boolean);
  return (
    <div style={{ background:"white", borderRadius:16, padding:"20px 24px", marginBottom:12,
      borderLeft:`4px solid ${accent}`, boxShadow:"0 2px 18px rgba(99,102,241,0.08)",
      animation:`fadeUp 0.5s ${delay}s both` }}>
      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <span style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:16, color:"#312e81" }}>{title}</span>
      </div>
      {lines.map((line, i) => {
        const isBullet = line.startsWith("•") || line.startsWith("-") || line.match(/^\d+\./);
        const clean    = line.replace(/^[•\-]\s*/, "").replace(/^\d+\.\s*/, "");
        const num      = line.match(/^(\d+)\./)?.[1];
        return (
          <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
            {isBullet && (
              <span style={{ flexShrink:0, marginTop:3,
                color: accent, fontWeight:700, fontSize: num ? 13 : 18,
                lineHeight:1, minWidth:18, textAlign:"center" }}>
                {num ? `${num}.` : "•"}
              </span>
            )}
            <p style={{ fontSize:14, color:"#374151", lineHeight:1.75, margin:0,
              paddingLeft: isBullet ? 0 : 0 }}>
              {renderBold(clean)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

PRDCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  delay: PropTypes.number,
  accent: PropTypes.string.isRequired,
};

function ScorePill({ label, score }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12,
      padding:"10px 16px", textAlign:"center", minWidth:85 }}>
      <div style={{ color:"rgba(255,255,255,0.7)", fontSize:10.5, fontWeight:700, marginBottom:4 }}>{label}</div>
      <div style={{ color:"white", fontSize:19, fontWeight:900 }}>{score}</div>
    </div>
  );
}

ScorePill.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function useTypewriter(text, speed=22, active=false) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!active || !text) return;
    setShown(""); let i = 0;
    const t = setInterval(() => {
      setShown(text.slice(0,++i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, active]);
  return shown;
}

function extractJSON(raw) {
  if (!raw?.trim()) return null;
  let s = raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
  const start = s.indexOf("{"), end = s.lastIndexOf("}");
  if (start !== -1 && end > start) s = s.slice(start, end+1);
  try { return JSON.parse(s); } catch {}
  try {
    let fix = s;
    const oB=(fix.match(/\{/g)||[]).length, cB=(fix.match(/\}/g)||[]).length;
    const oA=(fix.match(/\[/g)||[]).length, cA=(fix.match(/\]/g)||[]).length;
    if ((fix.match(/"/g)||[]).length%2!==0) fix+='"';
    for (let i=0;i<oA-cA;i++) fix+="]";
    for (let i=0;i<oB-cB;i++) fix+="}";
    return JSON.parse(fix);
  } catch {}
  return null;
}

const ACCENTS        = ["#6366f1","#7c3aed","#8b5cf6","#a78bfa","#818cf8","#4f46e5","#6d28d9"];
const FALLBACK_ICONS = ["🎯","👤","✅","📐","📊","⚠️","🛣️"];
const EXAMPLES = [
  "Product managers waste 3-5 hours writing PRDs manually with inconsistent formats",
  "Users can't track fitness goals because the app doesn't give personalised insights",
  "Support agents handle 200+ tickets/day but have no AI assistance for routing",
  "Developers spend 4+ hours daily context-switching because there is no AI coding copilot integrated into our IDE",
  "Field sales reps miss follow-ups because CRM has no AI that auto-summarises calls and suggests next best action",
];

const SYSTEM = `You are a world-class Senior Product Manager with 15 years at top tech companies.

YOUR ENTIRE RESPONSE MUST BE A SINGLE JSON OBJECT.
ABSOLUTELY NO markdown anywhere. NO asterisks. NO bold like **this**. Plain text only.
DO NOT write anything before or after the JSON.
Start with { and end with }. That is all.

Required JSON fields (use EXACTLY these camelCase names):
{
  "title": "short product name max 6 words",
  "qualityScore": 94,
  "completeness": 96,
  "readyForEng": true,
  "estimatedSprint": "3 sprints",
  "riskLevel": "Medium",
  "sections": [{ "icon": "emoji", "title": "title", "content": "line1
line2" }]
}

CONTENT FORMAT RULES:
- Every line in content starts with bullet: • 
- Lines separated by actual newline character
- NO asterisks NO bold NO markdown formatting anywhere
- Minimum 5 bullet points per section
- Plain readable professional English only

EXACTLY 7 sections:
1. icon 🎯 title "Problem Statement" - root cause, current pain, business impact with real data
2. icon 👤 title "Target User and Persona" - job title, company size, workflow, exact frustrations
3. icon ✅ title "User Stories" - 4 stories: As a [role], I want [feature], so that [outcome]
4. icon 📐 title "Acceptance Criteria" - 6 numbered testable pass/fail conditions starting with 1.
5. icon 📊 title "Success Metrics and KPIs" - 5 SMART metrics with baseline and target numbers
6. icon ⚠️ title "Risks and Edge Cases" - 5 risks with likelihood, impact, mitigation
7. icon 🛣️ title "Roadmap and Prioritisation" - MVP/V2/V3 phases with features and timeline
`;
export default function App() {
  const windowW  = useWindowWidth();
  const isMobile = windowW < 640;
  const [input,  setInput]  = useState("");
  const [phase,  setPhase]  = useState("idle");
  const [prd,    setPrd]    = useState(null);
  const [err,    setErr]    = useState("");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const outputRef = useRef(null);
  const titleShown = useTypewriter(prd?.title||"", 25, phase==="done");

  async function generate() {
    if (!input.trim() || phase==="loading") return;
    setPhase("loading"); setPrd(null); setErr("");
    try {
      // ── Claude API (paste your key from console.anthropic.com) ──
      const CLAUDE_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: SYSTEM,
          messages: [{ role: "user", content: "Generate PRD JSON for: " + input.trim() + ". Raw JSON only. Start with {" }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error("Claude Error: " + data.error.message);
      const raw    = data?.content?.find(b => b.type === "text")?.text ?? "";
      const parsed = extractJSON(raw);
      if (!parsed?.sections?.length) throw new Error("Could not parse. Please rephrase and try again.");
      setPrd(parsed); setPhase("done");
      setTimeout(()=>outputRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),350);
    } catch(e) {
      setErr(e.message||"Unexpected error."); setPhase("error");
    }
  }

  return (
    <ErrorBoundary>
    <div style={{ minHeight:"100vh",
      background:"linear-gradient(135deg,#f5f3ff 0%,#ede9fe 45%,#e0e7ff 100%)",
      fontFamily:"system-ui,sans-serif", position:"relative" }}>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes floatBob  {0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
        @keyframes shimmer   {0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp    {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes spin      {from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes pulse     {0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes gradShift {0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes pop       {from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
        textarea:focus{outline:none!important;border-color:#818cf8!important;box-shadow:0 0 0 3px rgba(129,140,248,0.2)!important}
        @media(max-width:640px){
          h1{font-size:32px!important;}
          .prd-actions{flex-direction:column!important;}
        }
        button{cursor:pointer;transition:all 0.18s ease}
        button:hover{transform:translateY(-1px)}
        button:focus{outline:2px solid #818cf8;outline-offset:2px;}
        textarea:focus-visible{outline:2px solid #818cf8;outline-offset:2px;}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#c4b5fd;border-radius:10px}
      `}</style>

      <Particles/>

      <div style={{position:"relative",zIndex:1,maxWidth:780,margin:"0 auto",padding:"40px 20px 80px"}}>

        {/* Badge */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:24,animation:"pop 0.6s ease both"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"white",
            border:"1.5px solid #c4b5fd",borderRadius:100,padding:"6px 18px",
            fontSize:12,fontWeight:600,color:"#6d28d9",boxShadow:"0 2px 20px rgba(139,92,246,0.13)"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#7c3aed",
              display:"inline-block",animation:"pulse 2s infinite"}}/>
            POC #1 · Shivani Chaudhary · PM Portfolio
          </div>
        </div>

        {/* Title */}
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(30px,5vw,50px)",fontWeight:900,
          textAlign:"center",lineHeight:1.15,marginBottom:12,
          background:"linear-gradient(135deg,#312e81 0%,#6d28d9 50%,#818cf8 100%)",
          backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          animation:"gradShift 5s ease infinite,fadeUp 0.7s 0.1s both"}}>
          AI-Powered<br/>PRD Generator
        </h1>

        <p style={{textAlign:"center",color:"#6b7280",fontSize:15,lineHeight:1.7,
          maxWidth:490,margin:"0 auto 30px",animation:"fadeUp 0.7s 0.25s both"}}>
          Describe your product problem → get a full structured PRD with user stories,
          KPIs, acceptance criteria, risks and roadmap in seconds.
        </p>

        {/* Input Card */}
        <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(14px)",
          borderRadius:22,padding:"24px 24px 20px",
          boxShadow:"0 8px 48px rgba(99,102,241,0.11)",
          border:"1.5px solid rgba(196,181,253,0.5)",
          animation:"fadeUp 0.7s 0.4s both",marginBottom:20}}>

          <label style={{display:"block",fontWeight:700,fontSize:12,color:"#4c1d95",
            marginBottom:10,letterSpacing:"0.07em"}}>
            🧠 DESCRIBE YOUR PRODUCT PROBLEM
          </label>

          <textarea aria-label="Describe your product problem" value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))generate();}}
            placeholder="e.g. Product managers waste 3-5 hours writing PRDs manually with no consistent format..."
            rows={4} style={{width:"100%",border:"1.5px solid #e0e7ff",borderRadius:13,
              padding:"13px 15px",fontSize:14,color:"#1e1b4b",background:"#faf9ff",
              lineHeight:1.7,resize:"vertical",fontFamily:"system-ui,sans-serif"}}/>

          <div style={{marginTop:10,marginBottom:14,display:"flex",flexWrap:"wrap",alignItems:"center",gap:6}}>
            <span style={{fontSize:11.5,color:"#9ca3af",fontWeight:500}}>Try: </span>
            {EXAMPLES.map((ex,i)=>(
              <button key={i} onClick={()=>setInput(ex)}
                style={{fontSize:11,padding:"3px 10px",borderRadius:100,
                  border:"1px solid #e0e7ff",background:"white",color:"#6d28d9",fontWeight:500}}>
                {["📦","💪","🎫","🤖","📈"][i]} Example {i+1}
              </button>
            ))}
          </div>

          <button aria-label="Generate PRD with Claude AI" onClick={generate} disabled={phase==="loading"||!input.trim()} style={{
            width:"100%",padding:"14px 24px",
            background:phase==="loading"
              ?"linear-gradient(135deg,#c4b5fd,#a5b4fc)"
              :"linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#6d28d9 100%)",
            backgroundSize:"200% 200%",
            animation:phase!=="loading"?"gradShift 4s ease infinite":"none",
            border:"none",borderRadius:13,color:"white",fontSize:15,fontWeight:700,
            boxShadow:phase==="loading"?"none":"0 4px 24px rgba(99,102,241,0.36)",
            display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            opacity:!input.trim()?0.55:1}}>
            {phase==="loading"?(
              <>
                <div style={{width:17,height:17,border:"2.5px solid rgba(255,255,255,0.3)",
                  borderTop:"2.5px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                Claude is writing your PRD…
              </>
            ):phase==="done"?"✨ Regenerate PRD":"✨ Generate PRD with Claude AI"}
          </button>
          <p style={{textAlign:"center",fontSize:11,color:"#9ca3af",marginTop:9}}>
            Ctrl/⌘ + Enter · Powered by Claude claude-sonnet-4-20250514
          </p>
        </div>

        {/* Shimmer */}
        {phase==="loading"&&(
          <div style={{animation:"fadeUp 0.4s ease"}}>
            <p style={{textAlign:"center",fontSize:12,color:"#7c3aed",fontWeight:700,
              letterSpacing:"0.08em",marginBottom:16}}>✦ WRITING YOUR PRD ✦</p>
            {[0,.1,.18,.12,.22,.16,.2].map((d,i)=><ShimmerCard key={i} delay={d}/>)}
          </div>
        )}

        {/* Error */}
        {phase==="error"&&(
          <div style={{background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:14,
            padding:"16px 20px",animation:"fadeUp 0.4s ease",
            display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
            <p style={{color:"#b91c1c",fontSize:13.5,lineHeight:1.6,margin:0}}>
              <strong>⚠️ Error:</strong> {err}
            </p>
            <button onClick={()=>setPhase("idle")} style={{flexShrink:0,fontSize:12,
              padding:"5px 12px",borderRadius:8,border:"1px solid #fca5a5",
              background:"white",color:"#b91c1c",fontWeight:600}}>Retry</button>
          </div>
        )}

        {/* PRD Output */}
        {phase==="done"&&prd&&(
          <div ref={outputRef}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",
              marginBottom:16,flexWrap:"wrap",gap:10}}>
              <div>
                <p style={{fontSize:11,color:"#9ca3af",fontWeight:700,letterSpacing:"0.08em",marginBottom:5}}>
                  ✦ GENERATED PRD
                </p>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:21,color:"#312e81",lineHeight:1.3,maxWidth:460}}>
                  {titleShown}
                  <span style={{animation:"pulse 0.9s infinite",opacity:titleShown===prd.title?0:1}}>|</span>
                </h2>
              </div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <button onClick={()=>{
                  navigator.clipboard.writeText(`# ${prd.title}\n\n${prd.sections.map(s=>`## ${s.title}\n${s.content}`).join("\n\n")}`);
                  setCopied(true); setTimeout(()=>setCopied(false),2200);
                }} style={{padding:"7px 14px",borderRadius:9,border:"1.5px solid #c4b5fd",
                  background:"white",color:"#6d28d9",fontSize:12,fontWeight:600}}>
                  {copied?"✓ Copied!":"📋 Copy PRD"}
                </button>
                <button onClick={()=>{
                  const md = `# ${prd.title}\n\n${prd.sections.map(s=>`## ${s.icon} ${s.title}\n\n${s.content}`).join("\n\n")}\n\n---\n**Quality Score:** ${prd.qualityScore}/100 | **Completeness:** ${prd.completeness}% | **Sprints:** ${prd.estimatedSprint} | **Risk:** ${prd.riskLevel}`;
                  const blob = new Blob([md],{type:"text/markdown"});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href=url; a.download=`${prd.title.replace(/\s+/g,"-").toLowerCase()}-prd.md`; a.click();
                  URL.revokeObjectURL(url);
                  setDownloaded(true); setTimeout(()=>setDownloaded(false),2200);
                }} style={{padding:"7px 14px",borderRadius:9,border:"1.5px solid #a5f3fc",
                  background:"white",color:"#0e7490",fontSize:12,fontWeight:600}}>
                  {downloaded?"✓ Saved!":"⬇ Export .md"}
                </button>
                <button onClick={()=>{setPhase("idle");setPrd(null);setInput("");setErr("");}}
                  style={{padding:"7px 14px",borderRadius:9,border:"1.5px solid #e0e7ff",
                    background:"white",color:"#6b7280",fontSize:12,fontWeight:600}}>
                  ↺ New
                </button>
              </div>
            </div>

            {prd.sections.map((s,i)=>(
              <PRDCard key={i}
                icon={s.icon||FALLBACK_ICONS[i]||"📌"}
                title={s.title} content={s.content}
                accent={ACCENTS[i%ACCENTS.length]} delay={i*0.07}/>
            ))}

            {/* Quality Dashboard */}
            <div style={{background:"linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#6d28d9 100%)",
              borderRadius:18,padding:"20px 24px",marginTop:8,animation:"fadeUp 0.5s 0.5s both"}}>
              <p style={{color:"rgba(255,255,255,0.65)",fontSize:11,fontWeight:700,
                letterSpacing:"0.08em",marginBottom:14}}>PRD QUALITY DASHBOARD</p>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(5,1fr)",gap:10,alignItems:"center"}}>
                <ScorePill label="QUALITY"      score={`${prd.qualityScore}/100`}/>
                <ScorePill label="COMPLETENESS" score={`${prd.completeness}%`}/>
                <ScorePill label="SPRINTS"      score={prd.estimatedSprint}/>
                <ScorePill label="RISK"         score={prd.riskLevel}/>
                <div style={{background:"rgba(255,255,255,0.15)",borderRadius:11,padding:"10px 14px",textAlign:"center"}}>
                  <p style={{color:"rgba(255,255,255,0.7)",fontSize:10.5,fontWeight:700,marginBottom:4}}>ENG READY</p>
                  <p style={{color:"white",fontSize:19,fontWeight:900}}>{prd.readyForEng?"✓ Yes":"⚠ Soon"}</p>
                </div>
              </div>
              <div style={{marginTop:12,fontSize:12,color:"rgba(255,255,255,0.65)",display:"flex",gap:14,flexWrap:"wrap"}}>
                <span>✓ 7 sections complete</span>
                <span>✓ SMART KPIs defined</span>
                <span>✓ Risks documented</span>
                <span>✓ Sprint-ready</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",marginTop:36}}>
          {["Claude Sonnet 4.6","Anthropic API","PRD Automation","AI-Powered","PM Tooling"].map(t=>(
            <span key={t} style={{padding:"5px 11px",borderRadius:100,fontSize:11.5,
              background:"rgba(255,255,255,0.75)",border:"1px solid #e0e7ff",color:"#6d28d9",fontWeight:500}}>{t}</span>
          ))}
        </div>

      </div>
    </div>
    </ErrorBoundary>
  );
}
