"use client";

import { useActionState, type CSSProperties } from "react";
import { Mail, Phone, MapPin, CheckCircle2, Loader2, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Reveal } from "@/components/motion/Reveal";
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
    <PageTransition>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <StaggerGroup trigger="mount" step={120} className="max-w-2xl mb-12">
        <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400">
          Customer Care
        </span>
        <SplitText
          as="h1"
          trigger="mount"
          delay={100}
          text="How Can We Help You?"
          className="mt-2 text-3xl sm:text-4xl font-black text-neutral-900 font-sans tracking-tight"
        />
        <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
          Have inquiries regarding product sizing, order status, or returns?
          Our team is available Saturday through Thursday, 9:00 AM – 8:00 PM BST.
        </p>
      </StaggerGroup>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Details */}
        <StaggerGroup trigger="mount" delay={300} step={120} className="lg:col-span-5 space-y-6">
          <div data-stagger="mount" style={{ "--d": "450ms", "--step": "80ms", "--ry": "12px" } as CSSProperties} className="p-6 bg-[#F7F7F5] rounded-2xl border border-neutral-100 space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">
              Contact Channels
            </h3>

            <div className="group flex items-start gap-3 text-sm text-neutral-600">
              <Mail className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
              <div>
                <p className="font-medium text-neutral-900">Email Support</p>
                <p className="text-xs text-neutral-500">support@nextstore.com.bd</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 text-sm text-neutral-600">
              <Phone className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
              <div>
                <p className="font-medium text-neutral-900">Phone Support</p>
                <p className="text-xs text-neutral-500">+880 1700-000000</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 text-sm text-neutral-600">
              <MapPin className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
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
        </StaggerGroup>

        {/* Right: Contact Form */}
        <Reveal trigger="mount" delay={350} y={32} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-lg transition-shadow duration-700">
          <AnimatePresence mode="wait" initial={false}>
          {state.success ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE.out }}
              role="status"
              className="py-12 text-center space-y-3"
            >
              <motion.div
                initial={{ scale: 0, rotate: -60 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.15 }}
                className="w-12 h-12 mx-auto"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-neutral-900">
                Message Sent Successfully
              </h3>
              <p className="text-sm text-neutral-500 max-w-md mx-auto">
                {state.message}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
              action={formAction}
              data-stagger="mount"
              style={{ "--d": "550ms", "--step": "70ms", "--ry": "14px" } as CSSProperties}
              className="space-y-4"
            >
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-black focus:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-[border-color,box-shadow] duration-300"
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-black focus:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-[border-color,box-shadow] duration-300"
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-black focus:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-[border-color,box-shadow] duration-300"
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-black focus:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-[border-color,box-shadow] duration-300"
                />
                {state.errors?.message && (
                  <p className="text-xs text-red-600 mt-1">{state.errors.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isPending}
                className="group btn-shine w-full sm:w-auto px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
          </AnimatePresence>
        </Reveal>
      </div>
    </div>
    </PageTransition>
  );
}
