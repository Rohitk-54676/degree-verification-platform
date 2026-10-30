export default function StatusCard({ status }) {
  const config = {
    VALID: {
      bg: "bg-green-50",
      border: "border-green-300",
      iconBg: "bg-green-600",
      icon: "✓",
      title: "VALID CREDENTIAL",
      titleColor: "text-green-800",
      message:
        "This degree is authentic. The cryptographic hash matches and the credential has not been revoked.",
    },
    REVOKED: {
      bg: "bg-red-50",
      border: "border-red-300",
      iconBg: "bg-red-600",
      icon: "✕",
      title: "REVOKED CREDENTIAL",
      titleColor: "text-red-800",
      message:
        "This credential was issued but has since been revoked by the university. It should not be accepted.",
    },
    TAMPERED: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      iconBg: "bg-amber-600",
      icon: "⚠",
      title: "TAMPERED RECORD",
      titleColor: "text-amber-900",
      message:
        "The stored record does not match its cryptographic hash. The data has been modified since issue — do not trust this certificate.",
    },
    NOT_FOUND: {
      bg: "bg-slate-50",
      border: "border-slate-300",
      iconBg: "bg-slate-600",
      icon: "?",
      title: "NOT FOUND",
      titleColor: "text-slate-800",
      message:
        "No credential exists with this ID in our system. It may be fake, mistyped, or belong to another platform.",
    },
  }[status];

  return (
    <div className={`${config.bg} ${config.border} border-2 rounded-xl p-6`}>
      <div className="flex items-start gap-4">
        <div
          className={`${config.iconBg} w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}
        >
          {config.icon}
        </div>
        <div>
          <h2 className={`text-lg font-bold ${config.titleColor}`}>
            {config.title}
          </h2>
          <p className="text-sm text-slate-700 mt-1">{config.message}</p>
        </div>
      </div>
    </div>
  );
}