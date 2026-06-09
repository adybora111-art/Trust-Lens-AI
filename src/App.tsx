import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  FileText,
  LayoutDashboard,
  History,
  BookOpen,
  Award,
  Download,
  Share2,
  ExternalLink,
  Lock,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Plus,
  Maximize2,
  Fingerprint,
  Globe,
  Building,
  Database,
  Cpu,
  LineChart,
} from "lucide-react";
import { ForensicReport, ScamTemplate, ThreatAlert } from "./types";
import { SEEDED_SCAM_DATABASE, ENTERPRISE_ALERTS, PRESEEDED_REPORTS } from "./fraudDb";
import PassportCard from "./components/PassportCard";
import DetectionEngineView from "./components/DetectionEngineView";
import ApiDocumentationView from "./components/ApiDocumentationView";
import InteractiveForensicSandbox from "./components/InteractiveForensicSandbox";
import { jsPDF } from "jspdf";

export default function App() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<"dashboard" | "cases" | "intelligence" | "auditor" | "profile" | "settings" | "login" | "register" | "engine" | "api">("dashboard");

  // App core state
  const [cases, setCases] = useState<ForensicReport[]>(() => {
    const saved = localStorage.getItem("trustlens_cases");
    return saved ? JSON.parse(saved) : PRESEEDED_REPORTS;
  });

  const [selectedCase, setSelectedCase] = useState<ForensicReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadFileType, setUploadFileType] = useState<string>("payment");

  // Active Audit metrics / legal hold toggle
  const [legalHolds, setLegalHolds] = useState<Record<string, boolean>>({});
  const [falsePositives, setFalsePositives] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [showJsonRaw, setShowJsonRaw] = useState(false);
  const [showPassportView, setShowPassportView] = useState(false);

  // Regulatory compliance list interactive toggles
  const [complianceChecked, setComplianceChecked] = useState<Record<string, boolean>>({
    soc2_retention: true,
    gdpr_consent: true,
    aml_escrow: false,
    iso_audit: true,
  });

  // Simulator Search Query states
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // New Audit-Related Interactive states to resolve Phase 2 button/page issues
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [caseVerdictFilter, setCaseVerdictFilter] = useState<"all" | "tampered" | "authentic">("all");
  const [toastMessage, setToastMessage] = useState<string>("");

  // User details state with interactive inline-update features
  const [userProfile, setUserProfile] = useState({
    name: "Alex Compliance Manager",
    email: "adybora111@gmail.com",
    role: "Senior Financial Forensic Lead",
    org: "TrustLens Security Corp",
    location: "Singapore / Remote",
    clearance: "SOC2 Audit Master / Level 5",
    mfaEnabled: true,
  });

  // Platform Settings model and policy state
  const [platformSettings, setPlatformSettings] = useState({
    autoBlockchainAnchor: true,
    strictExifValidate: true,
    realtimeAlertNotifications: true,
    selectedEngineModel: "gemini-3.5-flash",
    retentionDays: "90",
  });

  // Local login/register control states
  const [authEmail, setAuthEmail] = useState("adybora111@gmail.com");
  const [authPassword, setAuthPassword] = useState("•••••••••");
  const [authName, setAuthName] = useState("Alex Compliance Manager");

  // Synchronize case history database with client localStorage
  useEffect(() => {
    localStorage.setItem("trustlens_cases", JSON.stringify(cases));
  }, [cases]);

  // Stepper descriptions for scanning loader
  const scanningSteps = [
    { title: "OCR Extraction", desc: "Parsing high-resolution textual data and identifying spatial anomalies." },
    { title: "Metadata Analysis", desc: "Checking EXIF registers, camera descriptors, and file modification clock timelines." },
    { title: "Forgery Detection", desc: "Executing Error Level Analysis (ELA) and localized quantization noise mapping." },
    { title: "Layout Validation", desc: "Cross-auditing font family tracking, vector alignments, and layer integrity." },
    { title: "Blockchain Verification", desc: "Sealing document fingerprint hashes and registering ownership state on-ledger." },
  ];

  // Dynamic ticking coordinate logging simulation
  const [liveCoord, setLiveCoord] = useState({ x: 192.1, y: 442.9, label: "EXTRACTING_TXID..." });
  useEffect(() => {
    if (!isAnalyzing) return;
    const labels = ["DETECTING_GLYPHS...", "MAPPING_PIXEL_ELA...", "PARSING_EXIF_CLOCK...", "LOCATING_BRUSH_STAMP...", "ANCHORING_BLOCKCHAIN..."];
    const interval = setInterval(() => {
      setLiveCoord({
        x: Number((Math.random() * 500 + 100).toFixed(1)),
        y: Number((Math.random() * 500 + 100).toFixed(1)),
        label: labels[Math.floor(Math.random() * labels.length)],
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Start analysis simulation and connect to Express Gemini Service
  const handleVerifyProcess = async (base64Image: string, fileName: string, fileType: string) => {
    setUploadedImage(base64Image);
    setUploadedFileName(fileName);
    setUploadFileType(fileType);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);
    setShowPassportView(false);

    // Dynamic scanning presentation stepper (3 seconds total)
    const stepInterval = setInterval(() => {
      setCurrentAnalysisStep((prev) => {
        if (prev >= scanningSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    try {
      // Dispatch authentication check to full-stack Express API route
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          fileType,
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error("Forensic Server API responded with an error");
      }

      const report: ForensicReport = await response.json();
      if (uploadedImage) {
        report.imageUrl = uploadedImage;
      }

      // Ensure that we let the visual loop complete for a rich scanning feel
      setTimeout(() => {
        setIsAnalyzing(false);
        // Save dynamically into historical cases state
        setCases((prev) => [report, ...prev]);
        setSelectedCase(report);
      }, 3100);

    } catch (err) {
      console.warn("Express server unavailable or failed. Initiating fallback local secure engine.", err);

      // Gracefully generate localized pristine mock standard reports
      setTimeout(() => {
        setIsAnalyzing(false);
        const chars = "XYZ0123456789ABCDEF";
        let subHash = "0x";
        for (let i = 0; i < 40; i++) subHash += chars[Math.floor(Math.random() * 16)];
        
        const fallbackReport: ForensicReport = {
          trustId: subHash,
          blockNumber: Math.floor(Math.random() * 1500000) + 18000000,
          fileName: fileName || "evidence_payload.png",
          verifiedAt: new Date().toISOString(),
          isManipulated: fileType === "payment" || fileName.toLowerCase().includes("tampered"),
          confidenceScore: 97,
          verdict: fileType === "payment" || fileName.toLowerCase().includes("tampered") ? "MANIPULATION DETECTED" : "VERIFIED AUTHENTIC",
          primaryClassification: fileType === "payment" ? "UPI Receipt Forgery Match" : "Identity Document Seal",
          ocrExtractedText: "TrustLens System Scanner extraction parsing completed successfully.",
          metadataDetails: {
            dimensions: "1080 x 2400 (FHD+)",
            softwareDetect: "Localized Compression Vector / Layer Overlay Filter",
            createdDate: new Date().toISOString(),
            anomaliesDetected: "EXIF fields indicate post-render digital painting overlays."
          },
          forensicAnalysisLog: [
            { name: "Pixel Noise Distribution", status: fileType === "payment" ? "critical" : "verified", details: "Discovered local contrast variances indicating digital composition." },
            { name: "JPEG Quantization ELA Check", status: fileType === "payment" ? "critical" : "verified", details: "Localized ELA score deviations on key digits." },
            { name: "Clock Validation Log", status: "warning", details: "System created date mismatch." }
          ],
          investigatorDirective: "COMPLIANCE NOTICE: Found active numeric altering on evidence payload.",
          threatIntelligence: {
            scamMatchSignature: "UPI_FRAUD_TEMPLATE_V4",
            regulatoryAuditTrail: "SOC2 Compliance Tracking Active.",
            mitigationSteps: ["Initiate legal hold", "Audit reference ID", "Synchronize with fraud library"]
          },
          isSimulated: true,
          engineUsed: "Decentralized Trust Engine (Browser Fallback)",
          imageUrl: uploadedImage || undefined
        };

        setCases((prev) => [fallbackReport, ...prev]);
        setSelectedCase(fallbackReport);
      }, 3100);
    }
  };

  // Convert uploaded browser file to standard base64 data structure
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      handleVerifyProcess(base64, file.name, uploadFileType);
    };
    reader.readAsDataURL(file);
  };

  // Interactive preset corporate test benches
  const triggerPresetDemo = (presetType: "payment" | "deepfake" | "document") => {
    const presets = {
      payment: {
        url: "https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=640",
        name: "UPI_PhonePe_INR_98500_Tampered.png",
        type: "payment",
      },
      deepfake: {
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=640",
        name: "Biometric_Portrait_GANswap.jpg",
        type: "deepfake",
      },
      document: {
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=640",
        name: "AcademicCert_VerifiableID.png",
        type: "document",
      },
    };

    const sel = presets[presetType];
    // Simple mock canvas base64 image representation of template
    const simulatedCanvas = document.createElement("canvas");
    const ctx = simulatedCanvas.getContext("2d");
    simulatedCanvas.width = 400;
    simulatedCanvas.height = 400;
    if (ctx) {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(`TrustLens Demo Plate: ${sel.name}`, 30, 80);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px monospace";
      ctx.fillText(`Type Target: ${sel.type.toUpperCase()}`, 30, 125);
      ctx.fillText(`Audit Flag: HIGH_COMPLIANCE`, 30, 145);
      ctx.fillRect(30, 180, 340, 4);
      ctx.fillStyle = "#10b981";
      ctx.fillRect(30, 180, 260, 4);
    }
    const fakeDataUrl = simulatedCanvas.toDataURL();
    handleVerifyProcess(fakeDataUrl, sel.name, sel.type);
  };

  // Copied link animation dispatch
  const handleCopySecureLink = (report: ForensicReport) => {
    const mockUrl = `https://trustlens.ai/verify/proof/${report.trustId}`;
    navigator.clipboard.writeText(mockUrl);
    setCopiedLink(true);
    setToastMessage("Secure SHA256 copy verification record link was successfully copied!");
    setTimeout(() => {
      setCopiedLink(false);
      setToastMessage("");
    }, 3000);
  };

  // Helper function to pre-load and convert image to HTMLImageElement for jsPDF embedding
  const getPdfImageElement = (url: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  };

  // Generate beautiful downloadable PDF cryptographic certificate seal
  const handleDownloadCertificate = async (report: ForensicReport) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const designColor = report.isManipulated ? [220, 38, 38] : [5, 150, 105]; // Crimson vs Emerald
      const accentGold = [197, 160, 89]; // #C5A059 Muted Luxury Gold
      const deepCharcoal = [15, 23, 42];

      // Beautiful Outer Border frames
      doc.setDrawColor(accentGold[0], accentGold[1], accentGold[2]);
      doc.setLineWidth(1.2);
      doc.rect(7, 7, 196, 283); // Outer luxury frame
      doc.setLineWidth(0.4);
      doc.rect(9, 9, 192, 279); // Inner thin luxury frame

      // Top Header Callout
      doc.setFillColor(deepCharcoal[0], deepCharcoal[1], deepCharcoal[2]);
      doc.rect(9, 9, 192, 35, "F");

      // Header text
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text("TRUSTLENS COHERENCE COMPLIANCE CERTIFICATE", 14, 22);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(accentGold[0], accentGold[1], accentGold[2]);
      doc.text("DECENTRALIZED CRYPTOGRAPHIC VERIFICATION & SIGNAL INTEGRITY VERDICT", 14, 28);
      
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(7);
      doc.text(`VERIFICATION HASH BLOCKCHAIN LINK: ${report.trustId}`, 14, 37);

      // Certificate content body
      doc.setTextColor(deepCharcoal[0], deepCharcoal[1], deepCharcoal[2]);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10.5);
      
      let cy = 60;
      doc.setFont("Helvetica", "bold");
      doc.text("SPECIMEN OF INQUEST PARTICULARS", 14, cy);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, cy + 2.5, 196, cy + 2.5);

      cy += 10;
      doc.setFontSize(9);
      
      const certificateDetails = [
        ["Asset File Name:", report.fileName],
        ["Decentralized Block Anchor:", `#${report.blockNumber}`],
        ["Registry Validation Date:", new Date(report.verifiedAt).toUTCString()],
        ["Analysis Forensic Engine:", report.engineUsed || "TrustLens AI Neural Core v3.5"],
        ["Confidence Index Score:", report.isManipulated ? `${report.confidenceScore}% probability of unauthorized alteration` : "100% genuine signal footprint"]
      ];

      certificateDetails.forEach(([title, val]) => {
        doc.setFont("Helvetica", "bold");
        doc.text(title, 14, cy);
        doc.setFont("Helvetica", "normal");
        doc.text(String(val), 68, cy);
        cy += 7;
      });

      cy += 4;
      
      // Large Verdict Stamp / Banner
      doc.setFillColor(designColor[0], designColor[1], designColor[2]);
      doc.rect(14, cy, 182, 24, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("OFFICIAL FORENSIC ASSESSMENT SUMMARY:", 18, cy + 8);
      doc.setFontSize(13);
      doc.text(report.verdict.toUpperCase(), 18, cy + 16);

      // Add a small padlock or verified check icon on the banner right side
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1.5);
      doc.circle(180, cy + 12, 6);
      doc.line(177, cy + 12, 179, cy + 14);
      doc.line(179, cy + 14, 183, cy + 9);

      // Rest of Certificate elements
      cy += 36;
      doc.setTextColor(deepCharcoal[0], deepCharcoal[1], deepCharcoal[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("EXAMINED FORENSIC CHECKS AUDIT TRAIL", 14, cy);
      doc.line(14, cy + 2.5, 196, cy + 2.5);

      cy += 10;
      doc.setFontSize(8.5);
      report.forensicAnalysisLog.forEach((log) => {
        doc.setFont("Helvetica", "bold");
        const emojiStatus = log.status === "verified" ? "[VERIFIED]" : log.status === "warning" ? "[WARNING]" : "[TAMPERED]";
        doc.text(`${emojiStatus}  ${log.name.toUpperCase()}`, 14, cy);
        doc.setFont("Helvetica", "normal");
        doc.text(`: ${log.details}`, 68, cy);
        cy += 6.5;
      });

      cy += 12;
      
      // Draw a classy security seal on bottom left
      const sealX = 42;
      const sealY = cy + 22;
      doc.setDrawColor(designColor[0], designColor[1], designColor[2]);
      doc.setLineWidth(1.2);
      doc.circle(sealX, sealY, 20); // Outer
      doc.setLineWidth(0.4);
      doc.circle(sealX, sealY, 17); // Inner
      
      // Decorative inner star spikes or spokes
      for (let angle = 0; angle < 360; angle += 30) {
        const rad = angle * Math.PI / 180;
        doc.line(
          sealX + 17 * Math.cos(rad),
          sealY + 17 * Math.sin(rad),
          sealX + 20 * Math.cos(rad),
          sealY + 20 * Math.sin(rad)
        );
      }
      
      doc.setTextColor(designColor[0], designColor[1], designColor[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("TRUSTLENS SEAL", sealX - 11, sealY - 4);
      doc.setFontSize(5);
      doc.text("AUDIT GENUINE", sealX - 9, sealY + 1);
      doc.setFontSize(6);
      doc.text(report.isManipulated ? "TAMPER EXPOSED" : "LEDGER INTEGRITY", sealX - 11, sealY + 5);

      // Embedded specimen thumbnail on bottom right!
      const specX = 142;
      const specY = cy + 2;
      doc.setDrawColor(deepCharcoal[0], deepCharcoal[1], deepCharcoal[2]);
      doc.setLineWidth(0.5);
      // Photo frame bounding box
      doc.setFillColor(248, 250, 252);
      doc.rect(specX, specY, 44, 44, "FD");
      
      const currentImg = report.imageUrl || uploadedImage;
      if (currentImg) {
        try {
          const imgObj = await getPdfImageElement(currentImg);
          if (imgObj) {
            doc.addImage(imgObj, "JPEG", specX + 1.5, specY + 1.5, 41, 41);
          } else {
            // Draw schematic inside frame
            doc.setDrawColor(148, 163, 184); // slate-400
            doc.line(specX, specY, specX + 44, specY + 44);
            doc.line(specX + 44, specY, specX, specY + 44);
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(6);
            doc.text("[ DIGITAL SPECIMEN ]", specX + 4, specY + 22);
          }
        } catch (e) {
          console.warn("Failed embedding certificate image", e);
        }
      } else {
        // Draw elegant mockup schema inside frame
        doc.setDrawColor(148, 163, 184); // slate-400
        doc.line(specX, specY, specX + 44, specY + 44);
        doc.line(specX + 44, specY, specX, specY + 44);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text("ANALYSIS SPECIMEN", specX + 9, specY + 20);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(5.5);
        doc.text("No raw input uploaded", specX + 10, specY + 26);
      }
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(deepCharcoal[0], deepCharcoal[1], deepCharcoal[2]);
      doc.text("SPECIMEN IMAGE CAPTURE", specX + 4, specY + 49);

      // Signature lines on far bottom
      cy += 50;
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.line(14, cy + 3, 76, cy + 3);
      doc.line(114, cy + 3, 176, cy + 3);
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7);
      doc.text("TRUSTLENS VERIFICATION OFFICER", 14, cy + 7);
      doc.text("LEAD COMPLIANCE FORENSIC BOARD", 114, cy + 7);
      
      doc.setFont("Helvetica", "normal");
      doc.text("Mainnet Active Ledger Host Identity Secured", 14, cy + 11);
      doc.text("Digital Signature Authority Match Verified", 114, cy + 11);

      // Save PDF certificate
      const safeName = report.fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      doc.save(`TrustLens_Forensic_Certificate_${safeName}.pdf`);
      
      setToastMessage("Success! Micro-secure PDF certificate generated and downloaded successfully.");
      setTimeout(() => setToastMessage(""), 5000);
    } catch (err: any) {
      console.error("Certificate PDF Render Error:", err);
      setToastMessage(`Certificate Download Error: ${err.message || String(err)}`);
      setTimeout(() => setToastMessage(""), 5000);
    }
  };

  // Simple Hash/Path Routing Sync to ensure no 404 or blank pages for requested URL paths
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname || "/";
      const hash = window.location.hash || "";
      
      // Support matching either pathname or hash routing (highly robust for standard and preview envs)
      const routeStr = (hash ? hash.replace("#", "") : path).toLowerCase();
      
      if (routeStr.endsWith("/settings")) {
        setActiveTab("settings");
        setSelectedCase(null);
      } else if (routeStr.endsWith("/profile")) {
        setActiveTab("profile");
        setSelectedCase(null);
      } else if (routeStr.endsWith("/login")) {
        setActiveTab("login");
        setSelectedCase(null);
      } else if (routeStr.endsWith("/register")) {
        setActiveTab("register");
        setSelectedCase(null);
      } else if (routeStr.endsWith("/history") || routeStr.endsWith("/cases") || routeStr.endsWith("/results")) {
        setActiveTab("cases");
        setSelectedCase(null);
      } else if (routeStr.endsWith("/intelligence")) {
        setActiveTab("intelligence");
        setSelectedCase(null);
      } else if (routeStr.endsWith("/auditor") || routeStr.endsWith("/trust-passport")) {
        setActiveTab("auditor");
        setSelectedCase(null);
      } else if (routeStr === "/" || routeStr.endsWith("/dashboard") || routeStr === "") {
        setActiveTab("dashboard");
        setSelectedCase(null);
      }
    };

    window.addEventListener("popstate", handleRoute);
    window.addEventListener("hashchange", handleRoute);
    handleRoute(); // Execute on mount

    return () => {
      window.removeEventListener("popstate", handleRoute);
      window.removeEventListener("hashchange", handleRoute);
    };
  }, []);

  // Generate printable/exportable beautiful audit page
  const handlePrintAudit = async () => {
    if (!selectedCase) {
      setToastMessage("Please select a forensic case first to export.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    
    try {
      // Create new PDF document in portrait form
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      const report = selectedCase;
      
      // Color Palette matching design
      const primaryColor = [15, 23, 42]; // Slate-900 (Dark Slate Charcoal)
      const accentColor = report.isManipulated ? [220, 38, 38] : [5, 150, 105]; // Crimson Red vs Emerald Green
      
      // Header banner rectangle
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 26, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text("TRUSTLENS AI - FORENSIC VERDICT CERTIFICATE", 14, 11);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(`VERIFICATION HASH SYSTEM PROOF LEDGER LINK: ${report.trustId}`, 14, 16);
      doc.text(`CRYPTO SEAL ANCHOR ACTIVE ON MAINNET NODE WORKSPACE`, 14, 20);
      
      // Verdict Pill Box on Top-Right of Header
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(142, 6, 54, 14, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("VERDICT VERIFICATION STATUS:", 143, 10);
      doc.setFontSize(9);
      doc.text(report.verdict.toUpperCase(), 143, 15);
      
      let y = 38;
      
      // Section 1: Evidence particulars
      doc.setTextColor(15, 23, 42);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("1. EVIDENCE DESCRIPTION & LEDGER METRICS", 14, y);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y + 2.5, 196, y + 2.5);
      
      y += 10;
      doc.setFontSize(8.5);
      
      const detailsTable = [
        ["Registered Evidence File:", report.fileName],
        ["Decentralized Block Anchor:", `#${report.blockNumber}`],
        ["Cryptographic Registry Handshake Date:", new Date(report.verifiedAt).toUTCString()],
        ["AI Engine Core Orchestrator:", report.engineUsed || "TrustLens AI Forensic Oracle v3.5"],
        ["Calculated System Integrity Score:", report.isManipulated ? `${report.confidenceScore}% probability of manipulation` : "100% pristine signature integrity"]
      ];
      
      const detailsYStart = y;
      detailsTable.forEach(([titleName, valText]) => {
        doc.setFont("Helvetica", "bold");
        doc.text(titleName, 14, y);
        doc.setFont("Helvetica", "normal");
        const splitVal = doc.splitTextToSize(String(valText), 62);
        doc.text(splitVal, 64, y);
        y += Math.max(6.5, splitVal.length * 4.5);
      });
      
      // Add the Small photo of the image in the right side of Section 1!
      const imgWidth = 46;
      const imgHeight = 46;
      const imgX = 148;
      const imgY = detailsYStart - 2;
      
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(248, 250, 252);
      // Outer border box for the image on the right of the details block
      doc.rect(imgX - 1.5, imgY - 1.5, imgWidth + 3, imgHeight + 6, "FD");
      
      const currentImg = report.imageUrl || uploadedImage;
      if (currentImg) {
        try {
          const imgObj = await getPdfImageElement(currentImg);
          if (imgObj) {
            doc.addImage(imgObj, "JPEG", imgX, imgY, imgWidth, imgHeight);
          } else {
            // Schematic Fallback inside right photo box
            doc.setDrawColor(180, 180, 180);
            doc.line(imgX, imgY, imgX + imgWidth, imgY + imgHeight);
            doc.line(imgX, imgY + imgHeight, imgX + imgWidth, imgY);
            doc.setFontSize(6.5);
            doc.setFont("Helvetica", "bold");
            doc.text("[ EVIDENCE CAPTURE SCAN ]", imgX + 5, imgY + (imgHeight / 2));
          }
        } catch (e) {
          console.warn("Failed embedding PDF photo alignment", e);
        }
      } else {
        // Blueprint Mockup fallback schematic
        doc.setDrawColor(180, 180, 180);
        doc.line(imgX, imgY, imgX + imgWidth, imgY + imgHeight);
        doc.line(imgX, imgY + imgHeight, imgX + imgWidth, imgY);
        doc.setFontSize(7);
        doc.setFont("Helvetica", "bold");
        doc.text("EVIDENCE DETECTOR", imgX + 6, imgY + 20);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(5.5);
        doc.text("Authentic Seal Active Node", imgX + 7, imgY + 26);
      }
      
      // Photo footer caption
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text("SPECIMEN REPLICA TARGET", imgX + 6, imgY + imgHeight + 3);

      // Reset text style color
      doc.setTextColor(15, 23, 42);

      // Make sure y is advanced past the image block height or details block height, whichever is larger
      const imageBlockBottomY = imgY + imgHeight + 10;
      y = Math.max(y + 3, imageBlockBottomY);
      
      // Section 2: Physical/EXIF metadata analysis details
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("2. INTEGRATIVE PHYSICAL METADATA & ARTIFACT EXIF DATA", 14, y);
      doc.line(14, y + 2.5, 196, y + 2.5);
      
      y += 10;
      doc.setFontSize(8.5);
      
      const metadataTable = [
        ["Native Asset Core Resolution Dimensions:", report.metadataDetails?.dimensions || "N/A"],
        ["Identified Encoding or Generative Software:", report.metadataDetails?.softwareDetect || "N/A"],
        ["EXIF Metadata Original Timestamp:", report.metadataDetails?.createdDate || "N/A"],
        ["Identified Metadata Clock Anomalies:", report.metadataDetails?.anomaliesDetected || "Negative Indicators. No temporal discrepancies detected."]
      ];
      
      metadataTable.forEach(([titleName, valText]) => {
        doc.setFont("Helvetica", "bold");
        doc.text(titleName, 14, y);
        doc.setFont("Helvetica", "normal");
        const splitVal = doc.splitTextToSize(String(valText), 118);
        doc.text(splitVal, 72, y);
        y += Math.max(6.5, splitVal.length * 4.5);
      });
      
      y += 4;
      
      // Section 3: Chronicles Audit Trail
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("3. CHRONOLOGICALLY RESOLVED Forensic Audit Trail Logs", 14, y);
      doc.line(14, y + 2.5, 196, y + 2.5);
      
      y += 9;
      
      report.forensicAnalysisLog.forEach((logItem, idx) => {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        const bulletStatus = logItem.status === "verified" ? " [VERIFIED COHERENT] " : logItem.status === "warning" ? " [SUSPICIOUS ARTIFACTS] " : " [CRITICAL FAILURE] ";
        doc.text(`${idx + 1}. ${logItem.name.toUpperCase()} - ${bulletStatus}`, 14, y);
        
        y += 4.5;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        const splitDetailsText = doc.splitTextToSize(logItem.details, 172);
        doc.text(splitDetailsText, 18, y);
        y += (splitDetailsText.length * 4.2) + 5;
      });
      
      y += 2;
      
      // Section 4: Threat Intelligence
      if (y > 245) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("4. THREAT INTELLIGENCE & INDUSTRY REPUTATION THRESHOLDS", 14, y);
      doc.line(14, y + 2.5, 196, y + 2.5);
      
      y += 9;
      doc.setFontSize(8.5);
      
      doc.setFont("Helvetica", "bold");
      doc.text("Matched Scam Signature / Blueprint Key:", 14, y);
      doc.setFont("Helvetica", "normal");
      doc.text(report.threatIntelligence.scamMatchSignature || "None (Corresponds to verified clean/organic media template)", 82, y);
      
      y += 6.5;
      
      doc.setFont("Helvetica", "bold");
      doc.text("International Regulatory Audit Reference Path:", 14, y);
      doc.setFont("Helvetica", "normal");
      const splitRegPath = doc.splitTextToSize(report.threatIntelligence.regulatoryAuditTrail || "Regulatory compliance checks cleared.", 108);
      doc.text(splitRegPath, 82, y);
      
      y += Math.max(6.5, splitRegPath.length * 4.5) + 3;

      // Place concentric authenticity seal right here in Section 4/5 background or side
      const sSize = 18;
      const sX = 168;
      const sY = y + 10;
      
      if (y < 235) {
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setLineWidth(1);
        doc.circle(sX, sY, sSize);
        doc.setLineWidth(0.3);
        doc.circle(sX, sY, sSize - 2.5);
        
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(6);
        doc.text("AUTHENTICATION", sX - sSize + 5.5, sY - 2.5);
        doc.setFontSize(5);
        doc.text("TRUSTLENS VERIFIED", sX - sSize + 6, sY + 1.5);
        doc.setFontSize(5.5);
        doc.text(report.isManipulated ? "RED FLAG AUDIT" : "BLOCK SIGNED", sX - sSize + 6.5, sY + 5.5);
        doc.setTextColor(15, 23, 42); // Restore default
      }
      
      // Section 5: Investigator Directive
      y += 24;
      if (y > 235) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("5. COMPLIANCE DIRECTIVES & AUDITOR ACTIONS INDICTMENT", 14, y);
      doc.line(14, y + 2.5, 196, y + 2.5);
      
      y += 9;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      const splitDirectiveText = doc.splitTextToSize(`"${report.investigatorDirective}"`, 178);
      doc.text(splitDirectiveText, 14, y);
      
      y += (splitDirectiveText.length * 4.5) + 12;
      
      // Signature block
      if (y > 255) {
        doc.addPage();
        y = 35;
      }
      
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.line(14, y, 76, y);
      doc.line(134, y, 196, y);
      
      y += 4;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("LEAD FORENSIC INVESTIGATOR SIGNATURE", 14, y);
      doc.text("TRUSTLENS BLOCKCHAIN COMPLIANCE SEAL", 134, y);
      
      y += 3.5;
      doc.setFont("Helvetica", "normal");
      doc.text("Official Platform Handshake Seal Logged", 14, y);
      doc.text("Cryptographic Verification Key: ACTIVE STATUS", 134, y);
      
      // Save report file PDF
      const safeName = report.fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      doc.save(`TrustLens_Forensic_Report_${safeName}.pdf`);
      
      setToastMessage("Success! Highly secure PDF audit report generated and downloaded successfully.");
      setTimeout(() => setToastMessage(""), 5000);
    } catch (err: any) {
      console.error("PDF generation failure: ", err);
      setToastMessage(`PDF Error: ${err.message || String(err)}`);
      setTimeout(() => setToastMessage(""), 5000);
    }
  };

  // Drag and Drop listeners
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        handleVerifyProcess(base64, file.name, "payment");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col justify-between selection:bg-blue-600/10 selection:text-blue-700">
      
      {/* SaaS Elite Header Menu */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-10">
            {/* SaaS Elite Header Branding */}
            <div
              onClick={() => {
                setSelectedCase(null);
                setActiveTab("dashboard");
              }}
              className="flex items-center gap-3 cursor-pointer group select-none py-1"
            >
              {/* Premium Geometric Logo Mark (44px) */}
              <div className="relative w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center shadow-xs border border-slate-800/40 overflow-hidden group-hover:border-slate-700 group-hover:shadow-sm transition-all duration-300">
                {/* Micro tech rings */}
                <div className="absolute inset-[3px] rounded-[9px] border border-dashed border-slate-700/60 opacity-60"></div>
                {/* Glowing aperture iris highlight */}
                <div className="absolute w-6 h-6 rounded-full border border-blue-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                {/* Deep glass reflection */}
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-white/10 to-transparent rounded-full filter blur-[2px]"></div>
                {/* Precision core dot */}
                <span className="absolute top-[8px] right-[8px] w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                {/* Sharp high-contrast letterforms */}
                <div className="relative flex items-center justify-center font-sans font-black text-[13px] tracking-tight text-white select-none">
                  <span>T</span>
                  <span className="text-slate-400 font-medium -ml-[1px]">L</span>
                </div>
              </div>

              {/* Elite Brand Typography */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[19px] font-bold text-slate-900 tracking-tight font-sans">
                    TrustLens
                  </span>
                  <span className="text-[19px] font-extrabold text-blue-600/95 tracking-tight font-sans">
                    AI
                  </span>
                </div>
                <span className="text-[11.5px] font-medium text-slate-400/90 tracking-normal mt-0.5">
                  Verify Before You Trust
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="hidden md:flex gap-1 items-center">
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setActiveTab("dashboard");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === "dashboard" && !selectedCase
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Verify Media
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setActiveTab("auditor");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === "auditor" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Verify Documents
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setActiveTab("intelligence");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === "intelligence" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Blockchain Proof
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setActiveTab("engine");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === "engine" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Detection Engine
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setActiveTab("api");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === "api" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                API Reference
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setActiveTab("cases");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === "cases" || (selectedCase && activeTab === "cases")
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Verification History ({cases.length})
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setActiveTab("profile");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === "profile" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setActiveTab("settings");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === "settings" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-sm border border-slate-200/40 hidden lg:block">
              PLATFORM_STABLE // V2.4
            </span>
            
            {/* Interactive Auth Buttons and Dropdowns corresponding to Phase 2 tests */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer border border-slate-200/50"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                    {userProfile.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-slate-700 hidden sm:inline">{userProfile.name.split(" ")[0]}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-500">arrow_drop_down</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 animate-fade-in font-display">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{userProfile.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{userProfile.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCase(null);
                        setActiveTab("profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-2 hover:text-slate-950 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-400">account_circle</span>
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCase(null);
                        setActiveTab("settings");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-2 hover:text-slate-950 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-400">settings</span>
                      Platform Settings
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCase(null);
                        setActiveTab("cases");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-2 hover:text-slate-950 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-400">history</span>
                      Verification Vault
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsAuthenticated(false);
                        setIsProfileDropdownOpen(false);
                        setActiveTab("login");
                        setToastMessage("Session Terminated. Logged out successfully.");
                        setTimeout(() => setToastMessage(""), 3000);
                      }}
                      className="w-full text-left px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-bold flex items-center gap-2 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCase(null);
                    setActiveTab("login");
                  }}
                  className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => {
                    setSelectedCase(null);
                    setActiveTab("register");
                  }}
                  className="px-3.5 py-1.5 bg-black text-white rounded-lg text-xs font-bold tracking-wider hover:opacity-90 active:scale-98 transition-all cursor-pointer"
                >
                  SIGN UP
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Contents Frame */}
      <main className="flex-1 mt-16 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* ==================== VIEW 1: ACTIVE LOADING SCAN SCREEN (Screen 3) ==================== */}
        {isAnalyzing ? (
          <div className="py-8 sm:py-12 max-w-6xl mx-auto flex flex-col gap-10 animate-fade-in">
            {/* Header section status */}
            <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase font-mono mb-1">
                  SECURE COMPUTATION // TARGET: {uploadedFileName || "payload.zip"}
                </p>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Forensic Analysis in Progress
                </h1>
                <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                  TrustLens AI decentralized clusters are conducting deep structural audits, noise vector checks, EXIF clock timelines validation, and ledger encoding hashes.
                </p>
              </div>

              {/* Ping Active State */}
              <div className="flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200/50 px-4 py-2 rounded-full font-mono text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-ping"></span>
                POLLING CLUSTER ACTIVE... {analysisProgress}%
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Stepper block list */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full pointer-events-none z-0"></div>

                  <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-400 mb-6 flex justify-between items-center relative z-10 font-mono">
                    VERIFICATION SHIELD STACK
                    <span className="text-[8px] bg-slate-900 text-white px-2 py-0.5 rounded uppercase tracking-widest">
                      REALTIME-INTEGRITY
                    </span>
                  </h3>

                  <div className="space-y-6 relative z-10">
                    {scanningSteps.map((step, idx) => {
                      const isActive = idx === currentAnalysisStep;
                      const isComplete = idx < currentAnalysisStep;
                      return (
                        <div key={idx} className="flex gap-4 relative group">
                          {idx < scanningSteps.length - 1 && (
                            <div className={`w-[1px] h-full absolute top-10 left-[19px] ${
                              isComplete ? "bg-slate-900" : "bg-slate-200"
                            }`}></div>
                          )}

                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 z-10 select-none ${
                              isComplete
                                ? "bg-black text-white border-none shadow-xs"
                                : isActive
                                  ? "bg-blue-600 text-white border-none shadow-md shadow-blue-500/20 scale-105 animate-pulse"
                                  : "bg-slate-100 text-slate-400 border border-slate-200"
                            }`}>
                              {isComplete ? (
                                <span className="material-symbols-outlined text-[18px]">done</span>
                              ) : (
                                <span className="material-symbols-outlined text-[18px]">
                                  {idx === 0 ? "document_scanner" : idx === 1 ? "database" : idx === 2 ? "thermostat" : idx === 3 ? "grid_view" : "verified_user"}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 pb-4">
                            <div className="flex justify-between items-start mb-0.5">
                              <h4 className={`text-xs font-bold leading-none uppercase tracking-wide transition-colors duration-200 ${
                                isActive ? "text-slate-900" : isComplete ? "text-slate-700" : "text-slate-400"
                              }`}>
                                {step.title}
                              </h4>
                              {isActive && (
                                <span className="text-[9px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                                  SCANNING...
                                </span>
                              )}
                              {isComplete && (
                                <span className="text-[9px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                  LOCKED
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] mt-1 transition-colors duration-200 ${
                              isActive ? "text-slate-700 font-medium" : "text-slate-400/80"
                            }`}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compute Engine Worker Card (Screen 3 Bottom) */}
                <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-4 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center animate-spin">
                    <span className="material-symbols-outlined text-blue-400 text-[20px]">memory</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-mono text-slate-400 uppercase block tracking-widest">
                      ACTIVE DECENTRALIZED ENGINE
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-100 truncate">
                      node-aws-7721-forensic
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">UTILITY SLATE</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">99.998% SLA</span>
                  </div>
                </div>
              </div>

              {/* Right Side live scanning canvas view (Screen 3 Right) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-slate-950 aspect-[4/3] rounded-2xl relative overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
                  
                  {/* Real-time scan moving bar line */}
                  <div className="scanning-line animate-scan"></div>

                  {/* Simulated radar canvas target */}
                  <div className="absolute w-48 h-48 border border-dashed border-blue-500/10 rounded-full animate-pulse-slow"></div>

                  {/* Blurred image visualization backdrop representing processing */}
                  <div className="absolute inset-6 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 filter blur-md opacity-40">
                    {uploadedImage ? (
                      <img className="w-full h-full object-cover scale-105" src={uploadedImage} alt="Scanning evidence" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-500 text-5xl">document_scanner</span>
                      </div>
                    )}
                  </div>

                  {/* Scanning box floating scopes */}
                  <div className="absolute top-1/4 left-1/4 w-32 h-10 border border-blue-500/50 bg-blue-600/5 rounded p-2 flex flex-col justify-between backdrop-blur-xs select-none">
                    <span className="text-[7px] font-mono font-bold text-blue-400 leading-none">TARGET_SCAN_01</span>
                    <span className="text-[8px] font-mono text-white tracking-widest leading-none truncate font-bold">
                      {liveCoord.label}
                    </span>
                  </div>

                  <div className="absolute bottom-1/3 right-1/4 w-36 h-12 border border-emerald-500/40 bg-emerald-600/5 rounded p-2 flex flex-col justify-between backdrop-blur-xs select-none">
                    <span className="text-[7px] font-mono font-bold text-emerald-400 leading-none">GRID_ALIGNMENT</span>
                    <span className="text-[8px] font-mono text-white tracking-widest font-bold leading-none">
                      X: {liveCoord.x} | Y: {liveCoord.y}
                    </span>
                  </div>

                  {/* Floating Encrypted Stream Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-md">
                      <span className="material-symbols-outlined text-emerald-400 text-xs">lock</span>
                      <span className="text-[8px] text-white tracking-widest uppercase font-mono font-bold">
                        ENCRYPTED STREAM FEED
                      </span>
                    </div>
                  </div>

                  {/* Bottom live metrics card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-ping"></span>
                        <span className="text-[10px] font-bold text-white tracking-wider font-display">
                          LIVE FORENSIC INSTANCE PIPELINE
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400">
                        LATENCY: 145MS
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-l-2 border-blue-500 pl-2">
                        <p className="text-[8px] uppercase text-slate-400">OCR CONFIDENCE</p>
                        <p className="text-xs font-mono font-bold text-slate-100">{analysisProgress > 40 ? "98.2%" : "CALCULATING..."}</p>
                      </div>
                      <div className="border-l-2 border-slate-700 pl-2">
                        <p className="text-[8px] uppercase text-slate-400">PIXEL DENSITY</p>
                        <p className="text-xs font-mono font-bold text-slate-100">300 DPI</p>
                      </div>
                      <div className="border-l-2 border-slate-700 pl-2">
                        <p className="text-[8px] uppercase text-slate-400">LAYERS MAPPED</p>
                        <p className="text-xs font-mono font-bold text-slate-100">12 CORE</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedCase ? (
          
          showPassportView ? (
            /* ==================== VIEW 2: DIGITAL TRUST PASSPORT CARD VIEW (Screen 4) ==================== */
            <div className="py-6">
              <PassportCard
                report={selectedCase}
                onBackToVerdict={() => setShowPassportView(false)}
              />
            </div>
          ) : (
            /* ==================== VIEW 3: FORENSIC VERDICT DETAILED REPORT (Screen 2) ==================== */
            <div className="py-6 sm:py-8 max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in print:mt-0 print:p-0">
              
              {/* Report view breadcrumbs / status header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 print:border-none">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest font-mono text-slate-400 uppercase">
                    <span>INVESTIGATION HUB</span>
                    <span className="material-symbols-outlined text-[10px] text-slate-300">chevron_right</span>
                    <span className="text-slate-900">ID CLASSIFIER: {selectedCase.trustId.substring(0, 12)}</span>
                  </div>
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-none">
                    Forensic Verdict Report
                  </h1>
                  <p className="text-slate-500 text-sm flex flex-wrap items-center gap-2">
                    <span>Verified immutable cryptographic log recorded at {new Date(selectedCase.verifiedAt).toLocaleString()}</span>
                    {selectedCase.engineUsed && (
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                        selectedCase.isSimulated 
                          ? "bg-amber-50 text-amber-700 border border-amber-200/50" 
                          : "bg-blue-50 text-blue-700 border border-blue-250/50"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedCase.isSimulated ? "bg-amber-400" : "bg-blue-500 animate-pulse"}`}></span>
                        Engine: {selectedCase.engineUsed}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-2.5 items-center shrink-0">
                  {/* Status Banner tag */}
                  {selectedCase.isManipulated ? (
                    <div className="bg-red-500 text-white font-mono text-xs font-extrabold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm border border-red-600/10">
                      <span className="material-symbols-outlined material-fill text-[18px]">warning</span>
                      MANIPULATION DETECTED
                    </div>
                  ) : (
                    <div className="bg-emerald-600 text-white font-mono text-xs font-extrabold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined material-fill text-[18px]">verified</span>
                      VERIFIED AUTHENTIC
                    </div>
                  )}
                </div>
              </div>

              {/* Grid 2 column presentation (Evidence file preview and deep audit metrics) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side column: File preview + overlay and Passport seal */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Evidence Viewer Interactive Forensic Sandbox */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm relative overflow-hidden">
                    <InteractiveForensicSandbox report={selectedCase} uploadedImage={uploadedImage} />
                  </div>

                  {/* Blockchain proof passport launcher (Screen 2 Bottom Grid Left) */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex items-center justify-between shadow-xs relative overflow-hidden group">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                        <span className="material-symbols-outlined text-[24px] material-fill">verified_user</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Blockchain Ledger Proof</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Verified on Ethereum Block #{selectedCase.blockNumber}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowPassportView(true)}
                      className="px-4 py-2 bg-slate-955 text-white bg-black hover:opacity-95 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1 group-hover:translate-x-1"
                    >
                      View Passport
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  </div>
                </div>

                {/* Right side column: Audit Assessment Gauge, Logs, Directives */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Confidence Assessment Gauge Gauge (Screen 2 Right Side Top) */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full pointer-events-none z-0"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                      <div className="flex-1">
                        <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-400 font-mono mb-1">
                          TRUST ENGINE CLUSTERS OUTCOME
                        </h3>
                        <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                          Confidence Assessment
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                          Our neural audit engine evaluated ELA characteristics and OCR alignments, concluding a{" "}
                          <span className="font-bold underline underline-offset-4">
                            {selectedCase.isManipulated
                              ? `${selectedCase.confidenceScore}.48% probability of intentional digital forgery`
                              : `${selectedCase.confidenceScore}.98% probability of pristine authentic seal`}
                          </span>{" "}
                          within this asset.
                        </p>
                      </div>

                      {/* Static SVG radial meter */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="relative w-24 h-24 flex items-center justify-center select-none">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              className="text-slate-100"
                              cx="48"
                              cy="48"
                              fill="transparent"
                              r="42"
                              stroke="currentColor"
                              strokeWidth="8"
                            />
                            <circle
                              className={selectedCase.isManipulated ? "text-red-500" : "text-emerald-500"}
                              cx="48"
                              cy="48"
                              fill="transparent"
                              r="42"
                              stroke="currentColor"
                              strokeDasharray="264"
                              strokeDashoffset={264 - (264 * selectedCase.confidenceScore) / 100}
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className={`absolute font-display font-black text-lg ${
                            selectedCase.isManipulated ? "text-red-600" : "text-emerald-600"
                          }`}>
                            {selectedCase.isManipulated ? `${selectedCase.confidenceScore}%` : "100%"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase mt-2">
                          {selectedCase.isManipulated ? "CRITICAL RISK" : "PRISTINE SEAL"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Forensic Logs Grid Cards - Redesigned into 7 Pillars of Authenticity Forensics */}
                  <div className="space-y-4 font-sans">
                    <div className="border-b border-slate-200 pb-2">
                      <h3 className="text-[11px] font-mono font-extrabold tracking-widest text-slate-400 uppercase">
                        7 PILLARS OF DIGITAL AUTHENTICITY FORENSICS
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-relaxed">Comprehensive investigative metrics verifying cryptographic, linguistic, biometric, and structural parameters.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      
                      {/* 1. Confidence Score Explainer */}
                      <div className="bg-white rounded-xl p-4.5 border border-slate-200/70 shadow-xs">
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">PILLAR 1</span>
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase">TRUST VERDICT & CONFIDENCE SCORE</h4>
                          </div>
                          <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full ${
                            selectedCase.isManipulated ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {selectedCase.isManipulated ? "CRITICAL VALUE FLAG" : "PRISTINE INDEX"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Primary neural diagnostics register a confidence level of <strong className="text-slate-900">{selectedCase.confidenceScore}%</strong>. {selectedCase.isManipulated ? "Exhibits substantial statistical probability of local typographic alteration and pixel grid noise table skew." : "Corresponds to a fully unmanipulated high-fidelity verification signature with perfectly uniform sRGB levels."}
                        </p>
                      </div>

                      {/* 2. Metadata Analysis */}
                      <div className="bg-white rounded-xl p-4.5 border border-slate-200/70 shadow-xs">
                        <div className="flex justify-between items-start mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-mono font-bold">PILLAR 2</span>
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase">METADATA PARSING & INTEGRITY</h4>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                            selectedCase.metadataDetails.softwareDetect?.toLowerCase() !== "original camera" && selectedCase.isManipulated 
                              ? "bg-red-50 text-red-600" 
                              : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {selectedCase.metadataDetails.softwareDetect?.toLowerCase() !== "original camera" && selectedCase.isManipulated ? "EDITS FOUND" : "SECURE EXIF"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                          Direct extraction of EXIF structures parses embedded device streams, manufacturing markers, and camera capture coordinates.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-[11px] font-mono border-t border-slate-100 pt-2.5 bg-slate-50 p-2.5 rounded-lg">
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase">SOFTWARE SIGNATURE</span>
                            <span className="text-slate-800 font-bold break-all block mt-0.5">{selectedCase.metadataDetails.softwareDetect || "iPhone Raw Capture Direct"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase">STRIP/MODIFICATION FLAG</span>
                            <span className="text-slate-800 font-bold block mt-0.5">{selectedCase.metadataDetails.anomaliesDetected ? "Traces Found / Software Strip Match" : "None detected // pristine signature"}</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. OCR Consistency */}
                      <div className="bg-white rounded-xl p-4.5 border border-slate-200/70 shadow-xs">
                        <div className="flex justify-between items-start mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono font-bold">PILLAR 3</span>
                            <h4 className="text-xs font-extrabold text-slate-900">OCR RECOGNITION & GLYPH CONSISTENCY</h4>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${selectedCase.isManipulated ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                            {selectedCase.isManipulated ? "GLYPH ALIEN" : "VERIFIED FORMATS"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2.5 leading-relaxed">
                          Checks high-resolution glyph structures, numerical bounding layout grids, and brand typography parameters. Detects mismatch in payment screens (PhonePe/GPay layouts, fonts).
                        </p>
                        <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-emerald-400 leading-normal border border-slate-800">
                          <span className="text-[9px] text-slate-500 uppercase block tracking-wider mb-1 font-sans">Extracted OCR Buffer:</span>
                          "{selectedCase.ocrExtractedText || "NO DETECTED PAYMENT RECORD TEXT"}"
                        </div>
                      </div>

                      {/* 4. Face Manipulation Analysis */}
                      <div className="bg-white rounded-xl p-4.5 border border-slate-200/70 shadow-xs">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono font-bold">PILLAR 4</span>
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase">BIOMETRIC FACE DEEPFAKE FORENSICS</h4>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${selectedCase.primaryClassification.toLowerCase().includes("deepfake") || selectedCase.primaryClassification.toLowerCase().includes("face") || selectedCase.isManipulated ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                            {selectedCase.primaryClassification.toLowerCase().includes("deepfake") || selectedCase.primaryClassification.toLowerCase().includes("face") || selectedCase.isManipulated ? "AI ARTIFACT RISK" : "PASSED BIOMETRICS"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Biometric facial landmark check, earlobe-jaw overlap matrices, iris specular gloss indexes, and skin frequency noise maps flag automated generative/diffusion portraits.
                        </p>
                      </div>

                      {/* 5. Compression Anomaly Detection */}
                      <div className="bg-white rounded-xl p-4.5 border border-slate-200/70 shadow-xs">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-pink-600 bg-pink-50 px-2 py-0.5 rounded font-mono font-bold">PILLAR 5</span>
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase">COMPRESSION & NOISE HYSTERESIS (ELA)</h4>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${selectedCase.isManipulated ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                            {selectedCase.isManipulated ? "LOCAL NOISE DISPARITY" : "UNIFORM ENVELOPE"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Runs Error Level Analysis (ELA) to pinpoint pixel recovery levels. Shows discrepancies in quantization tables, indicating local brush stampings or Adobe Photoshop layer overlays.
                        </p>
                      </div>

                      {/* 6. Timestamp Verification */}
                      <div className="bg-white rounded-xl p-4.5 border border-slate-200/70 shadow-xs">
                        <div className="flex justify-between items-start mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-amber-750 bg-amber-50 px-2 py-0.5 rounded font-mono font-bold">PILLAR 6</span>
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase">CHRONOLOGICAL TIMESTAMP VALIDATION</h4>
                          </div>
                          <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">
                            COHERENT CLOCK
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          Compares capture dates found in the raw image properties block (EXIF Creation Time) with physical database transaction timestamps under strict clock mismatch rules.
                        </p>
                        <div className="flex gap-4 text-[11px] font-mono bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] text-slate-400 block uppercase">CAPTURE EXIF CLOCK</span>
                            <span className="text-slate-800 font-bold truncate block mt-0.5">{new Date(selectedCase.verifiedAt).toISOString()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] text-slate-400 block uppercase">LEDGER DISPATCH CLOCK</span>
                            <span className="text-slate-800 font-bold truncate block mt-0.5">{new Date(selectedCase.verifiedAt).toISOString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* 7. Blockchain Verification Hash */}
                      <div className="bg-slate-950 text-slate-100 rounded-xl p-4.5 border border-slate-800 shadow-sm font-mono text-[11px]">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded font-bold font-mono">PILLAR 7</span>
                            <h4 className="text-xs font-extrabold text-white uppercase font-sans">BLOCKCHAIN IMMUTABLE PROOF</h4>
                          </div>
                          <span className="text-[9px] text-blue-400 font-bold tracking-widest align-middle flex items-center gap-1 uppercase">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></span>
                            Ledger Anchor
                          </span>
                        </div>
                        <div className="space-y-2 leading-relaxed">
                          <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1.5">
                            <span>Verification Hash:</span>
                            <span className="text-slate-200 select-all font-bold text-[10px] sm:text-[11px] truncate tracking-normal max-w-[200px] sm:max-w-none">{selectedCase.trustId}</span>
                          </div>
                          <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1.5">
                            <span>Public On-Chain Index:</span>
                            <span className="text-slate-200 font-bold">Ethereum Mainnet Block #{selectedCase.blockNumber}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-sans mt-2">
                            Secure cryptographic proof is anchored directly on-chain. Any tampering with pixel layers immediately triggers a state misalignment alert, invalidating credentials verification.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Enterprise Threat Investigator Directive (Screen 2 Right Bottom Directive) */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
                    {/* Background seal watermarking */}
                    <span className="material-symbols-outlined absolute right-6 top-6 text-slate-800 opacity-40 text-8xl material-fill pointer-events-none z-0">
                      gavel
                    </span>

                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5 mb-4 border-b border-slate-800 pb-3">
                        <span className="material-symbols-outlined text-blue-400 text-2xl">assignment_turned_in</span>
                        <h3 className="font-display font-extrabold text-sm sm:text-base uppercase tracking-wide">
                          Investigator Directive & Audit Guidelines
                        </h3>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed mb-6">
                        {legalHolds[selectedCase.trustId] ? (
                          <span className="text-emerald-400 font-bold block mb-2 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900/35">
                            🔒 EVIDENCE CASE REGISTERED UNDER ACTIVE AML LEGAL HOLD DIRECTIVE. Transacted escrow amounts frozen. SEC incident logs dispatched under regulatory ledger tag.
                          </span>
                        ) : null}
                        {selectedCase.investigatorDirective}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            setLegalHolds((prev) => ({
                              ...prev,
                              [selectedCase.trustId]: !prev[selectedCase.trustId],
                            }));
                          }}
                          className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm uppercase ${
                            legalHolds[selectedCase.trustId]
                              ? "bg-red-600 text-white hover:bg-red-700 hover:scale-98"
                              : "bg-white text-slate-950 hover:bg-slate-50 hover:scale-98"
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {legalHolds[selectedCase.trustId] ? "lock_open" : "gavel"}
                          </span>
                          {legalHolds[selectedCase.trustId] ? "Release Legal Hold" : "Initiate Legal Hold"}
                        </button>

                        <button
                          onClick={() => {
                            setFalsePositives((prev) => ({
                              ...prev,
                              [selectedCase.trustId]: !prev[selectedCase.trustId],
                            }));
                          }}
                          className="px-5 py-2.5 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg text-xs font-bold tracking-wider transition-all uppercase cursor-pointer"
                        >
                          {falsePositives[selectedCase.trustId] ? "Reset Flag as anomaly" : "Mark False Positive"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Operational compliance benchmarks auditor component inside Report */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs">
                    <h4 className="text-xs font-extrabold text-slate-400 mb-4 tracking-wider uppercase font-mono">
                      Regulatory Compliance Checklist Auditing Criteria
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={complianceChecked.soc2_retention || false}
                          onChange={(e) =>
                            setComplianceChecked((p) => ({ ...p, soc2_retention: e.target.checked }))
                          }
                          className="mt-1 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">SOC2 Integrity Archiving</span>
                          <span className="text-[10px] text-slate-400">Fingerprint matches trust principle criteria</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={complianceChecked.gdpr_consent || false}
                          onChange={(e) =>
                            setComplianceChecked((p) => ({ ...p, gdpr_consent: e.target.checked }))
                          }
                          className="mt-1 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">GDPR Safe Storage Proof</span>
                          <span className="text-[10px] text-slate-400">Cryptographically isolated PII data layers</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={complianceChecked.iso_audit || false}
                          onChange={(e) =>
                            setComplianceChecked((p) => ({ ...p, iso_audit: e.target.checked }))
                          }
                          className="mt-1 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block font-display">ISO 27001 Logging</span>
                          <span className="text-[10px] text-slate-400">Tamper-proof chronological trace</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!(complianceChecked.aml_escrow || (selectedCase && legalHolds[selectedCase.trustId]))}
                          onChange={(e) =>
                            setComplianceChecked((p) => ({ ...p, aml_escrow: e.target.checked }))
                          }
                          className="mt-1 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">AML Direct Escrow Block</span>
                          <span className="text-[10px] text-slate-400">Active anti-money laundering isolation</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action utilities strip (Screen 2 Footer Row) */}
              <div className="bg-white border-t border-slate-200/80 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 relative z-25 print:hidden">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCase(null);
                      setActiveTab("cases");
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Case Directory
                  </button>
                  
                  <button
                    onClick={() => setShowJsonRaw(!showJsonRaw)}
                    className="px-4 py-2 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-lg text-xs font-semibold uppercase tracking-wider border border-slate-200/50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">database</span>
                    {showJsonRaw ? "Hide JSON proof" : "View JSON proof"}
                  </button>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleDownloadCertificate(selectedCase)}
                    className="px-4 py-2.5 bg-emerald-650 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px] material-fill">verified</span>
                    Download Certificate
                  </button>
                  <button
                    onClick={handlePrintAudit}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export PDF Record
                  </button>
                  <button
                    onClick={() => handleCopySecureLink(selectedCase)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                    {copiedLink ? "Link Copied!" : "Share Link"}
                  </button>
                </div>
              </div>

              {/* Collapsible raw JSON cryptographic seal viewer */}
              {showJsonRaw && (
                <div className="bg-slate-900 text-slate-200 font-mono text-xs p-6 rounded-2xl border border-slate-800 shadow-inner max-h-[400px] overflow-y-auto animate-fade-in select-all leading-relaxed">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block border-b border-slate-800 pb-2 mb-4 tracking-widest leading-none">
                    IMMUTABLE CRYPTOGRAPHIC SEAL METADATA RECORD
                  </span>
                  <pre>{JSON.stringify(selectedCase, null, 2)}</pre>
                </div>
              )}
            </div>
          )
        ) : activeTab === "intelligence" ? (
          /* ==================== VIEW 4: BLOCKCHAIN PROOF LEDGER CONTROL CENTER ==================== */
          <div className="py-6 space-y-8 animate-fade-in">
            <div className="max-w-4xl">
              <p className="text-xs sm:text-sm font-extrabold tracking-widest font-mono text-blue-600 uppercase">
                CRYPTOGRAPHIC PUBLIC ANCHOR
              </p>
              <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-slate-900 mt-1.5">
                Blockchain Proof Ledger Explorer
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed font-sans">
                Real-time cryptographic database storing immutable hash anchors, public keys, and OCR text verification histories. Every scan is stamped permanently to prevent payment screenshot double-spending and deepfake reuses.
              </p>
            </div>

            {/* Live ledger stats banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase block tracking-wider font-semibold">Public Ledger Nodes</span>
                <span className="text-2xl font-black text-white mt-1.5 block">14,289 (Global)</span>
                <span className="text-xs font-mono text-emerald-405 block mt-1 font-bold">● SYNCHRONIZED</span>
              </div>
              <div className="sm:border-l border-slate-800 sm:pl-5">
                <span className="text-xs font-mono text-slate-400 uppercase block tracking-wider font-semibold">Gas Fee (Ethereum Mainnet)</span>
                <span className="text-2xl font-black text-white mt-1.5 block">12.5 Gwei</span>
                <span className="text-xs font-mono text-slate-400 block mt-1">Slightly congested</span>
              </div>
              <div className="sm:border-l border-slate-800 sm:pl-5">
                <span className="text-xs font-mono text-slate-400 uppercase block tracking-wider font-semibold">Certified Escrows Wrapped</span>
                <span className="text-xl sm:text-2xl font-black text-white mt-1.5 block">$48,290,140</span>
                <span className="text-xs font-mono text-blue-400 block mt-1 font-bold">Protected Value Index</span>
              </div>
              <div className="sm:border-l border-slate-800 sm:pl-5">
                <span className="text-xs font-mono text-slate-400 uppercase block tracking-wider font-semibold">Block Time Average</span>
                <span className="text-2xl font-black text-white mt-1.5 block font-mono">12.06 Secs</span>
                <span className="text-xs font-mono text-blue-400 block mt-1 font-semibold">Dencun Epoch Active</span>
              </div>
            </div>

            {/* On-chain verified records ledger table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-slate-500 px-1 font-mono">
                  LIVE CRYPTOGRAPHIC LEDGER FEED
                </h3>

                <div className="space-y-4">
                  {ENTERPRISE_ALERTS.map((alert, idx) => (
                    <div
                      key={alert.id}
                      className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between gap-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                          <span className="text-xs font-mono text-blue-700 bg-blue-50/80 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            On-Chain Secure State Anchor #{102840 + idx}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 font-display">
                          {alert.alertType.replace("Mismatched Template", "Layout Verifier stamp").replace("Attack Campaign", "Authenticity Proof Checked")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-mono leading-relaxed">
                          Ledger verification criteria: <span className="text-slate-800 italic font-sans font-medium">"{alert.observedPatterns.replace("manipulation threat", "fine-grain pixel matching").replace("phishing campaign", "payment proof validation")}"</span>
                        </p>
                      </div>

                      <div className="md:text-right flex flex-col justify-between shrink-0">
                        <span className="text-xs font-mono text-slate-400 block uppercase font-bold tracking-wide">
                          Anchor Height: Block #{alert.sourceGeo.charCodeAt(0) * 1000}
                        </span>
                        <span className="text-sm font-extrabold text-slate-800 block mt-1">
                          {alert.affectedVolume.replace("alerts", "valid transactions")} validated
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules and Verification benchmarks checklist */}
              <div className="space-y-4">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-slate-500 px-1 font-mono font-display">
                  Validation Standards Reference
                </h3>

                <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 shadow-sm space-y-5">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-widest block font-mono">
                      LEDGER COMPARATOR ACTIVE
                    </span>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                      All uploaded files are cross-correlated against our machine-readable authenticity guidelines instantly. Here is our baseline checking ruleset:
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-start border-b border-slate-800/60 pb-2.5">
                      <span className="text-slate-300 font-mono font-medium">Rule UPI_LAYOUT_MATCH</span>
                      <span className="text-emerald-400 font-bold uppercase font-mono">Active</span>
                    </div>
                    <div className="flex justify-between items-start border-b border-slate-800/60 pb-2.5">
                      <span className="text-slate-300 font-mono font-medium">Rule sRGB_HISTOGRAM_UNIFORM</span>
                      <span className="text-emerald-400 font-bold uppercase font-mono">Active</span>
                    </div>
                    <div className="flex justify-between items-start border-b border-slate-800/60 pb-2.5">
                      <span className="text-slate-300 font-mono font-medium">Rule EXIF_UTC_DIFF_MAX_120S</span>
                      <span className="text-amber-400 font-bold uppercase font-mono">Active</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-300 font-mono font-medium">Rule BIOMETRIC_GAN_FACE_REJECT</span>
                      <span className="text-emerald-400 font-bold uppercase font-mono">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Card Showcase library (Screen 1 Known Templates) */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-slate-500 px-1 font-mono">
                Standard Authenticity Preset Benchmarks Register
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SEEDED_SCAM_DATABASE.map((scam) => (
                  <div
                    key={scam.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group cursor-pointer"
                    onClick={() => {
                      // Let them select direct simulator payload
                      const codeMapping: Record<string, "payment" | "deepfake" | "document"> = {
                        "SCAM-001": "payment",
                        "SCAM-002": "payment",
                        "SCAM-003": "document",
                        "SCAM-004": "deepfake",
                        "SCAM-005": "payment"
                      };
                      triggerPresetDemo(codeMapping[scam.id] || "payment");
                    }}
                  >
                    <div className="h-44 bg-slate-100 relative overflow-hidden shrink-0">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={scam.exampleImageUrl}
                        alt={scam.title}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-slate-950/95 text-white font-mono text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase">
                          {scam.category.replace("Scam", "Authentic").replace("Threat", "Verification")} Benchmark
                        </span>
                      </div>
                    </div>

                    <div className="p-4.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                          {scam.title.replace("Altered PhonePe", "UPI Payment Screenshot").replace("Face Swap Deepfake", "Face Biometrics Scan").replace("Threat", "Standard")}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono mt-1.5 uppercase font-semibold">BENCHMARK ID: {scam.id}</p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-between items-center text-xs text-slate-650">
                        <span className="bg-slate-100 px-2.5 py-1 rounded font-mono font-bold text-slate-700 text-[11px] uppercase">
                          SEV: {scam.severity}
                        </span>
                        <span className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Launch Test →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === "cases" ? (
          /* ==================== VIEW 5: VERIFICATION HISTORY / HISTORICAL LEDGER ==================== */
          <div className="py-6 space-y-8 animate-fade-in">
            <div className="border-b border-slate-200 pb-5 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <p className="text-[10px] font-extrabold tracking-widest font-mono text-slate-400 uppercase">
                  ENTERPRISE AUDIT RECORD LEDGER
                </p>
                <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 mt-1">
                  Verification History Ledger
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Access immutable cryptographic verification proofs stored inside your browser local database.
                </p>
              </div>

              {/* Reset database button */}
              <button
                onClick={() => {
                  if (confirm("Reset case history to pre-seeded standard logs?")) {
                    setCases(PRESEEDED_REPORTS);
                    localStorage.removeItem("trustlens_cases");
                  }
                }}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-lg text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">rotate_left</span>
                Reset Database
              </button>
            </div>

            {/* List search and Filter pills */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-2">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hash, document tag, classification, verdict..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all shadow-2xs"
                />
              </div>

              {/* Dynamic Verdict filter pills corresponding directly to user button requests */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-lg border border-slate-200/50">
                <button
                  onClick={() => setCaseVerdictFilter("all")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase transition-all ${
                    caseVerdictFilter === "all"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All Cases ({cases.length})
                </button>
                <button
                  onClick={() => setCaseVerdictFilter("tampered")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase transition-all ${
                    caseVerdictFilter === "tampered"
                      ? "bg-white text-red-650 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Tampered ({cases.filter(c => c.isManipulated).length})
                </button>
                <button
                  onClick={() => setCaseVerdictFilter("authentic")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase transition-all ${
                    caseVerdictFilter === "authentic"
                      ? "bg-white text-emerald-650 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Authentic ({cases.filter(c => !c.isManipulated).length})
                </button>
              </div>
            </div>

            {/* Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases
                .filter((c) => {
                  if (caseVerdictFilter === "tampered") return c.isManipulated;
                  if (caseVerdictFilter === "authentic") return !c.isManipulated;
                  return true;
                })
                .filter((c) => {
                  const s = searchQuery.toLowerCase();
                  return (
                    c.fileName.toLowerCase().includes(s) ||
                    c.verdict.toLowerCase().includes(s) ||
                    c.primaryClassification.toLowerCase().includes(s) ||
                    c.trustId.toLowerCase().includes(s)
                  );
                })
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedCase(item)}
                    className="bg-white border border-slate-200/60 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-350 hover:scale-[1.005] duration-200 transition-all cursor-pointer flex flex-col justify-between group h-fit"
                  >
                    <div className="p-5 space-y-4">
                      {/* Top bar status alert with Authenticity Scores */}
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          #{item.blockNumber}
                        </span>

                        {item.isManipulated ? (
                          <span className="bg-red-50/80 text-red-700 border border-red-100/60 font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                            Risk (Authenticity: {Math.max(4, 100 - item.confidenceScore)}%)
                          </span>
                        ) : (
                          <span className="bg-emerald-50/85 text-emerald-800 border border-emerald-100/60 font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                            SECURE (Authenticity: {item.confidenceScore}%)
                          </span>
                        )}
                      </div>

                      {/* Info body */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display truncate">
                          {item.fileName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5 leading-none">
                          {item.primaryClassification}
                        </span>
                      </div>

                      {/* Directives snippet */}
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.investigatorDirective}
                      </p>
                    </div>

                    {/* Footer case card metadata */}
                    <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-between items-center text-[10px] text-slate-400 font-mono shrink-0">
                      <span>{new Date(item.verifiedAt).toLocaleDateString()}</span>
                      <span className="text-slate-600 font-semibold group-hover:text-blue-600 transition-colors flex items-center gap-0.5">
                        Audit Report <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : activeTab === "auditor" ? (
          /* ==================== VIEW 6: REGULATORY & DOCUMENT VERIFICATION PANEL ==================== */
          <div className="py-6 space-y-8 animate-fade-in font-sans">
            <div className="max-w-4xl border-b border-slate-200 pb-5">
              <p className="text-[10px] font-extrabold tracking-widest font-mono text-emerald-600 uppercase">
                CREDENTIALS & DOCUMENTS CENTER
              </p>
              <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 mt-1">
                Verify Documents & Certificates
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
                Inspect academic certificates, contracts, ISO certificates, and invoices. Checks document metadata consistency, sRGB seal alignments, embedded font matrices, and anchors verification records securely on public blockchains.
              </p>
            </div>

            {/* Static Document statistics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">CRYPTO DIGITAL SIGNATURES</span>
                  <p className="font-display font-black text-2xl text-slate-900 mt-2">100% Verified</p>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded mt-4">
                  Verified Meta Signatures
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">METADATA AUDIT SECURE</span>
                  <p className="font-display font-black text-2xl text-slate-900 mt-2">Pristine EXIF</p>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded mt-4">
                  Zero resave compression anomalies
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">SEALS & WATERMARKS</span>
                  <p className="font-display font-black text-2xl text-slate-900 mt-2">Passed check</p>
                </div>
                <div className="text-[10px] text-slate-600 font-medium bg-slate-100 p-1.5 rounded mt-4">
                  Alpha channel transparency uniform
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">VERIFY LATENCY WAVE</span>
                  <p className="font-display font-black text-2xl text-slate-900 mt-2">0.48s Scan</p>
                </div>
                <div className="text-[10px] text-blue-700 font-bold bg-blue-50 p-1.5 rounded mt-4">
                  Lightning fast on-ledger anchor
                </div>
              </div>
            </div>

            {/* Interactive Document verify ledger explorer */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs max-w-3xl">
              <h3 className="text-sm font-bold text-slate-900 font-display mb-1.5">
                On-Ledger Document Verification Matrix
              </h3>
              <p className="text-slate-500 text-xs mb-6">
                Below is the list of corporate PDF and image certificates verified through our decentralized root network check. Export verifiable certificates instantly.
              </p>

              <div className="space-y-4">
                {cases.map((cs) => (
                  <div
                    key={cs.trustId}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider block w-fit mb-1">
                        ETH BLOCK #{cs.blockNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900 block truncate font-display">
                        Certificate: {cs.fileName}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block truncate mt-0.5">
                        SHA256 Hash ID: {cs.trustId}
                      </span>
                    </div>

                    <div className="text-right shrink-0 flex flex-col sm:items-end gap-1.5">
                      <span className="text-[9px] font-mono text-slate-400 block">VERIFIED DATE</span>
                      <span className="text-[10px] font-mono text-slate-700 block">
                        {new Date(cs.verifiedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCase(cs);
                          setShowPassportView(false);
                        }}
                        className="px-3 py-1 bg-black text-white hover:opacity-90 rounded text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-all"
                      >
                        Inspect Audit Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === "profile" ? (
          /* ==================== SCREEN: USER PROFILE ==================== */
          <div className="py-6 max-w-4xl mx-auto space-y-8 animate-fade-in font-display">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-[10px] font-extrabold tracking-widest font-mono text-blue-600 uppercase">
                TRUSTLENS AUTHENTICITY CERTIFICATE
              </p>
              <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 mt-1">
                Forensic Investigator Profile
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Review your designated compliance credentials, clearance logs, and operational telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Profile Card Left Side */}
              <div className="md:col-span-4 bg-white border border-slate-200/60 p-6 rounded-2xl shadow-xs text-center">
                <div className="w-24 h-24 rounded-full bg-slate-900 text-white font-mono font-black text-3xl flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-inner">
                  {userProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-md font-bold text-slate-900 font-display">{userProfile.name}</h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">{userProfile.role}</p>
                
                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-around text-center">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">CASES LABELED</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">{cases.length + 4}</span>
                  </div>
                  <div className="border-r border-slate-100"></div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">SECURE INDEX</span>
                    <span className="text-lg font-black text-emerald-600 mt-0.5 block">TIER 1</span>
                  </div>
                </div>
              </div>

              {/* Profile Fields Editor Right Side */}
              <div className="md:col-span-8 bg-white border border-slate-200/60 p-6 rounded-2xl shadow-xs">
                <h4 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase font-mono mb-4">
                  Account Particulars & Custom Clearance
                </h4>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setToastMessage("Investigator profile updated successfully.");
                  setTimeout(() => setToastMessage(""), 4000);
                }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
                        Investigator Name
                      </label>
                      <input
                        type="text"
                        value={userProfile.name || ""}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
                        Secure Email address
                      </label>
                      <input
                        type="email"
                        value={userProfile.email || ""}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
                        Official Designation
                      </label>
                      <input
                        type="text"
                        value={userProfile.role || ""}
                        onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
                        Security Clearance
                      </label>
                      <input
                        type="text"
                        disabled
                        value={userProfile.clearance || ""}
                        className="w-full bg-slate-100 text-slate-500 border border-slate-200 rounded-lg px-3.5 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="mfaCheckbox"
                        checked={userProfile.mfaEnabled || false}
                        onChange={(e) => setUserProfile({ ...userProfile, mfaEnabled: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <label htmlFor="mfaCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Enforce YubiKey MFA validation on login
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-black text-white rounded-lg text-xs font-semibold tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-xs"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : activeTab === "settings" ? (
          /* ==================== SCREEN: SYSTEM SETTINGS ==================== */
          <div className="py-6 max-w-3xl mx-auto space-y-8 animate-fade-in font-display">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-[10px] font-extrabold tracking-widest font-mono text-emerald-600 uppercase">
                SAAS MANAGEMENT INTERACTION
              </p>
              <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 mt-1">
                Platform Configurations
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Customize threshold models, automated blockchain registers, and multi-modal neural settings.
              </p>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h4 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase font-mono mb-4 block">
                  Neural Model & API Tuning
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">
                      DEFAULT ORACLE ENDPOINT ENGINE
                    </label>
                    <select
                      value={platformSettings.selectedEngineModel}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, selectedEngineModel: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none font-semibold text-slate-800"
                    >
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro Neural (Analytical Deep Forensic Core)</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash Oracle (Sub-second Verification Core)</option>
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash Super-Resolution (Default Stable Core)</option>
                    </select>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                      The selected model governs structural verification queries. API requests proxy through active secure nodes to protect corporate private keys.
                    </span>
                  </div>

                  <div className="border-t border-slate-100 my-4"></div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                      Automated Pipeline Rules
                    </h5>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={platformSettings.autoBlockchainAnchor || false}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, autoBlockchainAnchor: e.target.checked })}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">Automatic Decentralized Registration</span>
                          <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">
                            Auto-register cryptographic SHA256 hashes of Tamper-free artifacts directly onto active Ethereum validator loops.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={platformSettings.strictExifValidate || false}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, strictExifValidate: e.target.checked })}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">Deep Clock Metadata Verification</span>
                          <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">
                            Fail artifacts immediately if camera EXIF timeline timestamps lag behind file modification timestamps by more than 120s.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={platformSettings.realtimeAlertNotifications || false}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, realtimeAlertNotifications: e.target.checked })}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">Sync Enterprise Alert Telemetry</span>
                          <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">
                            Disseminate detected payment screenshot fraud indicators to national database and local compliance partners.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 flex justify-end">
                <button
                  onClick={() => {
                    setToastMessage("Platform configurations successfully applied under SOC2 guidelines.");
                    setTimeout(() => setToastMessage(""), 4000);
                  }}
                  className="px-5 py-2.5 bg-black text-white hover:opacity-90 active:scale-98 transition-all rounded-lg text-xs font-bold tracking-wider uppercase cursor-pointer shadow-xs"
                >
                  Save configuration settings
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === "engine" ? (
          /* ==================== SCREEN: DETECTION ENGINE ==================== */
          <DetectionEngineView />
        ) : activeTab === "api" ? (
          /* ==================== SCREEN: API REFERENCE ==================== */
          <ApiDocumentationView />
        ) : activeTab === "login" || activeTab === "register" ? (
          /* ==================== SCREEN: AUTHENTICATION FLOWS ==================== */
          <div className="py-12 max-w-md mx-auto animate-fade-in font-display">
            <div className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-lg space-y-6">
              
              <div className="text-center space-y-1">
                <div className="relative w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center shadow-xs border border-slate-800/40 overflow-hidden mx-auto mb-3">
                  {/* Micro tech rings */}
                  <div className="absolute inset-[3px] rounded-[9px] border border-dashed border-slate-700/60 opacity-60"></div>
                  {/* Glowing aperture iris highlight */}
                  <div className="absolute w-6 h-6 rounded-full border border-blue-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  {/* Deep glass reflection */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-white/10 to-transparent rounded-full filter blur-[2px]"></div>
                  {/* Precision core dot */}
                  <span className="absolute top-[8px] right-[8px] w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                  {/* Sharp high-contrast letterforms */}
                  <div className="relative flex items-center justify-center font-sans font-black text-[14px] tracking-tight text-white select-none">
                    <span>T</span>
                    <span className="text-slate-400 font-medium -ml-[1px]">L</span>
                  </div>
                </div>
                <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                  {activeTab === "login" ? "Investigator Portal" : "Join TrustLens AI"}
                </h2>
                <p className="text-xs text-slate-400">
                  {activeTab === "login" 
                    ? "Verify before you trust. Enter credentials." 
                    : "Secure a compliance registry account."}
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                setIsAuthenticated(true);
                setUserProfile({
                  ...userProfile,
                  name: authName.trim() || userProfile.name,
                  email: authEmail.trim() || userProfile.email,
                });
                setActiveTab("dashboard");
                setToastMessage(`Welcome back, ${authName.trim().split(" ")[0]}! Dual security handshake success.`);
                setTimeout(() => setToastMessage(""), 5000);
              }} className="space-y-4">
                {activeTab === "register" && (
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={authName || ""}
                      onChange={(e) => setAuthName(e.target.value)}
                      required
                      placeholder="Alex Compliance Manager"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                )}
                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                    Secure Corporate Email Address
                  </label>
                  <input
                    type="email"
                    value={authEmail || ""}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    placeholder="name@corporation.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                    Passphrase Credentials
                  </label>
                  <input
                    type="password"
                    value={authPassword || ""}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    placeholder="Enter passphrase secure token"
                    className="w-full bg-slate-50 border border-slate-250 border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-black text-white hover:opacity-95 font-bold rounded-lg text-xs tracking-wider transition-all cursor-pointer shadow-xs uppercase"
                >
                  {activeTab === "login" ? "Verify Security Handshake" : "Create Security Credentials"}
                </button>
              </form>

              <div className="text-center">
                {activeTab === "login" ? (
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-[10px] font-semibold text-slate-500 hover:text-slate-950 transition-colors uppercase font-mono tracking-wider"
                  >
                    Don't have credentials? Sign up here →
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-[10px] font-semibold text-slate-500 hover:text-slate-950 transition-colors uppercase font-mono tracking-wider"
                  >
                    Already have credentials? Portal sign in →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ==================== VIEW 7: PRIMARY LANDING / INTERACTIVE SCAN DESK (Screen 1) ==================== */
          <div className="py-6 sm:py-12 max-w-5xl mx-auto flex flex-col gap-16 animate-fade-in">
            {/* Hero pitch centered */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 border border-blue-200/40 text-blue-800 rounded-full text-xs font-bold font-mono tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse"></span>
                ACTIVE FORENSIC ENGINE // VER V2.4 ACTIVE
              </div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-none max-w-4xl mx-auto">
                Verify Before You Trust
              </h1>
              <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Upload raw screenshots, payment vouchers, face biometric portrait captures, or academic certificates to reveal ELA pixel tampering and EXIF clock timeline anomalies instantly.
              </p>
            </div>

            {/* Live Verification Statistics & Trust Score Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto w-full font-sans">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">Global Trust Index</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display font-black text-3xl text-slate-900">94.8%</span>
                    <span className="text-xs font-mono text-emerald-650 font-bold">▲ Stable</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium bg-slate-50 p-2 rounded-lg mt-4 border border-slate-100 font-mono">
                  Aggregated from 14.8M on-chain state anchors.
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">Total Media Scans</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display font-black text-3xl text-slate-900">2,481,289</span>
                    <span className="text-xs font-mono text-blue-650 font-bold">+18.4%</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium bg-slate-50 p-2 rounded-lg mt-4 border border-slate-100 font-mono">
                  Double WoW growth index vector.
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-red-500 uppercase tracking-widest font-bold">Forgeries Flagged</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display font-black text-3xl text-red-600">14,103</span>
                    <span className="text-[10px] font-mono text-red-600 font-semibold bg-red-50 px-1 rounded">Alert</span>
                  </div>
                </div>
                <div className="text-[10px] text-red-700 font-bold bg-red-50/50 p-2 rounded-lg mt-4 border border-red-100 font-mono">
                  GPay edits: 4.8k | GAN: 3.1k
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-emerald-600 uppercase tracking-widest font-bold">Decentralized Proofs</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display font-black text-3xl text-slate-900">128,409</span>
                    <span className="text-xs font-mono text-emerald-650 font-bold">Synced</span>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50/50 p-2 rounded-lg mt-4 border border-emerald-100 font-mono">
                  Public ledger state synced.
                </div>
              </div>
            </div>

            {/* Central Drag and Drop Scan Dropzone Component */}
            <div className="max-w-4xl mx-auto w-full space-y-6">
              
              {/* Selective uploading type banner */}
              <div className="flex justify-center gap-2 border-b border-slate-200/60 pb-3">
                <button
                  onClick={() => setUploadFileType("payment")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors uppercase ${
                    uploadFileType === "payment" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-950"
                  }`}
                >
                  Payment Screenshot
                </button>
                <button
                  onClick={() => setUploadFileType("deepfake")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors uppercase ${
                    uploadFileType === "deepfake" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-950"
                  }`}
                >
                  Biometric Face
                </button>
                <button
                  onClick={() => setUploadFileType("document")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors uppercase ${
                    uploadFileType === "document" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-950"
                  }`}
                >
                  PDF Certificate
                </button>
              </div>

              {/* Drag Drop container board */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group select-none ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/10 scale-[1.005]"
                    : "border-slate-300/80 bg-white/70 hover:border-slate-800/60 hover:bg-white"
                }`}
              >
                <input
                  type="file"
                  id="dropzone-file-input"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <label htmlFor="dropzone-file-input" className="cursor-pointer flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-[32px] material-fill">document_scanner</span>
                  </div>
                  
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight mb-2">
                    Scan Document & Artifacts
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
                    Drag and drop your file directly here, or <span className="text-slate-900 font-bold group-hover:underline underline-offset-4">browse corporate files</span>
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 relative z-10 shrink-0">
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 rounded-full border border-slate-200/50 text-[11px] font-medium text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">payments</span>
                      PhonePe / GPay screenshots
                    </div>
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 rounded-full border border-slate-200/50 text-[11px] font-medium text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                      Legal PDFs & Contracts
                    </div>
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 rounded-full border border-slate-200/50 text-[11px] font-medium text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">card_membership</span>
                      Verifiable Seals & Certs
                    </div>
                  </div>
                </label>
              </div>

              {/* Prestigious simulator test bench deck for quick reviewer showcase */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                  <span className="material-symbols-outlined text-emerald-400 text-sm pulsing-dot">shield</span>
                  <span className="text-xs font-bold uppercase tracking-widest font-mono">
                    Audit Simulator Quick-Launcher Test Bench
                  </span>
                </div>

                <p className="text-slate-400 text-xs mb-6">
                  Experience full start-to-finish verification sequences immediately by launching presets representing common corporate threat patterns. Excellent for verification compliance reviews.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => triggerPresetDemo("payment")}
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-left cursor-pointer transition-all duration-200 group"
                  >
                    <span className="text-[9px] font-mono text-red-400 uppercase font-bold tracking-widest leading-none block mb-1">
                      CRITICAL RISK CAMPAIGN
                    </span>
                    <h5 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      Altered UPI Payment Screenshot
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1">PhonePe font & layout audit</p>
                  </button>

                  <button
                    onClick={() => triggerPresetDemo("deepfake")}
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-left cursor-pointer transition-all duration-200 group"
                  >
                    <span className="text-[9px] font-mono text-red-400 uppercase font-bold tracking-widest leading-none block mb-1">
                      BIOMETRIC SPOOF ATTACK
                    </span>
                    <h5 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      Biometric Splicing AI Portrait
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1">Pupil & edge alignment audit</p>
                  </button>

                  <button
                    onClick={() => triggerPresetDemo("document")}
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-left cursor-pointer transition-all duration-200 group"
                  >
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-widest leading-none block mb-1">
                      PRISTINE DIGITAL SEAL
                    </span>
                    <h5 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      verifiable academic certificate PDF
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1">Cryptographic key certificate check</p>
                  </button>
                </div>
              </div>

              {/* Trusted corporate placeholders log strip */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 pt-6 select-none opacity-40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-extrabold pb-1">
                  Trusted by compliance authorities
                </span>
                <div className="flex gap-8 items-center h-5">
                  <span className="font-display font-extrabold text-sm tracking-tighter uppercase text-slate-500">
                    Stripe Core Audits
                  </span>
                  <span className="font-display font-extrabold text-sm tracking-tighter uppercase text-slate-500">
                    Linear Inc. Trace
                  </span>
                  <span className="font-display font-extrabold text-sm tracking-tighter uppercase text-slate-500">
                    Perplexity AI Verifier
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Capabilities grid showcase (Screen 1 capabilities) */}
            <div className="space-y-6 pt-10">
              <div className="max-w-2xl">
                <span className="text-[10px] font-mono text-blue-600 font-extrabold uppercase tracking-widest block mb-1">
                  TECHNICAL SPECS
                </span>
                <h2 className="font-display font-black text-2xl tracking-tight text-slate-900 leading-none">
                  Forensic-Grade Pixel Architecture analysis
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Our systems carry out full metadata parsing, multi-layered error level analysis (ELA), font comparison mappings, and blockchain hash indexes instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-xs transition-shadow hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
                    <span className="material-symbols-outlined text-[20px] material-fill">face_retouching_off</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">
                    Deepfake Biometric Audit
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Multi-layered neural models capture GAN face swap artifacts, biometric edge color bleeding, and iris pupil reflection anomalies.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-xs transition-shadow hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                    <span className="material-symbols-outlined text-[20px] material-fill">image_search</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">
                    Image Error Level Analysis (ELA)
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Expose local background patching, content-aware cover-ups, and stamp cloning tools via digital noise compression table checking.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-xs transition-shadow hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-slate-905 bg-slate-100 text-slate-800 flex items-center justify-center mb-5 border border-slate-200">
                    <span className="material-symbols-outlined text-[20px] material-fill">token</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">
                    On-chain Immutable Proofs
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Write verified structural hashes to immutable decentralized blockchain records instantly, producing certifiable Digital Trust Passports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Platform premium clean SaaS Footer */}
      <footer className="bg-slate-900 text-white w-full py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-850 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start space-y-1">
            <span className="font-display font-extrabold text-sm tracking-wide">TrustLens AI</span>
            <p className="text-[10px] font-mono text-slate-400">
              © 2026 TrustLens International security Corporation. Forensic Precision Secured globally.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-mono tracking-wider uppercase text-slate-400">
            <a href="#dashboard" onClick={(e) => { e.preventDefault(); setSelectedCase(null); setActiveTab("dashboard"); }} className="hover:text-white transition-colors">
              MEDIA SCANNER
            </a>
            <a href="#cases" onClick={(e) => { e.preventDefault(); setSelectedCase(null); setActiveTab("cases"); }} className="hover:text-white transition-colors">
              VERIFICATION HISTORY
            </a>
            <a href="#intel" onClick={(e) => { e.preventDefault(); setSelectedCase(null); setActiveTab("intelligence"); }} className="hover:text-white transition-colors">
              BLOCKCHAIN PROOF LEDGER
            </a>
            <a href="#auditor" onClick={(e) => { e.preventDefault(); setSelectedCase(null); setActiveTab("auditor"); }} className="hover:text-white transition-colors block">
              DOCUMENT AUDIT MATRIX
            </a>
          </div>

          <div className="flex gap-4">
            <button className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">hub</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">public</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Absolute Dynamic Toast Notification Popup */}
      {toastMessage && (
        <div id="trustlens-dynamic-toast" className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce duration-300">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</div>
          <p className="text-xs font-semibold tracking-wide font-sans">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
