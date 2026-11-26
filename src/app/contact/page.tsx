"use client";

import { useActionState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContactAction, ContactFormState } from "@/actions/contact";

const initialState: ContactFormState = {
  success: false,
};

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(
    submitContactAction,
    initialState
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Customer Care
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-neutral-900 font-sans tracking-tight">
          How Can We Help You?
        </h1>
        <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
          Have inquiries regarding product sizing, order status, or returns?
          Our team is available Saturday through Thursday, 9:00 AM – 8:00 PM BST.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#F7F7F5] rounded-2xl border border-neutral-100 space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">
              Contact Channels
            </h3>

            <div className="flex items-start gap-3 text-sm text-neutral-600">
              <Mail className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-900">Email Support</p>
                <p className="text-xs text-neutral-500">support@nextstore.com.bd</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-neutral-600">
              <Phone className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-900">Phone Support</p>
                <p className="text-xs text-neutral-500">+880 1700-000000</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-neutral-600">
              <MapPin className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-900">Distribution Hub</p>
                <p className="text-xs text-neutral-500">Gulshan-2, Dhaka 1212, Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 text-xs text-neutral-600 space-y-2">
            <p className="font-semibold text-neutral-900">Order Updates &amp; Tracking</p>
            <p>
              When your order is confirmed via Shopify, an automated SMS and email
              with live tracking credentials will be sent to the contact info provided at checkout.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs">
          {state.success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-neutral-900">
                Message Sent Successfully
              </h3>
              <p className="text-sm text-neutral-500 max-w-md mx-auto">
                {state.message}
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  {state.errors?.name && (
                    <p className="text-xs text-red-600 mt-1">{state.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tanvir@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  {state.errors?.email && (
                    <p className="text-xs text-red-600 mt-1">{state.errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Order query, exchange request, product question..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us how we can assist you..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors"
                />
                {state.errors?.message && (
                  <p className="text-xs text-red-600 mt-1">{state.errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
