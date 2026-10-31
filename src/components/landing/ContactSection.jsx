"use client";

import { useActionState, useEffect, useState } from "react";
import { submitInquiry } from "../../../actions/submit-inquiry";

const initialState = { ok: false };

export default function ContactSection() {
  const [state, formAction, isPending] = useActionState(
    submitInquiry,
    initialState
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      setSuccess(true);
    }
  }, [state]);

  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
          
          {/* Left Info */}
          <div className="bg-slate-900 p-10 md:p-12 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-4">Bring your university onboard.</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Join the network of institutions issuing tamper-proof degrees. 
                Fill out the form to request an admin account for your registrar.
              </p>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-blue-500 text-lg">✓</span> Custom certificate branding
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-blue-500 text-lg">✓</span> Instant employer verification
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-blue-500 text-lg">✓</span> Cryptographic tamper detection
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="p-10 md:p-12">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-2">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900">Request Received!</h3>
                <p className="text-slate-500 text-sm">
                  Our team will contact you at the provided email address within 24 hours.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-blue-600 font-medium hover:underline text-sm"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                {state?.error && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                    {state.error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">University Name *</label>
                  <input name="university" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
                  <input name="contactName" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Work Email *</label>
                  <input type="email" name="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message (Optional)</label>
                  <textarea name="message" rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-medium transition-colors mt-2"
                >
                  {isPending ? "Sending..." : "Request Access"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}