import React from "react";
import { 
  Scan, 
  FileText, 
  Cpu, 
  Layers, 
  Eye, 
  Database,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function DetectionEngineView() {
  const pillars = [
    {
      id: "ocr",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      title: "OCR Gradient Analysis",
      pill: "Pillar 1",
      bgPill: "bg-blue-50 text-blue-700",
      description: "Inspects character geometry, layout grid alignments, and font classifications. Synthesizes semantic data directly from receipt screenshots to detect pixel shifts.",
      details: [
        { label: "Anomalies Checked", value: "Font mismatches, uneven kerning, overlapping pixels" },
        { label: "Baseline Rule", value: "Strict bounding-box consistency on transaction numbers" },
        { label: "Execution Depth", value: "Glyph edge derivative and character matrix extraction" }
      ]
    },
    {
      id: "metadata",
      icon: <Database className="w-5 h-5 text-teal-600" />,
      title: "Metadata & EXIF Auditing",
      pill: "Pillar 2",
      bgPill: "bg-teal-50 text-teal-700",
      description: "Reads the file stream's underlying structure, identifying sensor calibrations, creation timelines, and software tags.",
      details: [
        { label: "Anomalies Checked", value: "Adobe Photoshop markers, stripped tags, invalid headers" },
        { label: "Baseline Rule", value: "EXIF creation chronological parity with system upload" },
        { label: "Execution Depth", value: "Binary stream parsing of TIFF and JFIF property sequences" }
      ]
    },
    {
      id: "compression",
      icon: <Cpu className="w-5 h-5 text-pink-600" />,
      title: "Quantization & Compression Profiles",
      pill: "Pillar 3",
      bgPill: "bg-pink-50 text-pink-700",
      description: "Analyzes quantization tables used in JPEG and PNG encoding to verify single-saving hardware continuity.",
      details: [
        { label: "Anomalies Checked", value: "Local compression differences, cloned area re-saving" },
        { label: "Baseline Rule", value: "Homogeneous DCT (Discrete Cosine Transform) distribution" },
        { label: "Execution Depth", value: "Block-by-block entropy checks on standard 8x8 pixel arrays" }
      ]
    },
    {
      id: "ela",
      icon: <Layers className="w-5 h-5 text-amber-600" />,
      title: "Error Level Analysis (ELA)",
      pill: "Pillar 4",
      bgPill: "bg-amber-50 text-amber-700",
      description: "Resaves the image at a baseline 95% quality factor, mapping the byte-level error delta across individual sectors.",
      details: [
        { label: "Anomalies Checked", value: "Overlay composition, localized color brush tampering" },
        { label: "Baseline Rule", value: "Symmetric error intensity maps across all graphical depths" },
        { label: "Execution Depth", value: "Luminance subtraction mapping and transient hot-spot flagging" }
      ]
    },
    {
      id: "face",
      icon: <Eye className="w-5 h-5 text-indigo-600" />,
      title: "Biometric Face Consistency",
      pill: "Pillar 5",
      bgPill: "bg-indigo-50 text-indigo-750",
      description: "Replaces unempirical claims with spatial biometric landmark evaluations. Validates gaze vectors, skin texture, and splicing boundaries.",
      details: [
        { label: "Anomalies Checked", value: "Splicing seam artifacts, facial landmark mismatch" },
        { label: "Baseline Rule", value: "Coherent mathematical spatial geometry of human features" },
        { label: "Execution Depth", value: "Facial iris specular highlight checks and scale gradients" }
      ]
    },
    {
      id: "blockchain",
      icon: <Scan className="w-5 h-5 text-purple-600" />,
      title: "Decentralized Ledger Anchoring",
      pill: "Pillar 6",
      bgPill: "bg-purple-50 text-purple-700",
      description: "Locks the SHA255 receipt cryptographic fingerprint into a decentralized ledger node, establishing immutable record histories.",
      details: [
        { label: "Anomalies Checked", value: "Double-spent receipts, post-facto timeline alterations" },
        { label: "Baseline Rule", value: "One-to-one compliance verification state lookup on-ledger" },
        { label: "Execution Depth", value: "Direct cryptographic hash generation and smart logic checks" }
      ]
    }
  ];

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-8 animate-fade-in font-display">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-[10px] font-extrabold tracking-widest font-mono text-blue-600 uppercase">
          COGNITIVE ENGINE SPECIFICATIONS
        </p>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1">
          How Verification Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          TrustLens operates on a multi-layered forensic architecture. Instead of single black-box assertions, our engine cross-examines six structural pillars of media integrity using real-time spatial and metadata diagnostics.
        </p>
      </div>

      {/* Interactive pipeline flow diagram visualization */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-blue-500/10 to-transparent rounded-full filter blur-xl pointer-events-none"></div>
        
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-6">
          Real-time Payload Scanning Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch relative">
          
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-blue-400 block font-bold">STAGE 01</span>
              <h4 className="text-xs font-extrabold text-white uppercase mt-1">Ingest & Clean</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Normalizes dynamic data payloads, strips boundary wrapping byte tags, and maps dimensions.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80 text-[9px] text-slate-500 font-mono">
              Raw File Buffer Stream
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <span className="material-symbols-outlined text-[20px] animate-pulse">arrow_forward</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-pink-400 block font-bold">STAGE 02</span>
              <h4 className="text-xs font-extrabold text-white uppercase mt-1">Luminance & ELA</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Applies standard sub-grid Error Level Analysis to isolate layered pixels and font overlays.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80 text-[9px] text-slate-500 font-mono">
              Luminance Delta Core
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <span className="material-symbols-outlined text-[20px] animate-pulse">arrow_forward</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-purple-400 block font-bold">STAGE 03</span>
              <h4 className="text-xs font-extrabold text-white uppercase mt-1">Hash Anchoring</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Computes immutable secure SHA256 fingerprints and dispatches them on-chain.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80 text-[9px] text-slate-500 font-mono">
              Cryptographic Consensus
            </div>
          </div>

        </div>
      </div>

      {/* The 6 Pillars Bento Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold tracking-widest text-slate-500 uppercase font-mono px-1">
          Deep-Dive Forensic Pillars
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div 
              key={p.id} 
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                    {p.icon}
                  </div>
                  <span className={`text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded ${p.bgPill}`}>
                    {p.pill}
                  </span>
                </div>

                <h4 className="font-display font-bold text-base text-slate-900 mb-1.5">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-550 leading-relaxed mb-4">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-5 -mb-5 p-5 rounded-b-2xl space-y-2 text-[11px]">
                {p.details.map((d, index) => (
                  <div key={index} className="flex justify-between items-start gap-4">
                    <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">{d.label}</span>
                    <span className="text-slate-800 font-semibold text-right leading-tight">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust vs Manipulation Comparison Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
        <div>
          <h3 className="font-display font-extrabold text-lg text-slate-900 leading-snug mb-1">
            Meticulously Designed for Hiring Integrity
          </h3>
          <p className="text-xs text-slate-650 leading-relaxed">
            By avoiding unrealistic claims (like hacking into third-party servers or verifying offline digital credentials backed by mock systems), TrustLens provides a perfectly honest portfolio piece. We process real files, read their true pixels, parse meta EXIF packets, and lock the findings immutable on-ledger.
          </p>
        </div>
        <div className="space-y-3.5 font-mono text-xs">
          <div className="flex items-start gap-3 bg-white border border-emerald-100 p-3 rounded-xl shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-emerald-700 font-bold block text-[11px] uppercase tracking-wider">Valid Forensic Targets</span>
              <p className="text-slate-600 font-sans text-xs mt-0.5 leading-snug">
                Detects edited amounts, pixel spacing changes, character font conflicts, and erased metadata properties.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white border border-red-100 p-3 rounded-xl shadow-xs">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-red-700 font-bold block text-[11px] uppercase tracking-wider">Common Scammer Artifacts</span>
              <p className="text-slate-600 font-sans text-xs mt-0.5 leading-snug">
                Font discrepancies in transaction records, mismatched success-tick marks, altered reference numbers, and missing chronological alignment logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
