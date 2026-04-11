import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — TrendForge AI",
  description: "Read the Terms of Service for TrendForge AI, the AI-powered print-on-demand niche discovery and slogan generation platform.",
};

const LAST_UPDATED = "March 28, 2026";
const EFFECTIVE_DATE = "March 28, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">TrendForge AI</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title Block */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
            Legal Document
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-4">Terms of Service</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>Effective: <span className="text-gray-400 font-medium">{EFFECTIVE_DATE}</span></span>
            <span>Last Updated: <span className="text-gray-400 font-medium">{LAST_UPDATED}</span></span>
          </div>
          <p className="mt-6 text-gray-400 leading-relaxed">
            Please read these Terms of Service carefully before using TrendForge AI. By accessing or using the platform, you agree to be bound by these terms. If you do not agree, you may not use the service.
          </p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">1</span>
              Acceptance of Terms
            </h2>
            <p>These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and TrendForge AI (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating an account, accessing, or using any part of the TrendForge AI platform, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>
            <p className="mt-3">If you are using TrendForge AI on behalf of an organization or business, you represent and warrant that you have authority to bind that entity to these Terms, and references to &quot;you&quot; include that entity.</p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">2</span>
              Description of Service
            </h2>
            <p>TrendForge AI is an AI-powered Software-as-a-Service (SaaS) platform designed to help print-on-demand (POD) sellers discover profitable niches, generate commercial-grade slogans, create AI-assisted product designs, and automate publishing workflows. Features include, but are not limited to:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "Trend Discovery — AI-driven detection of emerging niche opportunities",
                "Strategy Factory — Data-backed campaign planning and product strategies",
                "Slogan Intelligence Engine — AI-generated and scored t-shirt slogans",
                "Bulk Factory — Scaled design and slogan generation across multiple niches",
                "Autopilot — Automated workflow orchestration for publishing and testing",
                "Analytics — Revenue tracking, performance insights, and usage reporting",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">We reserve the right to modify, suspend, or discontinue any feature at any time with reasonable notice.</p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">3</span>
              Account Registration & Security
            </h2>
            <p>To access TrendForge AI, you must create an account using a valid email address. You agree to:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "Provide accurate, current, and complete information during registration",
                "Maintain the security and confidentiality of your login credentials",
                "Immediately notify us of any unauthorized use of your account",
                "Not share your account credentials with third parties",
                "Be solely responsible for all activities that occur under your account",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">You must be at least 18 years old (or the legal age of majority in your jurisdiction) to create an account. We reserve the right to terminate accounts found to be in violation of these requirements.</p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">4</span>
              Subscription Plans & Billing
            </h2>
            <p>TrendForge AI offers both free and paid subscription tiers. By selecting a paid plan, you authorize us (or our payment processor) to charge your designated payment method on a recurring basis.</p>
            <div className="mt-4 space-y-3">
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="text-white font-bold text-sm mb-2">Free Plan</h3>
                <p className="text-sm text-gray-400">Access to core features with daily AI usage limits. No credit card required. Subject to rate limiting during peak demand.</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-indigo-500/20">
                <h3 className="text-white font-bold text-sm mb-2">Pro Plan — $79/month</h3>
                <p className="text-sm text-gray-400">Expanded AI allowance, priority processing, and full feature access. Billed monthly. Cancel anytime before the next billing cycle.</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 ml-4">
              {[
                "All charges are non-refundable except where required by applicable law",
                "We reserve the right to change pricing with 30 days' prior notice",
                "Failure to pay may result in service suspension or account termination",
                "You are responsible for all applicable taxes in your jurisdiction",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">5</span>
              Acceptable Use Policy
            </h2>
            <p>You agree to use TrendForge AI only for lawful purposes. You must not:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "Use the platform to generate content that infringes on any trademark, copyright, or intellectual property rights",
                "Generate slogans or designs featuring real individuals' names, likenesses, or protected personas without authorization",
                "Produce content that is defamatory, harassing, hateful, discriminatory, or obscene",
                "Attempt to reverse-engineer, copy, scrape, or extract our AI models, algorithms, or training data",
                "Use automated scripts or bots to circumvent rate limits or access controls",
                "Resell, sublicense, or white-label the platform without explicit written consent",
                "Use the platform to violate any print-on-demand marketplace's terms of service",
                "Attempt to disrupt or compromise the integrity or security of our infrastructure",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">Violation of this policy may result in immediate account suspension without refund.</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">6</span>
              AI-Generated Content & Intellectual Property
            </h2>
            <p>TrendForge AI generates slogans, niche ideas, and design concepts using large language models (LLMs) and proprietary algorithms. Important ownership clarifications:</p>
            <ul className="mt-4 space-y-2 ml-4">
              {[
                "Content you generate using TrendForge AI is yours to use commercially, subject to these Terms",
                "We do not claim ownership of output content you create through the platform",
                "You are solely responsible for verifying that output content is free from trademark or IP conflicts before commercial use",
                "Our Safety Engine reduces risk but does not guarantee that all generated content is cleared for commercial use in every jurisdiction",
                "TrendForge AI's interface, algorithms, scoring systems, and codebase remain our exclusive intellectual property",
                "You may not use our platform's output to train competing AI models",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-yellow-300 text-sm font-semibold mb-1">⚠️ Commercial Use Responsibility</p>
              <p className="text-yellow-200/70 text-sm">Always conduct your own trademark search before listing products commercially. TrendForge AI&apos;s commercial safety filters are an aid, not a legal guarantee. We recommend consulting a licensed trademark attorney for high-volume categories.</p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">7</span>
              Third-Party Services & Integrations
            </h2>
            <p>TrendForge AI integrates with third-party services to deliver its features. By using the platform, you acknowledge that:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "OpenAI's API powers our AI generation features — your usage is subject to OpenAI's usage policies",
                "Payment processing is handled by Stripe — subject to Stripe's terms of service",
                "Print-on-demand partner integrations are subject to each marketplace's own terms",
                "Trend and market data may be sourced from third-party providers",
                "We are not liable for interruptions or changes to third-party services",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">8</span>
              Disclaimer of Warranties
            </h2>
            <p>TrendForge AI is provided on an &quot;<strong className="text-white">AS IS</strong>&quot; and &quot;<strong className="text-white">AS AVAILABLE</strong>&quot; basis without warranties of any kind, either express or implied, including but not limited to:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "No warranty that the platform will be error-free, uninterrupted, or meet your specific requirements",
                "No warranty that AI-generated slogans will achieve any particular sales performance",
                "No warranty that niche scores, revenue projections, or opportunity ratings represent guaranteed outcomes",
                "No warranty that the commercial safety engine will catch every potential IP conflict",
                "No implied warranties of merchantability, fitness for a particular purpose, or non-infringement",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">9</span>
              Limitation of Liability
            </h2>
            <p>To the maximum extent permitted by applicable law, TrendForge AI and its affiliates, officers, directors, employees, and agents shall not be liable for any:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "Indirect, incidental, special, consequential, or punitive damages",
                "Loss of profits, revenue, data, business, or goodwill",
                "Losses arising from reliance on AI-generated content",
                "Marketplace bans or account suspensions on third-party platforms",
                "Trademark or IP disputes arising from use of generated content",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">Our total aggregate liability arising out of or related to these Terms or use of the service shall not exceed the greater of (a) the amounts paid by you for the service in the 12 months preceding the claim or (b) US$100.</p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">10</span>
              Termination
            </h2>
            <p>Either party may terminate this agreement at any time:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "You may cancel your subscription and deactivate your account at any time via the Settings page",
                "We may suspend or terminate your account for violations of these Terms, with or without notice depending on severity",
                "Upon termination, your right to access the platform ceases immediately",
                "We may retain de-identified, aggregated usage data after termination per our Privacy Policy",
                "Sections covering IP, disclaimers, limitation of liability, and governing law survive termination",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">11</span>
              Governing Law & Dispute Resolution
            </h2>
            <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which TrendForge AI is registered, without regard to conflict-of-law principles. Any disputes arising under these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration in accordance with applicable arbitration rules. You waive any right to participate in class-action litigation.</p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">12</span>
              Changes to These Terms
            </h2>
            <p>We reserve the right to update these Terms at any time. Material changes will be communicated via email or an in-app notification at least 14 days before taking effect. Your continued use of the platform after changes become effective constitutes acceptance of the updated Terms. If you do not agree to the revised Terms, you must stop using the service and cancel your account.</p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black flex-shrink-0">13</span>
              Contact Us
            </h2>
            <p>If you have any questions, concerns, or requests regarding these Terms, please contact us:</p>
            <div className="mt-4 bg-gray-900 rounded-xl p-5 border border-gray-800">
              <p className="text-white font-bold">TrendForge AI — Legal Team</p>
              <p className="text-gray-400 text-sm mt-1">Email: <a href="mailto:legal@trendforge.ai" className="text-indigo-400 hover:text-indigo-300 transition-colors">legal@trendforge.ai</a></p>
              <p className="text-gray-400 text-sm mt-1">Support: <a href="mailto:support@trendforge.ai" className="text-indigo-400 hover:text-indigo-300 transition-colors">support@trendforge.ai</a></p>
            </div>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} TrendForge AI. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
