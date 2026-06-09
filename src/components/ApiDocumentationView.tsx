import React, { useState } from "react";
import { 
  Terminal, 
  Copy, 
  CheckCircle,
  Database,
  Code2
} from "lucide-react";

type CodeLang = "curl" | "node" | "python";

export default function ApiDocumentationView() {
  const [activeLang, setActiveLang] = useState<CodeLang>("curl");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/verify-payment",
      title: "Verify UPI / Bank Screenshot",
      description: "Performs strict OCR extraction, font alignment verification, and noise consistency scoring on payment transfer receipts.",
      requestBody: {
        image: "data:image/png;base64,iVBORw0KGgoAAA...",
        provider: "phonepe",
        checkRules: ["UPI_LAYOUT_MATCH", "UTR_FORMAT_VALIDITY"]
      },
      response: {
        isManipulated: true,
        confidenceScore: 98,
        verdict: "MANIPULATION DETECTED",
        primaryClassification: "PhonePe UPI Screenshot Forgery",
        ocrExtractedText: "Paid to: FastPay Merchants. Amount: ₹45,000. Ref ID: 318492049182.",
        forensicAnalysisLog: [
          { name: "OCR Overlay Alignment check", status: "critical", details: "Amount fields (₹45,000) show font anti-aliasing variations and vertical shifts." }
        ],
        trustId: "0xA981FB8203E7216BA...",
        blockNumber: 18274102,
        verifiedAt: new Date().toISOString()
      },
      snippets: {
        curl: `curl -X POST https://api.trustlens.ai/v1/verify-payment \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer tl_secret_77218492" \\
  -d '{
    "image": "data:image/png;base64,iVBORw0KGgoAAA...",
    "provider": "phonepe"
  }'`,
        node: `const axios = require('axios');

axios.post('https://api.trustlens.ai/v1/verify-payment', {
  image: 'data:image/png;base64,iVBORw0KGgoAAA...',
  provider: 'phonepe'
}, {
  headers: {
    'Authorization': 'Bearer tl_secret_77218492'
  }
})
.then(response => {
  console.log('Forensic Verdict:', response.data.verdict);
})
.catch(error => {
  console.error('Audit Error:', error.message);
});`,
        python: `import requests

url = "https://api.trustlens.ai/v1/verify-payment"
headers = {
    "Authorization": "Bearer tl_secret_77218492",
    "Content-Type": "application/json"
}
payload = {
    "image": "data:image/png;base64,iVBORw0KGgoAAA...",
    "provider": "phonepe"
}

response = requests.post(url, json=payload, headers=headers)
print("Forensic Verdict:", response.json()["verdict"])`
      }
    },
    {
      method: "POST",
      path: "/api/v1/verify-document",
      title: "Verify Core Document Stamp",
      description: "Direct EXIF auditing and metadata footprint parser checking file creation timelines and camera sensor calibration rules.",
      requestBody: {
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        documentType: "academic_certificate"
      },
      response: {
        isManipulated: false,
        confidenceScore: 99,
        verdict: "VERIFIED AUTHENTIC",
        primaryClassification: "Secure Document Seal",
        ocrExtractedText: "Certificate of Computer Systems Engineering.",
        metadataDetails: {
          softwareDetect: "Acrobat Distiller for Linux",
          createdDate: "2026-06-09T01:14:50Z",
          anomaliesDetected: "None detected // pristine signature"
        },
        trustId: "0xBC319482EF05A31C...",
        blockNumber: 18274199,
        verifiedAt: new Date().toISOString()
      },
      snippets: {
        curl: `curl -X POST https://api.trustlens.ai/v1/verify-document \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer tl_secret_77218492" \\
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "documentType": "academic_certificate"
  }'`,
        node: `const axios = require('axios');

axios.post('https://api.trustlens.ai/v1/verify-document', {
  image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  documentType: 'academic_certificate'
}, {
  headers: {
    'Authorization': 'Bearer tl_secret_77218492'
  }
})
.then(response => {
  console.log('Verification state:', response.data.verdict);
})
.catch(error => {
  console.error('Audit Error:', error.message);
});`,
        python: `import requests

url = "https://api.trustlens.ai/v1/verify-document"
headers = {
    "Authorization": "Bearer tl_secret_77218492",
    "Content-Type": "application/json"
}
payload = {
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "documentType": "academic_certificate"
}

response = requests.post(url, json=payload, headers=headers)
print("Verification State:", response.json()["verdict"])`
      }
    },
    {
      method: "GET",
      path: "/api/v1/verification-history",
      title: "Query Blockchain Proofs",
      description: "Returns an array of on-chain verification anchors with associated SHA256 hashes, blocks, and analysis outputs.",
      requestBody: null,
      response: {
        totalRecords: 148102,
        records: [
          {
            trustId: "0xA981FB8203E7216BA...",
            blockNumber: 18274102,
            verifiedAt: "2026-06-09T08:05:12Z",
            fileName: "Phonepe_screenshot_verified.png",
            verdict: "MANIPULATION DETECTED"
          }
        ]
      },
      snippets: {
        curl: `curl https://api.trustlens.ai/v1/verification-history \\
  -H "Authorization: Bearer tl_secret_77218492"`,
        node: `const axios = require('axios');

axios.get('https://api.trustlens.ai/v1/verification-history', {
  headers: {
    'Authorization': 'Bearer tl_secret_77218492'
  }
})
.then(response => {
  console.log('Synced records total:', response.data.totalRecords);
})
.catch(error => {
  console.error('Audit Error:', error.message);
});`,
        python: `import requests

url = "https://api.trustlens.ai/v1/verification-history"
headers = {
    "Authorization": "Bearer tl_secret_77218492"
}

response = requests.get(url, headers=headers)
print("Synced Records Total:", response.json()["totalRecords"])`
      }
    }
  ];

  const handleCopyText = (text: string, indexKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(indexKey);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-8 animate-fade-in font-display">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-[10px] font-extrabold tracking-widest font-mono text-emerald-600 uppercase">
          DEVELOPER HUB
        </p>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1">
          API Integration Reference
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Embed TrustLens AI directly into your SaaS checkout, onboarding KYC forms, or compliance ledger systems. Integrate via clean webhooks and straightforward REST endpoint structures.
        </p>
      </div>

      {/* Top info row: auth specs */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase">REST Core Authenticators</h4>
            <p className="text-xs text-slate-500 mt-0.5">Authorize requests via bearer keys dispatched inside standard Authorization headers.</p>
          </div>
        </div>
        <div className="bg-white px-4 py-2 border border-slate-200 rounded-xl font-mono text-xs flex gap-2 items-center text-slate-700">
          <span className="font-bold">Base URL:</span>
          <span className="text-emerald-600 font-semibold select-all">https://api.trustlens.ai/v1</span>
        </div>
      </div>

      {/* Code language selection bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h3 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase font-mono px-1">
          Endpoint Registers & Code Playpen
        </h3>
        <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-200">
          {(["curl", "node", "python"] as CodeLang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeLang === lang 
                  ? "bg-slate-950 text-white" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {lang === "curl" ? "cURL" : lang === "node" ? "Node.js" : "Python"}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints listing */}
      <div className="space-y-12">
        {endpoints.map((ep, idx) => {
          const codeSnippet = ep.snippets[activeLang];
          const responseJsonStr = JSON.stringify(ep.response, null, 2);
          const blockId = `ep-${idx}`;

          return (
            <div key={blockId} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-slate-200 pb-10 last:border-none last:pb-0">
              
              {/* Left Side: Parameters, descriptions */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-black ${
                    ep.method === "POST" 
                      ? "bg-blue-50 text-blue-750 border border-blue-100" 
                      : "bg-emerald-50 text-emerald-750 border border-emerald-100"
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800 tracking-tight">
                    {ep.path}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-lg text-slate-900 leading-snug">
                    {ep.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {ep.description}
                  </p>
                </div>

                {ep.requestBody && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono tracking-wider block">Request Schema Fields:</span>
                    <div className="border border-slate-200 rounded-xl bg-slate-55 shadow-xs overflow-hidden text-xs">
                      <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/50 p-2 font-mono text-[10px] font-bold text-slate-500 uppercase">
                        <div>Field</div>
                        <div>Type</div>
                        <div>Required</div>
                      </div>
                      <div className="divide-y divide-slate-100 font-sans p-2">
                        {Object.entries(ep.requestBody).map(([k, v]) => (
                          <div key={k} className="grid grid-cols-3 py-1.5 font-mono text-xs">
                            <span className="font-bold text-slate-800">{k}</span>
                            <span className="text-blue-600">{typeof v}</span>
                            <span className="text-slate-400">Yes</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Code snippets & sample response */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Code snippets terminal */}
                <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-md font-mono text-xs overflow-hidden">
                  <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800/60 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-semibold uppercase flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      Client Request Snippet
                    </span>
                    <button 
                      onClick={() => handleCopyText(codeSnippet, `${blockId}-req`)}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === `${blockId}-req` ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY CODE</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto leading-relaxed select-all text-[11px] text-blue-100 bg-slate-950">{codeSnippet}</pre>
                </div>

                {/* Sample JSON response */}
                <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-md font-mono text-xs overflow-hidden">
                  <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800/60 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-semibold uppercase flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      Response Payload (200 OK)
                    </span>
                    <button 
                      onClick={() => handleCopyText(responseJsonStr, `${blockId}-res`)}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === `${blockId}-res` ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto leading-relaxed select-all text-[11px] text-emerald-400 bg-slate-950 max-h-72">{responseJsonStr}</pre>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
