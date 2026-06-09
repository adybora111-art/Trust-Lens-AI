import React, { useState, useRef } from "react";
import { ForensicReport } from "../types";

interface PassportCardProps {
  report: ForensicReport;
  onBackToVerdict?: () => void;
}

export default function PassportCard({ report, onBackToVerdict }: PassportCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Constrain tilt angle to a subtle, elegant premium range (max 10 degrees)
    const tiltX = -y / (rect.height / 15);
    const tiltY = x / (rect.width / 15);

    setRotate({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Format short date
  const formattedDate = new Date(report.verifiedAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  // Pick portrait image representation based on classification
  const portraitUrl = report.isManipulated
    ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=240"
    : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300";

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Back button */}
      {onBackToVerdict && (
        <button
          onClick={onBackToVerdict}
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs cursor-pointer self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Audit Report
        </button>
      )}

      {/* The 3D Parallax Container */}
      <div
        className="w-full max-w-[800px] perspective-[1200px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.01 : 1})`,
            transition: isHovered ? "none" : "all 0.5s ease",
          }}
          className="relative bg-white rounded-3xl passport-shadow overflow-hidden border border-slate-200/60 transition-transform duration-500 hover:border-blue-500/30"
        >
          {/* Inner Guilloché security pattern layer */}
          <div className="absolute inset-0 guilloche-pattern opacity-40 pointer-events-none z-0"></div>
          
          {/* Holographic Sheen Overlay */}
          <div className="absolute inset-0 passport-holo-glow opacity-60 pointer-events-none z-10"></div>

          {/* Card Header watermark banner */}
          <div className="bg-slate-900 text-white py-3 px-8 flex justify-between items-center relative z-20 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">verified_user</span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-300">TrustLens Ledger Authority</span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">OFFICIAL SEAL</span>
          </div>

          {/* Main Passport contents */}
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-10">
            
            {/* Left Side: Photo & Trust Badge Watermark */}
            <div className="md:w-1/3 flex flex-col items-center gap-5 text-center">
              <div className="relative group">
                {/* Photo frame */}
                <div className="w-36 h-48 bg-slate-100 rounded-2xl border-2 border-slate-300/80 flex items-center justify-center overflow-hidden shadow-inner">
                  <img
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      report.isManipulated ? "grayscale hue-rotate-15 contrast-125" : "grayscale contrast-110"
                    }`}
                    src={portraitUrl}
                    alt="Verified Subject Identity"
                  />
                  {report.isManipulated && (
                    <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay"></div>
                  )}
                </div>

                {/* Secure Trust Badge */}
                <div className="absolute -bottom-3 -right-3">
                  <div className={`p-2 rounded-full border-[3px] bg-white shadow-md animate-pulse ${
                    report.isManipulated ? "border-red-200 text-red-600" : "border-emerald-200 text-emerald-600"
                  }`}>
                    <span className="material-symbols-outlined text-[24px] material-fill">
                      {report.isManipulated ? "error" : "verified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Unique Trust Hash */}
              <div className="space-y-1 mt-4">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">TRUST ANCHOR ID</p>
                <p className="font-mono text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-sm border border-slate-100 select-all">
                  {report.trustId.substring(0, 10)}...{report.trustId.substring(Math.max(0, report.trustId.length - 8))}
                </p>
              </div>

              {/* Blockchain Anchor */}
              <div className="mt-auto w-full">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col items-center text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Permanent Index</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                    Ethereum Mainnet
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5">Block #{report.blockNumber}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Identity Cert details and timeline */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-5 mb-6">
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-lg sm:text-xl">
                    {report.isManipulated ? "Altered Evidence File" : "Digital Forensics Certificate"}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                    AUTHENTICITY IDENTITY PASSPORT
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">SECURE CLASS</span>
                  <p className={`text-xs font-black px-2 py-0.5 rounded-sm inline-block ${
                    report.isManipulated 
                      ? "bg-red-50 text-red-700 border border-red-200/40" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200/40"
                  }`}>
                    {report.isManipulated ? "TIER 3 COMPROMISED" : "TIER 1 SECURE"}
                  </p>
                </div>
              </div>

              {/* Grid of specifications */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-6">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">RECORD TYPE</span>
                  <span className="text-xs font-semibold text-slate-800 truncate block">
                    {report.primaryClassification}
                  </span>
                </div>
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">COUNTRY REGISTRY</span>
                  <span className="text-xs font-mono font-semibold text-slate-800 block">TLS - TRUSTLENSHUB</span>
                </div>
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">VERIFIED DATE</span>
                  <span className="text-xs font-mono font-semibold text-slate-800 block">{formattedDate}</span>
                </div>
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">INTEGRITY INDEX</span>
                  <span className={`text-xs font-bold block ${
                    report.isManipulated ? "text-red-600" : "text-emerald-600"
                  }`}>
                    {report.isManipulated ? `${100 - report.confidenceScore}%` : `${report.confidenceScore}.98%`}
                  </span>
                </div>
              </div>

              {/* Ownership timeline ledger section */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">
                  BLOCKCHAIN OWNERSHIP TIMELINE
                </span>
                <div className="space-y-4 relative">
                  {/* Decorative timeline backbone */}
                  <div className="absolute left-[13px] top-[14px] bottom-[14px] w-[2px] bg-slate-200/80"></div>

                  {report.threatIntelligence.mitigationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 relative z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-[14px] ${
                        idx === 0 
                          ? "bg-slate-100 border-slate-300 text-slate-600" 
                          : idx === 1 
                            ? "bg-slate-100 border-slate-300 text-slate-600" 
                            : report.isManipulated 
                              ? "bg-red-50 border-red-300 text-red-600" 
                              : "bg-emerald-50 border-emerald-300 text-emerald-600"
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {idx === 0 ? "upload_file" : idx === 1 ? "verified" : report.isManipulated ? "security_update_warning" : "link"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{step}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {idx === 0 
                            ? "Origin Verification Payload Dispatched" 
                            : idx === 1 
                              ? "AI Neural Network Anomaly Matrix Checked" 
                              : `Ledger Signature Locked on Block #${report.blockNumber + idx}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Machine Readable Zone (MRZ) lookalike for passport */}
              <div className="mt-auto bg-slate-900 text-emerald-400/90 font-mono text-[10px] sm:text-[11px] p-3 rounded-lg border border-slate-800 leading-tight tracking-[0.16em] break-all select-none">
                P&lt;TLSTRUSTLENS&lt;AI&lt;&lt;{report.trustId.substring(2, 10).toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                <br />
                {report.trustId.substring(10, 30).toUpperCase()}M{report.blockNumber}9
              </div>
            </div>
          </div>

          {/* Footer signature bar */}
          <div className="bg-slate-50 border-t border-slate-200/65 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
            <p className="text-[10px] text-slate-400 font-medium">
              © TRUSTLENS SYSTEM V2.4 DIRECTIVES CERTIFIED. ALL RECORDS IMMUTABLE.
            </p>
            <div className="text-right flex items-center gap-2">
              <div className="text-right">
                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest leading-none">AUTHORED BY</p>
                <p className="text-sm font-semibold font-serif italic text-slate-800 mt-1">TrustLens System Seal</p>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-3xl">signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
