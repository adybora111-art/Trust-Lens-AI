import { ScamTemplate, ThreatAlert, ForensicReport } from "./types";

export const SEEDED_SCAM_DATABASE: ScamTemplate[] = [
  {
    id: "SCAM-001",
    title: "Fake PhonePe APK Modifier V2.1",
    category: "Payment",
    frequency: "High",
    targetBrands: ["PhonePe", "UPI"],
    identifyingStamps: [
      "Helvetica anti-aliasing thickness disparity in numeric font",
      "Slightly smaller green success circle (32px instead of 36px)",
      "Misaligned line feed on transactional date timestamp metadata"
    ],
    severity: "Critical",
    exampleImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "SCAM-002",
    title: "Google Pay Voucher Font Spoofing",
    category: "Payment",
    frequency: "High",
    targetBrands: ["Google Pay", "GPAY"],
    identifyingStamps: [
      "Custom condensed robot-mono font patching on transfer text",
      "Gradient background color profile mismatch in sRGB registers"
    ],
    severity: "Critical",
    exampleImageUrl: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "SCAM-003",
    title: "Altered University PDF Seal Generator",
    category: "Document",
    frequency: "Medium",
    targetBrands: ["Academic Registries", "National Certificates"],
    identifyingStamps: [
      "Content-Aware stamp replication over physical certificate stamp borders",
      "Acrobat metadata has been re-distilled 3 times consecutively"
    ],
    severity: "Warning",
    exampleImageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "SCAM-004",
    title: "GAN face-swap Deepfake Injection",
    category: "Biometric",
    frequency: "Medium",
    targetBrands: ["HR Onboarding Systems", "Identity Verification Apps"],
    identifyingStamps: [
      "Pixel edge color bleed at collar-neck boundary vector [x: 450, y: 320]",
      "Inconsistent iris pupil roundness and specular reflections under 4K"
    ],
    severity: "Critical",
    exampleImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  }
];

export const ENTERPRISE_ALERTS: ThreatAlert[] = [
  {
    id: "TR-202",
    alertType: "Automated UPI Amount Spoofing Campaign",
    sourceGeo: "Southeast Asia IP Block",
    affectedVolume: "14,821 attempts logged",
    impactLevel: "Critical",
    observedPatterns: "Font-mismatched PhonePe success screenshot uploads to online merchant checkouts"
  },
  {
    id: "TR-203",
    alertType: "Forged ISO PDF Certificates Campaign",
    sourceGeo: "Eastern Europe proxy nodes",
    affectedVolume: "2,410 attempts logged",
    impactLevel: "High",
    observedPatterns: "Adobe InDesign re-saved layers overriding issued signature certificates"
  },
  {
    id: "TR-204",
    alertType: "Facial GAN liveness bypasses",
    sourceGeo: "VPS Cloud provider ranges",
    affectedVolume: "512 verified injects",
    impactLevel: "Medium",
    observedPatterns: "Face-swap overrides in automated challenger bank KYC flows"
  }
];

export const PRESEEDED_REPORTS: ForensicReport[] = [
  {
    trustId: "0x3F2B6A29C548E192A048123B7C2901AF98C24D10",
    blockNumber: 18442109,
    fileName: "PhonePe_Receipt_INR_150000.jpg",
    verifiedAt: "2026-06-09T02:14:10Z",
    isManipulated: true,
    confidenceScore: 98,
    verdict: "MANIPULATION DETECTED",
    primaryClassification: "PhonePe UPI Screenshot Forgery",
    ocrExtractedText: "PhonePe Transaction. Transfer to: merchant_id_2910. Amount: ₹1,50,000. State Bank of India. Ref: 319204918231. Date: 09 June 2026.",
    metadataDetails: {
      dimensions: "1080 x 2400",
      softwareDetect: "Mobile Photoshop Express Filter",
      createdDate: "2026-06-09T02:10:00Z",
      anomaliesDetected: "EXIF timeline mismatch: modification occurred before theoretical delivery confirmation."
    },
    forensicAnalysisLog: [
      {
        name: "Font Edge Anti-Aliasing",
        status: "critical",
        details: "Text zone around '₹1,50,000' shows pixel degradation contrast maps atypical of native PhonePe rendering engines."
      },
      {
        name: "JPEG Block compression ELA",
        status: "critical",
        details: "Substantial error rate spikes around transaction figures indicating manual background overlay painting."
      },
      {
        name: "Security Signature Seal Verification",
        status: "warning",
        details: "Cryptographic merchant signature does not correlate with baseline verified ledger public keys."
      },
      {
        name: "Hardware Fingerprint Audit",
        status: "verified",
        details: "Matched native device compression tables. Original camera source was a real smartphone model."
      }
    ],
    investigatorDirective: "IMMEDIATE COMPLIANCE NOTICE: Flagged UPI Transaction amount tampering. Retain this evidence case under corporate anti-money laundering legal hold (SOC2 Reference AML-884). Reject automated merchant verification and query banking partner.",
    threatIntelligence: {
      scamMatchSignature: "UPI_FRAUD_TEMPLATE_V4 (Font mismatch / Misaligned circles)",
      regulatoryAuditTrail: "SOC2 Compliance Tracking Activated. Registered under regulatory directive ISO-9018. Dispatched cryptographic hash to public audit rails.",
      mitigationSteps: [
        "Initiate legal hold on this evidence payload",
        "Block user account with associated merchant credential",
        "Synchronize anomaly signature with national fraud trends"
      ]
    },
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=500"
  },
  {
    trustId: "0x7F2B4A1944829102485572910M2405149CFF92182",
    blockNumber: 18442312,
    fileName: "Portrait_ExecutiveVerification.png",
    verifiedAt: "2026-06-08T14:22:15Z",
    isManipulated: false,
    confidenceScore: 99,
    verdict: "VERIFIED AUTHENTIC",
    primaryClassification: "Identity Document Face Portrait",
    ocrExtractedText: "VERIFICATION PASSED. TIER 1 SECURE IDENTITY AUDIT STAMP.",
    metadataDetails: {
      dimensions: "1200 x 1500",
      softwareDetect: "Apple Mobile Camera Native EXIF",
      createdDate: "2026-06-08T14:20:00Z",
      anomaliesDetected: "No anomalies found. Signature block fully pristine."
    },
    forensicAnalysisLog: [
      {
        name: "Face Mesh Landmark Validation",
        status: "verified",
        details: "Human geometric symmetry conforms precisely to live biological metrics. Eye depth and structural alignment verified."
      },
      {
        name: "Pixilation Frequency Consistency",
        status: "verified",
        details: "Camera optical sensor noise conforms perfectly across face boundaries. No clone brush elements or mask-splicing detected."
      },
      {
        name: "Color Registration Integrity",
        status: "verified",
        details: "Natural specular reflections in eyes and consistent background lighting profile."
      }
    ],
    investigatorDirective: "PRISTINE IDENTIFICATION: The biometric and document characteristics represent an authentic capture. No post-compilation tampering or AI overlays detected. Permitted for system credentials integration.",
    threatIntelligence: {
      scamMatchSignature: "No matched fraud patterns from Known Scam database. Signal integrity represents 100% authenticity.",
      regulatoryAuditTrail: "Fully compliant with EU-GDPR Proof of Identity storage rules and SOC2 digital KYC traceability guidelines.",
      mitigationSteps: [
        "Issue Digital Trust Passport",
        "Enable onboarding activation",
        "Record encrypted cryptographic footprint on mainnet ledger"
      ]
    },
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500"
  }
];
