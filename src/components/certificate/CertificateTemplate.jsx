"use client";

import { QRCodeSVG } from "qrcode.react";

export default function CertificateTemplate({ credential, university, verifyUrl }) {
  const primary = university.primaryColor || "#1e3a8a";
  const accent = university.secondaryColor || "#d4af37";
  const font = university.fontFamily === "sans" ? "font-sans" : "font-serif";
  const isRevoked = credential.status === "REVOKED";
  const borderStyle = {
    single: "border-2",
    double: "border-4 border-double",
    ornate: "border-8 border-double",
  }[university.borderStyle || "double"];

  return (
    <div
      className={`relative bg-white ${font} ${borderStyle} p-8 md:p-12`}
      style={{ borderColor: primary, minHeight: "600px" }}
    >
      {/* Corner accents */}
      <div
        className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4"
        style={{ borderColor: accent }}
      />
      <div
        className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4"
        style={{ borderColor: accent }}
      />
      <div
        className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4"
        style={{ borderColor: accent }}
      />
      <div
        className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4"
        style={{ borderColor: accent }}
      />

      {/* University Header */}
      <div className="text-center space-y-2 mb-8">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-2 text-white font-bold text-2xl"
          style={{ backgroundColor: primary }}
        >
          {university.code}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: primary }}>
          {university.name}
        </h1>
        {university.motto && (
          <p className="text-sm italic text-slate-600">{university.motto}</p>
        )}
        {university.address && (
          <p className="text-xs text-slate-500">{university.address}</p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-0.5 w-16" style={{ backgroundColor: accent }} />
        <span
          className="text-2xl md:text-3xl font-bold tracking-widest"
          style={{ color: primary }}
        >
          CERTIFICATE OF DEGREE
        </span>
        <div className="h-0.5 w-16" style={{ backgroundColor: accent }} />
      </div>

      {/* Body */}
      <div className="text-center space-y-4 my-8">
        <p className="text-slate-700">This is to certify that</p>
        <p className="text-3xl md:text-4xl font-bold" style={{ color: primary }}>
          {credential.studentName}
        </p>
        <p className="text-sm text-slate-600">
          Enrollment No: <span className="font-mono">{credential.enrollmentNo}</span>
        </p>

        <p className="text-slate-700 mt-6">has successfully completed</p>
        <p className="text-2xl font-semibold text-slate-900">
          {credential.degree}
        </p>
        <p className="text-lg text-slate-700">in {credential.branch}</p>
        <p className="text-slate-700">
          in the year <strong>{credential.yearOfPassing}</strong>
          {credential.cgpa && (
            <> with CGPA <strong>{credential.cgpa}</strong></>
          )}
        </p>
      </div>

      {/* Footer — QR + credential info + signature */}
      <div className="grid grid-cols-3 gap-4 items-end mt-12">
        <div className="text-left">
          <div className="bg-white p-2 inline-block border border-slate-200 rounded">
            <QRCodeSVG value={verifyUrl} size={100} level="M" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Scan to verify
          </p>
        </div>

        <div className="text-center text-xs text-slate-600 space-y-1">
          <p>
            <span className="font-semibold">Credential ID:</span>
          </p>
          <p className="font-mono">{credential.credentialId}</p>
          <p className="mt-2">
            <span className="font-semibold">Hash:</span>
          </p>
          <p className="font-mono text-[10px] break-all">
            {credential.recordHash.slice(0, 32)}...
          </p>
          <p className="mt-2">
            Issued: {new Date(credential.issuedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <div
            className="border-t-2 pt-2 inline-block min-w-[150px]"
            style={{ borderColor: primary }}
          >
            <p className="text-sm font-semibold" style={{ color: primary }}>
              {university.registrarName || "Registrar"}
            </p>
            <p className="text-xs text-slate-500">Registrar</p>
          </div>
        </div>
      </div>

      {/* Revoked watermark */}
      {isRevoked && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <span
            className="text-8xl font-black transform -rotate-45"
            style={{ color: "rgba(220, 38, 38, 0.15)" }}
          >
            REVOKED
          </span>
        </div>
      )}
    </div>
  );
}