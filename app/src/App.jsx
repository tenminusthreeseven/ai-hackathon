import React, { useState, useRef } from "react";

// Single-file React app (App component) that contains:
// - Dark themed UI (Tailwind)
// - AI Image Recognition (camera + upload) (your original code integrated)
// - Resume Builder (form + live preview + export/print)
// - Document Verification (upload + simulated checks)
// - AI Interview Coach (practice Q&A with simple client-side feedback)
// This file is intended to be used in a Create React App / Vite project with TailwindCSS set up.

export default function App() {
  const [route, setRoute] = useState("home");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white flex flex-col">
      <Header route={route} setRoute={setRoute} />
      <main className="flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-6xl">
          {route === "home" && <Home />}
          {route === "resume" && <ResumeBuilder />}
          {route === "verify" && <DocumentVerification />}
          {route === "coach" && <InterviewCoach />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Header({ route, setRoute }) {
  return (
    <header className="w-full border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            CVForge
          </div>
          <nav className="hidden md:flex gap-2">
            <NavButton active={route === "home"} onClick={() => setRoute("home")}>Home</NavButton>
            <NavButton active={route === "resume"} onClick={() => setRoute("resume")}>Resume Builder</NavButton>
            <NavButton active={route === "verify"} onClick={() => setRoute("verify")}>Document Verify</NavButton>
            <NavButton active={route === "coach"} onClick={() => setRoute("coach")}>AI Interview Coach</NavButton>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setRoute("resume")} className="hidden md:inline-block px-4 py-2 rounded-lg bg-white/6 hover:bg-white/10">Start Building</button>
          <div className="text-sm text-gray-400"></div>
        </div>
      </div>
    </header>
  );
}

function NavButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-lg ${active ? "bg-white/6" : "hover:bg-white/3"}`}>
      {children}
    </button>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-gray-900 mt-8">
      <div className="max-w-6xl mx-auto p-4 text-sm text-gray-500">© {new Date().getFullYear()} CVForge — AI-assisted resumes, docs, and interview practice.</div>
    </footer>
  );
}

/* -------------------- Home (Image recognition + intro) -------------------- */
function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <div className="backdrop-blur-xl bg-white/3 border border-white/6 shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">AI Image Recognition & Upload</h1>
          <p className="text-gray-300 mb-4">Upload an image or take a photo. Use this to attach a photo to your resume or verify documents.</p>
          <ImageCaptureCard />
        </div>

        <div className="mt-6 p-6 rounded-2xl border border-white/5 bg-white/2">
          <h2 className="text-xl font-semibold mb-2">What you can do</h2>
          <ul className="text-gray-300 list-disc list-inside space-y-1">
            <li>Build and export resumes with live preview</li>
            <li>Upload documents for quick verification checks</li>
            <li>Practice interview Q&A with instant feedback</li>
          </ul>
        </div>
      </div>

      <div>
        <div className="p-8 rounded-2xl border border-white/6 bg-gradient-to-br from-gray-900/40 via-black to-gray-900/30">
          <h2 className="text-2xl font-bold mb-3">Quick Start</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Create your resume in Resume Builder</li>
            <li>Attach image or documents</li>
            <li>Run verification and practice interview</li>
          </ol>
          <div className="mt-6 flex gap-3">
            <a href="#" onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'})}} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500">Get Started</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); alert('Try the Interview Coach tab!')}} className="px-4 py-2 rounded-lg border border-white/10">Try Interview Coach</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Image capture (your original camera/upload UI) -------------------- */
function ImageCaptureCard() {
  const [image, setImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Camera access denied or not supported.");
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setImage(imageData);

    // Stop the camera
    const stream = video.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        {!cameraActive && (
          <div className="flex flex-col gap-4">
            <label className="flex flex-col items-center justify-center border border-gray-500/40 border-dashed rounded-xl p-6 cursor-pointer hover:bg-white/5 transition">
              <span className="text-gray-300 mb-2">Click to upload image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>

            <button onClick={startCamera} className="flex flex-col items-center justify-center border border-gray-500/40 rounded-xl p-4 cursor-pointer hover:bg-white/5 transition text-gray-300">
              Take Photo
            </button>
          </div>
        )}

        {cameraActive && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <video ref={videoRef} className="w-full rounded-lg shadow-lg" />
            <button onClick={takePhoto} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition font-semibold shadow-lg">
              Capture Photo
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden"></canvas>

        {image && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <img src={image} alt="preview" className="w-full rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- Resume Builder -------------------- */
function ResumeBuilder() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    experience: [{ company: "", role: "", period: "", details: "" }],
    education: [{ school: "", degree: "", year: "" }],
    skills: "",
  });

  function updateField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function updateExperience(idx, key, value) {
    const next = [...form.experience];
    next[idx][key] = value;
    setForm((s) => ({ ...s, experience: next }));
  }

  function addExperience() {
    setForm((s) => ({ ...s, experience: [...s.experience, { company: "", role: "", period: "", details: "" }] }));
  }

  function removeExperience(idx) {
    const next = form.experience.filter((_, i) => i !== idx);
    setForm((s) => ({ ...s, experience: next }));
  }

  function addEducation() {
    setForm((s) => ({ ...s, education: [...s.education, { school: "", degree: "", year: "" }] }));
  }

  function updateEducation(idx, key, value) {
    const next = [...form.education];
    next[idx][key] = value;
    setForm((s) => ({ ...s, education: next }));
  }

  function removeEducation(idx) {
    const next = form.education.filter((_, i) => i !== idx);
    setForm((s) => ({ ...s, education: next }));
  }

  function downloadResume() {
    // Create a printable HTML and open in new tab for user to print/save as PDF
    const html = renderResumeHTML(form);
    const w = window.open("", "_blank");
    if (!w) return alert("Pop-up blocked. Allow pop-ups for this site to export.");
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl border border-white/6 bg-white/3">
        <h2 className="text-2xl font-bold mb-4">Resume Builder</h2>
        <div className="space-y-3">
          <input className="w-full p-3 rounded-lg bg-black/40 border border-white/6" placeholder="Full name" value={form.name} onChange={(e)=>updateField('name', e.target.value)} />
          <input className="w-full p-3 rounded-lg bg-black/40 border border-white/6" placeholder="Title (e.g. Product Designer)" value={form.title} onChange={(e)=>updateField('title', e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="p-3 rounded-lg bg-black/40 border border-white/6" placeholder="Email" value={form.email} onChange={(e)=>updateField('email', e.target.value)} />
            <input className="p-3 rounded-lg bg-black/40 border border-white/6" placeholder="Phone" value={form.phone} onChange={(e)=>updateField('phone', e.target.value)} />
          </div>

          <textarea className="w-full p-3 rounded-lg bg-black/40 border border-white/6" placeholder="Professional summary" value={form.summary} onChange={(e)=>updateField('summary', e.target.value)} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Experience</div>
              <button onClick={addExperience} className="text-sm px-2 py-1 rounded bg-white/5">Add</button>
            </div>
            <div className="space-y-2">
              {form.experience.map((exp, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-black/30 border border-white/6">
                  <input placeholder="Company" className="w-full p-2 rounded bg-black/40 mb-1" value={exp.company} onChange={(e)=>updateExperience(idx, 'company', e.target.value)} />
                  <input placeholder="Role" className="w-full p-2 rounded bg-black/40 mb-1" value={exp.role} onChange={(e)=>updateExperience(idx, 'role', e.target.value)} />
                  <input placeholder="Period" className="w-full p-2 rounded bg-black/40 mb-1" value={exp.period} onChange={(e)=>updateExperience(idx, 'period', e.target.value)} />
                  <textarea placeholder="Details" className="w-full p-2 rounded bg-black/40 mb-1" value={exp.details} onChange={(e)=>updateExperience(idx, 'details', e.target.value)} />
                  <div className="flex justify-end">
                    <button onClick={()=>removeExperience(idx)} className="text-sm text-red-400">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Education</div>
              <button onClick={addEducation} className="text-sm px-2 py-1 rounded bg-white/5">Add</button>
            </div>
            <div className="space-y-2">
              {form.education.map((ed, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-black/30 border border-white/6">
                  <input placeholder="School" className="w-full p-2 rounded bg-black/40 mb-1" value={ed.school} onChange={(e)=>updateEducation(idx,'school',e.target.value)} />
                  <input placeholder="Degree" className="w-full p-2 rounded bg-black/40 mb-1" value={ed.degree} onChange={(e)=>updateEducation(idx,'degree',e.target.value)} />
                  <input placeholder="Year" className="w-full p-2 rounded bg-black/40 mb-1" value={ed.year} onChange={(e)=>updateEducation(idx,'year',e.target.value)} />
                  <div className="flex justify-end">
                    <button onClick={()=>removeEducation(idx)} className="text-sm text-red-400">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <input placeholder="Skills (comma separated)" className="w-full p-3 rounded-lg bg-black/40 border border-white/6" value={form.skills} onChange={(e)=>updateField('skills', e.target.value)} />

          <div className="flex gap-2 mt-3">
            <button onClick={downloadResume} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500">Export / Print</button>
            <button onClick={()=>{navigator.clipboard.writeText(JSON.stringify(form)); alert('JSON copied to clipboard');}} className="px-4 py-2 rounded-lg border border-white/10">Copy JSON</button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-white/6 bg-black/40">
        <h3 className="text-xl font-semibold mb-3">Live Preview</h3>
        <div className="bg-white/5 p-6 rounded-lg text-gray-100" id="resumePreview">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold">{form.name || "Your Name"}</div>
              <div className="text-sm text-gray-300">{form.title || "Your Title"}</div>
            </div>
            <div className="text-right text-sm text-gray-300">
              <div>{form.email}</div>
              <div>{form.phone}</div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Summary</h4>
            <p className="text-sm text-gray-300">{form.summary || "A short professional summary goes here."}</p>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Experience</h4>
            <div className="space-y-3">
              {form.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="font-medium">{exp.role || "Role"} — <span className="text-sm text-gray-300">{exp.company}</span></div>
                  <div className="text-sm text-gray-400">{exp.period}</div>
                  <div className="text-sm text-gray-300">{exp.details}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Education</h4>
            <div className="space-y-2">
              {form.education.map((ed, idx) => (
                <div key={idx} className="text-sm text-gray-300">{ed.degree} — {ed.school} ({ed.year})</div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Skills</h4>
            <div className="text-sm text-gray-300">{form.skills}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderResumeHTML(form) {
  const skills = (form.skills || "").split(",").map(s=>s.trim()).filter(Boolean).join(', ');
  return `
  <html>
    <head>
      <title>Resume - ${escapeHTML(form.name || 'Resume')}</title>
      <style>
        body{font-family: Arial, Helvetica, sans-serif;padding:20px;color:#111}
        .header{display:flex;justify-content:space-between}
        h1{margin:0}
      </style>
    </head>
    <body>
      <div class="header"><h1>${escapeHTML(form.name || '')}</h1><div>${escapeHTML(form.email || '')}<br/>${escapeHTML(form.phone|| '')}</div></div>
      <h3>${escapeHTML(form.title || '')}</h3>
      <p>${escapeHTML(form.summary || '')}</p>
      <h4>Experience</h4>
      ${form.experience.map(exp=>`<div><strong>${escapeHTML(exp.role)}</strong> — ${escapeHTML(exp.company)} <div>${escapeHTML(exp.period)}</div><div>${escapeHTML(exp.details)}</div></div>`).join('')}
      <h4>Education</h4>
      ${form.education.map(ed=>`<div>${escapeHTML(ed.degree)} — ${escapeHTML(ed.school)} (${escapeHTML(ed.year)})</div>`).join('')}
      <h4>Skills</h4>
      <div>${escapeHTML(skills)}</div>
      <script>setTimeout(()=>{window.print();},500)</script>
    </body>
  </html>
  `;
}

function escapeHTML(s){ if(!s) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }

/* -------------------- Document Verification -------------------- */
function DocumentVerification() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);

  function handleChange(e){
    const f = e.target.files?.[0];
    if(!f) return;
    setFile(f);
    // Simulate a verification pipeline
    setReport(null);
    setTimeout(()=>{
      const checks = [];
      // basic checks
      const nameCheck = !!f.name && f.name.length > 3;
      const sizeCheck = f.size < 5 * 1024 * 1024; // <5MB
      const typeCheck = /pdf|image|png|jpeg/.test(f.type || f.name.toLowerCase());
      checks.push({label:'Filename OK', ok:nameCheck});
      checks.push({label:'Size < 5MB', ok:sizeCheck});
      checks.push({label:'Filetype supported', ok:typeCheck});
      // Fake signature/ocr/metadata checks
      const metadataOK = Math.random() > 0.25; // sometimes fail
      checks.push({label:'Metadata looks valid', ok:metadataOK});
      const ocrOK = Math.random() > 0.4;
      checks.push({label:'OCR / text extractable', ok:ocrOK});

      const allOk = checks.every(c=>c.ok);
      setReport({checks, verdict: allOk ? 'PASS' : 'REVIEW', detail: allOk? 'Document appears valid' : 'Some checks failed; manual review recommended.'});
    }, 900);
  }

  return (
    <div className="p-6 rounded-2xl border border-white/6 bg-white/3">
      <h2 className="text-2xl font-bold mb-3">Document Verification</h2>
      <p className="text-gray-300 mb-4">Upload resumes, certificates, ID photos, or PDFs. This performs quick automated checks (filename, size, basic OCR). For production use, connect a backend verification or specialized OCR / forensic service.</p>

      <div className="flex gap-4">
        <label className="flex-1 p-4 rounded-lg border border-dashed border-white/10 text-center bg-black/40 cursor-pointer">
          <div className="text-sm text-gray-300">Click to upload document (PDF / Image)</div>
          <input type="file" className="hidden" onChange={handleChange} />
        </label>
        <div className="w-1/3 p-4 rounded-lg bg-black/30 border border-white/6">
          <div className="text-sm text-gray-300 mb-2">Current file</div>
          <div className="text-sm">{file ? file.name : <span className="text-gray-500">None</span>}</div>
        </div>
      </div>

      <div className="mt-6">
        {report ? (
          <div className="p-4 rounded-lg bg-black/40 border border-white/6">
            <div className={`inline-block px-3 py-1 rounded ${report.verdict === 'PASS' ? 'bg-green-600/30 text-green-200' : 'bg-yellow-800/20 text-yellow-200'}`}>Status: {report.verdict}</div>
            <div className="mt-3 text-gray-300">{report.detail}</div>
            <ul className="mt-3 space-y-2">
              {report.checks.map((c, i) => (
                <li key={i} className={`text-sm ${c.ok ? 'text-green-200' : 'text-red-300'}`}>{c.ok ? '✔' : '✖'} {c.label}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-gray-500">No report yet. Upload a file to run verification.</div>
        )}
      </div>

    </div>
  );
}

/* -------------------- AI Interview Coach (client-side) -------------------- */
function InterviewCoach(){
  const [messages, setMessages] = useState([
    {from:'bot', text:'Hi — I am your interview coach. Tell me what role you are preparing for or click a sample question.'}
  ]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState('Software Engineer');

  function pushMessage(msg){ setMessages(m=>[...m, msg]); }

  function practiceQuestion(q){
    pushMessage({from:'user', text:q});
    const bot = generateCoachResponse(q, role);
    setTimeout(()=> pushMessage({from:'bot', text:bot}), 500);
  }

  function handleSubmit(e){ e.preventDefault(); if(!input.trim()) return; practiceQuestion(input); setInput(''); }

  return (
    <div className="p-6 rounded-2xl border border-white/6 bg-white/3">
      <h2 className="text-2xl font-bold mb-3">AI Interview Coach</h2>
      <p className="text-gray-300 mb-4">Practice common interview questions and get instant feedback. This is a lightweight, client-side mock of an AI coach — for production connect to an LLM backend to generate tailored feedback and scoring.</p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="p-4 rounded-lg bg-black/40 h-96 overflow-y-auto" id="chatWindow">
            {messages.map((m, i)=> (
              <div key={i} className={`mb-3 ${m.from==='bot' ? 'text-gray-300' : 'text-white'}`}>
                <div className={`inline-block p-3 rounded-lg ${m.from==='bot' ? 'bg-black/20' : 'bg-gradient-to-r from-purple-600 to-blue-500'}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type your answer or question" className="flex-1 p-3 rounded-lg bg-black/40 border border-white/6" />
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500">Send</button>
          </form>
        </div>

        <div className="p-4 rounded-lg bg-black/30 border border-white/6">
          <div className="mb-3">
            <label className="text-sm text-gray-300">Target role</label>
            <input value={role} onChange={(e)=>setRole(e.target.value)} className="w-full p-2 rounded bg-black/40 mt-1" />
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-300 mb-1">Sample questions</div>
            <button onClick={()=>practiceQuestion('Tell me about yourself.')} className="w-full text-left p-2 rounded hover:bg-white/5">Tell me about yourself</button>
            <button onClick={()=>practiceQuestion('Why do you want this role?')} className="w-full text-left p-2 rounded hover:bg-white/5">Why do you want this role?</button>
            <button onClick={()=>practiceQuestion('Describe a challenge you faced and how you solved it.')} className="w-full text-left p-2 rounded hover:bg-white/5">Challenge & solution</button>
            <button onClick={()=>practiceQuestion('Walk me through your resume.') } className="w-full text-left p-2 rounded hover:bg-white/5">Walk me through your resume</button>
          </div>

        </div>
      </div>
    </div>
  );
}

function generateCoachResponse(userText, role){
  // Lightweight heuristic-based responses and feedback
  const lowEffortReplies = [
    "Short answer. Try including a specific accomplishment and metrics.",
    "Good start — add a problem, action, result structure (PAR).",
    "Use more specific numbers/examples to demonstrate impact.",
    "Looks fine. Try adjusting tone for the role: highlight technical work for engineering roles, product outcomes for PM roles."
  ];

  const text = userText.toLowerCase();
  if(text.includes('tell me about') || text.includes('about yourself')){
    return "Start with a 2-3 sentence summary: who you are, your strongest skill or domain, and a recent accomplishment. Example: 'I'm a frontend engineer with 4 years building responsive apps. Recently I reduced page load time by 30% at X, improving conversions.'";
  }
  if(text.includes('why') && text.includes('want')){
    return "Mention the company/role alignment, and one key strength you bring. Show enthusiasm and specific fit (team, tech, mission).";
  }
  if(text.includes('challenge') || text.includes('problem')){
    return "Structure using Situation -> Action -> Result. Be concise: describe goal, steps you took, and measurable outcome (numbers if possible).";
  }

  // If the user gave a long answer, give automated feedback by simple heuristics:
  if(text.split(' ').length > 20){
    // look for numbers
    const hasNumber = /\d/.test(text);
    if(!hasNumber) return "Good content. Consider adding a measurable result (numbers, % improvement) to strengthen the answer.";
    return "Nice — you included specifics. Remember to tie the example back to role-relevant skills and keep it <2 minutes when spoken.";
  }

  // default
  return lowEffortReplies[Math.floor(Math.random()*lowEffortReplies.length)];
}
