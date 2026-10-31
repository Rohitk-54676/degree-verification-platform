"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRScanner from "./QRScanner";
import { Camera } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [credentialId, setCredentialId] = useState("");
  const [showScanner, setShowScanner] = useState(false);

    function handleSubmit(e) {
    e.preventDefault();
    const trimmed = credentialId.trim();
    if (trimmed) {
      
      router.replace(`/verify/${encodeURIComponent(trimmed)}`);
    }
  }

  function handleScanSuccess(scannedId) {
    setShowScanner(false);
    
    router.replace(`/verify/${encodeURIComponent(scannedId)}`);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              Blockchain-Secured Verification
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Tamper-proof degrees, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                verified in seconds.
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Every degree issued through DegreeVerify carries a unique
              cryptographic hash. Instantly check if a certificate is authentic,
              revoked, or tampered with.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="#verify"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
              >
                Verify a Degree
              </Link>
              <Link
                href="/login"
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-xl font-medium transition-all"
              >
                For Universities
              </Link>
            </div>
          </div>

          {/* Right: Verify Card */}
          <div id="verify" className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-slate-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Instant Verification
              </h2>
              <p className="text-sm text-slate-500 mb-8">
                Enter the Credential ID printed on the degree certificate.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. LPU-2026-000001"
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-slate-50 font-mono text-sm transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-blue-600/30 transition-all"
                >
                  Verify Credential
                </button>
              </form>

              <div className="mt-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-500 uppercase">Or</span>
                </div>
              </div>

              <button
                onClick={() => setShowScanner(true)}
                className="mt-4 w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Scan QR Code
              </button>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center mb-4 uppercase tracking-wider font-semibold">
                  Try a demo
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href="/verify/LPU-2026-000001"
                    className="text-xs font-mono bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-slate-700 transition-colors border border-slate-200"
                  >
                    Valid Degree
                  </Link>
                  <Link
                    href="/verify/DU-2024-000001"
                    className="text-xs font-mono bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-slate-700 transition-colors border border-slate-200"
                  >
                    Revoked Degree
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </>
  );
}