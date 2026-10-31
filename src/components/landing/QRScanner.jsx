"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";

export default function QRScanner({ onClose, onScanSuccess }) {
  const qrCodeInstanceRef = useRef(null);
  const isStartedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        // 1. Clear the container to prevent double video elements
        const container = document.getElementById("qr-reader");
        if (container) container.innerHTML = "";

        // 2. Prevent multiple instances in Strict Mode
        if (qrCodeInstanceRef.current) {
          return;
        }

        const html5QrCode = new Html5Qrcode("qr-reader");
        qrCodeInstanceRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Stop scanning immediately on success
            if (isStartedRef.current && qrCodeInstanceRef.current) {
              qrCodeInstanceRef.current.stop().catch(() => {});
              isStartedRef.current = false;
            }
            // Parse the credential ID from the URL
            const parts = decodedText.split("/");
            const credentialId = parts[parts.length - 1];
            onScanSuccess(credentialId);
          },
          () => {
            // Ignore parse errors
          }
        );
        
        if (isMounted) {
          isStartedRef.current = true;
        }
      } catch (err) {
        console.error("Camera start failed", err);
        if (isMounted) {
          alert("Could not access camera. Please check permissions.");
          onClose();
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (isStartedRef.current && qrCodeInstanceRef.current) {
        // Stop the camera safely
        qrCodeInstanceRef.current.stop().catch(() => {});
        isStartedRef.current = false;
        qrCodeInstanceRef.current = null;
      }
    };
  }, [onScanSuccess, onClose]);

    return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 bg-slate-50">
          {/* 
            Using a fixed height container and hiding overflow.
            The video will stretch to cover this area via CSS.
          */}
          <div className="relative w-full h-[300px] bg-black rounded-xl overflow-hidden">
            <div 
              id="qr-reader" 
              className="absolute inset-0 w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover" 
            ></div>
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            Point your camera at the QR code on the degree certificate.
          </p>
        </div>
      </div>
    </div>
  );
}