import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustStats from "@/components/landing/TrustStats";
import HowItWorks from "@/components/landing/HowItWorks";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Wrap the DB fetch in Suspense so the page shell loads instantly */}
        <Suspense
          fallback={
            <div className="h-32 bg-slate-50 border-y border-slate-200 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          <TrustStats />
        </Suspense>

        <HowItWorks />
        <ContactSection /> 
        {/* CTA Section */}
        <section id="features" className="py-24 bg-blue-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to secure your institution's degrees?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join the platform that makes verification instant and forgery impossible.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/login"
                className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-3.5 rounded-xl font-bold shadow-xl transition-all hover:-translate-y-0.5"
              >
                Login to Portal
              </a>
              <a
                href="/verify"
                className="bg-blue-700 text-white hover:bg-blue-800 border border-blue-500 px-8 py-3.5 rounded-xl font-bold transition-all"
              >
                Verify a Degree
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}