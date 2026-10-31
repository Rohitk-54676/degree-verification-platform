"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Search } from "lucide-react";
import QRScanner from "@/components/landing/QRScanner";

export default function VerifyAnother() {
  const router = useRouter();
  const [credentialId, setCredentialId] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = credentialId.trim();
    if (trimmed) {
      // Use replace so back button doesn't go to previous degree
      router.replace(`/verify/${encodeURIComponent(trimmed)}`);
    }
  }

  function handleScanSuccess(scannedId) {
    setShowScanner(false);
    router.replace(`/verify/${encodeURIComponent(scannedId)}`);
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Verify Another Degree
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            placeholder="Enter Credential ID (e.g. LPU-2026-000001)"
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-slate-50 font-mono text-sm"
          />
          <button
            type="submit"
            disabled={!credentialId.trim()}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Verify
          </button>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Scan QR
          </button>
        </form>
      </div>

      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </>
  );
}