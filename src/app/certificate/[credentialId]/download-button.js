"use client";

export default function DownloadButton({ credentialId }) {
  function handleDownload() {
    window.location.href = `/api/certificate/${credentialId}/pdf`;
  }

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
    >
      Download PDF
    </button>
  );
}