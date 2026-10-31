import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                D
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                DegreeVerify
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              A blockchain-inspired, tamper-proof degree verification platform for
              universities, students, and employers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/verify" className="hover:text-white transition-colors">
                  Verify a Degree
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  University Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="#how-it-works" className="hover:text-white transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact / Request Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2026 DegreeVerify. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Built with Next.js & PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}