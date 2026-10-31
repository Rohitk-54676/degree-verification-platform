export default function HowItWorks() {
  const steps = [
    {
      title: "University Issues",
      desc: "Registrars generate degrees. The system computes a SHA-256 hash of the student data and generates a unique QR code.",
      icon: "🏛️",
    },
    {
      title: "Student Downloads",
      desc: "Students log in to view and download their degrees as PDFs, complete with their university's custom theme.",
      icon: "🎓",
    },
    {
      title: "Employer Verifies",
      desc: "Employers scan the QR. The system recomputes the hash. If even one letter was changed, it shows TAMPERED.",
      icon: "🛡️",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How DegreeVerify Works
          </h2>
          <p className="text-lg text-slate-600">
            A simple, secure flow from issuance to verification.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10"></div>

          {steps.map((step, i) => (
            <div key={i} className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}