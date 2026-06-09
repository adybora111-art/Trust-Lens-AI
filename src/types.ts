export interface MetadataDetails {
  dimensions?: string;
  softwareDetect?: string;
  createdDate?: string;
  anomaliesDetected?: string;
}

export interface ForensicLogItem {
  name: string;
  status: "critical" | "warning" | "verified" | "pending";
  details: string;
}

export interface ThreatIntelligence {
  scamMatchSignature: string;
  regulatoryAuditTrail: string;
  mitigationSteps: string[];
}

export interface ForensicReport {
  trustId: string;
  blockNumber: number;
  fileName: string;
  verifiedAt: string;
  isManipulated: boolean;
  confidenceScore: number;
  verdict: string;
  primaryClassification: string;
  ocrExtractedText: string;
  metadataDetails?: MetadataDetails;
  forensicAnalysisLog: ForensicLogItem[];
  investigatorDirective: string;
  threatIntelligence: ThreatIntelligence;
  isSimulated?: boolean;
  engineUsed?: string;
  imageUrl?: string;
}

export interface ScamTemplate {
  id: string;
  title: string;
  category: "Payment" | "Biometric" | "Document" | "Academic";
  frequency: "High" | "Medium" | "Low";
  targetBrands: string[];
  identifyingStamps: string[];
  severity: "Critical" | "Warning";
  exampleImageUrl: string;
}

export interface ThreatAlert {
  id: string;
  alertType: string;
  sourceGeo: string;
  affectedVolume: string;
  impactLevel: "Critical" | "High" | "Medium";
  observedPatterns: string;
}
