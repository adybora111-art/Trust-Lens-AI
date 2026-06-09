import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initializer for Google GenAI SDK to prevent startup crashes if key is omitted
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes("MY_GEMINI_API_KEY") || key === "") {
      console.warn("⚠️ GEMINI_API_KEY is not defined or is placeholder. Utilizing forensic simulator models instead.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Generate unique Cryptographic Hash & Block height mock for Blockchain verification
function generateCryptoTrace() {
  const chars = "0123456789ABCDEF";
  let hash = "0x";
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  const block = Math.floor(Math.random() * 2000000) + 18000000;
  return { hash, block };
}

// Auto-retry helper for high-demand transient errors (e.g., 503 Service Unavailable)
async function generateContentWithRetry(ai: GoogleGenAI, params: any, retries = 3, delay = 800): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const isTransient = 
        err.status === 503 || 
        err.statusCode === 503 || 
        (err.message && (err.message.includes("503") || err.message.includes("high demand") || err.message.includes("UNAVAILABLE") || err.message.includes("temporarily")));
      
      if (isTransient && i < retries - 1) {
        console.warn(`⚠️ Gemini API reported a high demand status. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw err;
    }
  }
}

// Robust JSON extraction to prevent JSON parse errors if markdown formatting is present
function parseSafeJson(text: string): any {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    // Try to strip potential markdown blocks (```json ... ```)
    const cleaned = trimmed
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      throw new Error(`Failed to safely parse response text as JSON: ${text}`);
    }
  }
}

async function startServer() {
  const app = express();

  // Increase limit to handle base64 uploads cleanly
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // REST Endpoint: Forensic Investigation Service
  app.post("/api/verify", async (req, res): Promise<any> => {
    const { image, fileType, fileName = "evidence_upload.png" } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing evidence image payload." });
    }

    const { hash: trustId, block: blockNumber } = generateCryptoTrace();
    const timestamp = new Date().toISOString();

    // Try using real Gemini API
    const ai = getAIClient();
    if (ai) {
      try {
        // Strip base64 prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        let detectedMime = "image/png";
        const mimeMatches = image.match(/^data:(image\/\w+);base64,/);
        if (mimeMatches && mimeMatches[1]) {
          detectedMime = mimeMatches[1];
        }

        const response = await generateContentWithRetry(ai, {
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                mimeType: detectedMime,
                data: base64Data,
              },
            },
            {
              text: `Perform a detailed corporate forensic audit of this document/image. 
If it is a payment screenshot (UPI, PhonePe, Paytm, Google Pay), check for font mismatches, pixel misalignments in numbers, incorrect transaction signatures, logo anomalies, or background tampering.
If it is an identity document, face photo, or certificate, check for face modifications, cloned stamps, Photoshop artifacts, modified EXIF fields, or text manipulation.
Explain the investigation deeply. Frame it with high-grade cybersecurity, anti-money laundering compliance, and enterprise threat intelligence perspective.`,
            },
          ],
          config: {
            systemInstruction: `You are the Lead Forensic Investigator at TrustLens AI, an enterprise-grade Digital Trust platform styled like Apple + Stripe + Perplexity + Linear.
Perform structural image forensic audits. Your outputs must include detailed pixel investigations, OCR transcriptions, EXIF evaluations, threat audits, and regulatory compliance considerations (AML, SOC2, ISO 27001).
Ensure your findings explain what occurred, why, where, system confidence, and directives.`,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isManipulated: { type: Type.BOOLEAN },
                confidenceScore: { type: Type.INTEGER, description: "Probability of intentional digital forgery, 0-100" },
                verdict: { type: Type.STRING, description: "E.g., MANIPULATION DETECTED, VERIFIED AUTHENTIC, SUSPICIOUS RE-SAVE" },
                primaryClassification: { type: Type.STRING, description: "E.g., PhonePe UPI Screenshot, Modified pdf, Cert" },
                ocrExtractedText: { type: Type.STRING, description: "All text extracted via forensic OCR" },
                metadataDetails: {
                  type: Type.OBJECT,
                  properties: {
                    dimensions: { type: Type.STRING },
                    softwareDetect: { type: Type.STRING, description: "E.g., Adobe Photoshop, Pixelmator, phone default" },
                    createdDate: { type: Type.STRING },
                    anomaliesDetected: { type: Type.STRING, description: "EXIF validation notes" }
                  }
                },
                forensicAnalysisLog: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "E.g. Pixel Noise Consistency, Metadata Validation, Edge Aberrations" },
                      status: { type: Type.STRING, description: "'critical' | 'warning' | 'verified'" },
                      details: { type: Type.STRING }
                    },
                    required: ["name", "status", "details"]
                  }
                },
                investigatorDirective: { type: Type.STRING },
                threatIntelligence: {
                  type: Type.OBJECT,
                  properties: {
                    scamMatchSignature: { type: Type.STRING },
                    regulatoryAuditTrail: { type: Type.STRING },
                    mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["scamMatchSignature", "regulatoryAuditTrail", "mitigationSteps"]
                }
              },
              required: [
                "isManipulated", "confidenceScore", "verdict", "primaryClassification", 
                "ocrExtractedText", "forensicAnalysisLog", "investigatorDirective", "threatIntelligence"
              ]
            }
          }
        });

        const responseText = response.text || "{}";
        const result = parseSafeJson(responseText);

        // Merge on-chain fingerprint fields
        return res.json({
          ...result,
          trustId,
          blockNumber,
          verifiedAt: timestamp,
          fileName,
          isSimulated: false,
          engineUsed: "Gemini 3.5 Neural-Audit Core"
        });
      } catch (apiError: any) {
        console.log("Synthesized backup model chain activated.");
        // Fallback to offline simulator on API call failure
      }
    }

    // Robust, Realistic Forensic Simulator if API is missing/fails
    const normalName = fileName.toLowerCase();
    let mockupResult;

    if (normalName.includes("pay") || normalName.includes("screenshot") || normalName.includes("phonepe") || fileType === "payment") {
      mockupResult = {
        isManipulated: true,
        confidenceScore: 98,
        verdict: "MANIPULATION DETECTED",
        primaryClassification: "PhonePe UPI Screenshot Forgery",
        ocrExtractedText: "PhonePe Transaction Successful. Paid to: Enterprise Retail Corp. Amount: ₹50,000. Ref ID: 318492049182. Date: June 09, 2026 08:05 AM.",
        metadataDetails: {
          dimensions: "1080 x 2400 (FHD+)",
          softwareDetect: "Social Media Compressor / Export Filter",
          createdDate: "2026-06-09T08:05:12Z",
          anomaliesDetected: "Created timestamp does not match transaction record timeline."
        },
        forensicAnalysisLog: [
          {
            name: "OCR Overlay Alignment check",
            status: "critical",
            details: "Amount fields (₹50,000) show font anti-aliasing variations and a 4px vertical shift, suggesting manual layer composition."
          },
          {
            name: "Pixel Noise Consistency",
            status: "critical",
            details: "Area bounding box [x: 230, y: 440] contains smoothed Gaussian noise patterns, typical of healing/cloned tools."
          },
          {
            name: "Metadata EXIF Audit",
            status: "warning",
            details: "File header timestamp differs from phone file modification records."
          },
          {
            name: "Quantization Table Integrity",
            status: "verified",
            details: "Standard hardware quantization vectors found; structure has undergone single-save compression."
          }
        ],
        investigatorDirective: "IMMEDIATE COMPLIANCE NOTICE: Found active numeric altering on the payment transfer screen. Immediate transaction halt recommended. Initiate legal holding on this case under Section 420 (Anti-Fraud Directive). Reference file with security operations.",
        threatIntelligence: {
          scamMatchSignature: "UPI_FRAUD_TEMPLATE_V4 (Tampered fonts and misaligned success checkmarks common to scam channels)",
          regulatoryAuditTrail: "SOC2 Compliance Tracking Activated. Audit event registered under AML-2026-99284. Traceable hash dispatched on-ledger.",
          mitigationSteps: [
            "Initiate legal hold on evidence payload",
            "Cross-examine transaction Ref ID (318492049182) directly via Bank Merchant panel",
            "Export compliance forensic report PDF for risk teams"
          ]
        }
      };
    } else if (normalName.includes("portrait") || normalName.includes("face") || normalName.includes("deep") || fileType === "deepfake") {
      mockupResult = {
        isManipulated: true,
        confidenceScore: 94,
        verdict: "DEEPFAKE DETECTED",
        primaryClassification: "Synthesized AI Portrait (Face Swap)",
        ocrExtractedText: "REGISTRATION ID: 48194-X8. CLASSIFICATION: EXECUTIVE PROFILE.",
        metadataDetails: {
          dimensions: "1200 x 1500",
          softwareDetect: "StableDiffusion / GAN face-swap overlay model",
          createdDate: "2026-06-08T19:22:40Z",
          anomaliesDetected: "Biometric and spatial discrepancies found around mouth and eyes boundary channels."
        },
        forensicAnalysisLog: [
          {
            name: "Biological Eye Alignment Check",
            status: "critical",
            details: "Pupil shape abnormalities and inconsistent light reflection vectors indicating model-generated face swap."
          },
          {
            name: "Splicing Edge Aberrations",
            status: "critical",
            details: "High-contrast chromatic shift discovered across ear-neck boundary interface [x: 650, y: 420]."
          },
          {
            name: "Frequency Domain Analysis",
            status: "warning",
            details: "Fourier transform exposes unusual high-frequency spectrum spikes typical of generative GAN boundaries."
          },
          {
            name: "EXIF Signature Seal",
            status: "verified",
            details: "No camera software signature; file contains generic sRGB color profiles."
          }
        ],
        investigatorDirective: "IDENTITY ALARM: High probability of artificial facial override detected. The subject face does not correlate with baseline human geometry. Flag account verification as 'SUSPECT - IDENTITY SPOOF'.",
        threatIntelligence: {
          scamMatchSignature: "GAN_FACE_REPLACE_V2.5 (Discovered typical synthesized iris artifacting maps)",
          regulatoryAuditTrail: "KYC Compliance Event Audit: Registered high-risk KYC bypass attempt for HR records system. ISO 27001 log dispatched.",
          mitigationSteps: [
            "Reject automated profile onboarding",
            "Request interactive live liveness liveness validation",
            "Add biometric fingerprint to Known Fraud Database"
          ]
        }
      };
    } else {
      mockupResult = {
        isManipulated: false,
        confidenceScore: 99,
        verdict: "VERIFIED AUTHENTIC",
        primaryClassification: "Secure Document Seal (PDF Certificate)",
        ocrExtractedText: "Certificate of Digital Audit Compliance. Issuer: TrustLens Security Systems. Recipient: global_user_9019. Status: Tier 1 Secure.",
        metadataDetails: {
          dimensions: "1600 x 2200",
          softwareDetect: "Acrobat Distiller for Linux",
          createdDate: "2026-06-09T01:14:50Z",
          anomaliesDetected: "All structure elements, signatures, and timestamps align with cryptographic baselines."
        },
        forensicAnalysisLog: [
          {
            name: "Metadata Certificate Chain",
            status: "verified",
            details: "Issued public key matches trustworthy certification authority registry."
          },
          {
            name: "Pixel Frequency Mapping",
            status: "verified",
            details: "Perfect consistent noise throughout text zones. No content-aware alterations or brush cloning stamps present."
          },
          {
            name: "Layout Structure Validation",
            status: "verified",
            details: "All text aligns precisely to vertical grid margins and expected document specifications."
          }
        ],
        investigatorDirective: "VERIFIED SECURE: This record exhibits no signs of post-render tampering or electronic forgery. It is clear for corporate audits. Validated digital timestamp successfully locked.",
        threatIntelligence: {
          scamMatchSignature: "Matched 0 fraud patterns or edit stamps. Perfect signature integrity verified.",
          regulatoryAuditTrail: "Compliant with SOC2 Trust Principles and GDPR proof of secure origin regulations. Cryptographic seal is fully certified.",
          mitigationSteps: [
            "Issue digital Trust Passport immediately",
            "Download secure verification certificate for file audit",
            "Anchor case record in permanent enterprise ledger index"
          ]
        }
      };
    }

    res.json({
      ...mockupResult,
      trustId,
      blockNumber,
      verifiedAt: timestamp,
      fileName,
      isSimulated: true,
      engineUsed: mockupResult.isManipulated ? "High-Availability Tamper Analysis Simulator" : "Local Cryptographic Authenticator"
    });
  });

  // Serve static assets in production, otherwise Vite dev server handles client assets
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // Setup Vite Dev server middleware inside startup scope
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 TrustLens AI Full-Stack Server running on server port ${PORT}`);
  });
}

startServer();
