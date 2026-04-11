import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — TrendForge AI",
  description: "Learn how TrendForge AI collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "March 28, 2026";
const EFFECTIVE_DATE = "March 28, 2026";

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-6">
            Legal Document
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-4">Privacy Policy</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>Effective: <span className="text-gray-400 font-medium">{EFFECTIVE_DATE}</span></span>
            <span>Last Updated: <span className="text-gray-400 font-medium">{LAST_UPDATED}</span></span>
          </div>
          <p className="mt-6 text-gray-400 leading-relaxed">
            Your privacy matters to us. This Privacy Policy explains how TrendForge AI collects, uses, shares, and protects information about you when you use our platform. By using TrendForge AI, you agree to the practices described in this policy.
          </p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">1</span>
              Who We Are
            </h2>
            <p>TrendForge AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the TrendForge AI platform — an AI-powered SaaS tool for print-on-demand niche discovery, slogan generation, and publishing automation. We are the data controller responsible for your personal information.</p>
            <p className="mt-3">For privacy-related inquiries, please contact us at <a href="mailto:privacy@trendforge.ai" className="text-emerald-400 hover:text-emerald-300 transition-colors">privacy@trendforge.ai</a>.</p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">2</span>
              Information We Collect
            </h2>
            <p>We collect information in the following ways:</p>

            <div className="mt-4 space-y-4">
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h3 className="text-white font-bold text-sm mb-3">2.1 — Information You Provide</h3>
                <ul className="space-y-2">
                  {[
                    "Account registration data: name, email address, password (hashed), and profile information",
                    "Billing information: processed and stored by Stripe — we never store raw card numbers",
                    "Workspace inputs: niche names, audience descriptions, campaign settings, and preferences you enter into the platform",
                    "Support correspondence: messages you send to our team via email or in-app channels",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h3 className="text-white font-bold text-sm mb-3">2.2 — Information Collected Automatically</h3>
                <ul className="space-y-2">
                  {[
                    "Usage data: features accessed, pages viewed, actions taken, and time spent on platform",
                    "AI interaction logs: inputs submitted to generation features (anonymised after 30 days)",
                    "Device and browser information: IP address, browser type, operating system, and device identifiers",
                    "Session tokens and authentication data for secure login management",
                    "Error logs and performance diagnostics for platform stability",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h3 className="text-white font-bold text-sm mb-3">2.3 — AI & Generation Data</h3>
                <ul className="space-y-2">
                  {[
                    "Niche discovery queries and trend search terms",
                    "Slogan generation inputs and AI-generated outputs (retained for scoring model improvement)",
                    "Pattern performance signals: which slogans you save, export, or discard (used to improve ranking)",
                    "Workspace history: saved niches, collections, and campaign configurations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">3</span>
              How We Use Your Information
            </h2>
            <p>We use collected information to:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "Provide, operate, maintain, and improve the TrendForge AI platform",
                "Personalize your experience and remember workspace settings and preferences",
                "Process payments and manage subscription billing through Stripe",
                "Send transactional emails (account confirmation, billing notices, password resets)",
                "Send product updates and feature announcements (you may opt out at any time)",
                "Improve our AI models using anonymized and aggregated interaction data",
                "Detect, prevent, and respond to fraud, abuse, and security incidents",
                "Comply with legal obligations and enforce our Terms of Service",
                "Provide customer support and respond to your inquiries",
                "Generate de-identified usage statistics and product analytics",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-300 text-sm font-semibold mb-1">🔒 AI Training Note</p>
              <p className="text-emerald-200/70 text-sm">We may use de-identified, aggregated slogan performance signals (not linked to you personally) to improve our internal scoring models. We do not sell your individual generation data or use it to train third-party AI systems.</p>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">4</span>
              Legal Basis for Processing (GDPR)
            </h2>
            <p>If you are located in the European Economic Area (EEA), UK, or other jurisdictions with similar requirements, our legal bases for processing your data are:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "Contract performance — processing necessary to provide the service you subscribed to",
                "Legitimate interests — improving platform quality, preventing fraud, ensuring security",
                "Legal obligation — compliance with applicable laws and regulations",
                "Consent — for optional communications such as marketing emails (withdraw at any time)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">5</span>
              Information Sharing & Disclosure
            </h2>
            <p>We do not sell, rent, or trade your personal information. We may share data only in the following limited circumstances:</p>

            <div className="mt-4 space-y-3">
              {[
                {
                  title: "Service Providers",
                  desc: "We share data with trusted vendors who assist in operating the platform, including Stripe (payments), database hosting providers, and email delivery services. All processors are bound by data processing agreements.",
                },
                {
                  title: "AI Processing (OpenAI)",
                  desc: "Text inputs you submit to generation features are processed by OpenAI's API. These inputs are subject to OpenAI's data usage policies. We do not send personally identifiable information to OpenAI beyond the content you explicitly input.",
                },
                {
                  title: "Legal Requirements",
                  desc: "We may disclose information if required by law, court order, or government request, or to protect the rights, property, or safety of TrendForge AI, our users, or the public.",
                },
                {
                  title: "Business Transfers",
                  desc: "In the event of a merger, acquisition, or asset sale, your data may be transferred. We will notify you before your data becomes subject to a materially different privacy policy.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">6</span>
              Cookies & Tracking Technologies
            </h2>
            <p>TrendForge AI uses cookies and similar tracking technologies to maintain sessions, remember preferences, and analyze platform usage. Types of cookies we use:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "Essential cookies — required for login sessions, authentication tokens, and security",
                "Preference cookies — remember your UI settings, workspace configuration, and display preferences",
                "Analytics cookies — understand which features are most used and improve the product (de-identified)",
                "We do not use advertising or cross-site tracking cookies",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">You may disable non-essential cookies via your browser settings, though this may affect platform functionality.</p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">7</span>
              Data Retention
            </h2>
            <p>We retain your information for as long as necessary to provide the service and comply with our legal obligations:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "Account data: retained while your account is active and for up to 12 months after deletion",
                "AI generation logs: anonymized after 30 days; fully deleted within 12 months",
                "Billing records: retained for 7 years as required by financial regulations",
                "Support correspondence: retained for 3 years",
                "De-identified analytics: may be retained indefinitely in aggregated form",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">8</span>
              Your Rights & Choices
            </h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { right: "Right of Access", desc: "Request a copy of all personal data we hold about you" },
                { right: "Right to Rectification", desc: "Request correction of inaccurate or incomplete data" },
                { right: "Right to Erasure", desc: "Request deletion of your personal data ('right to be forgotten')" },
                { right: "Right to Portability", desc: "Receive your data in a structured, machine-readable format" },
                { right: "Right to Object", desc: "Object to processing based on legitimate interests" },
                { right: "Right to Restrict", desc: "Request limitation of processing under certain conditions" },
                { right: "Opt-out of Marketing", desc: "Unsubscribe from marketing emails at any time via the link in any email" },
                { right: "Withdraw Consent", desc: "Withdraw consent for any processing based on consent at any time" },
              ].map(({ right, desc }) => (
                <div key={right} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-white text-sm font-bold">{right}</p>
                  <p className="text-gray-400 text-xs mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">To exercise any of these rights, contact us at <a href="mailto:privacy@trendforge.ai" className="text-emerald-400 hover:text-emerald-300 transition-colors">privacy@trendforge.ai</a>. We will respond within 30 days. We may need to verify your identity before processing your request.</p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">9</span>
              Data Security
            </h2>
            <p>We take data security seriously and implement industry-standard measures to protect your information:</p>
            <ul className="mt-3 space-y-2 ml-4">
              {[
                "All data transmitted between your browser and our servers is encrypted via TLS/HTTPS",
                "Passwords are hashed using bcrypt — we never store plaintext credentials",
                "Database access is restricted to authorized infrastructure with access controls and audit logging",
                "Payment data is handled exclusively by Stripe using PCI-DSS compliant infrastructure",
                "We conduct regular security reviews and dependency audits",
                "Employee access to production data is on a need-to-know basis",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">No system is 100% secure. In the event of a data breach affecting your rights, we will notify you within 72 hours as required by applicable law.</p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">10</span>
              International Data Transfers
            </h2>
            <p>TrendForge AI operates globally. If you are located in the EEA, UK, or other regions with data transfer restrictions, your information may be transferred to and processed in countries that may not have equivalent data protection laws. Where required, we use standard contractual clauses (SCCs) or other approved transfer mechanisms to ensure your data is adequately protected.</p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">11</span>
              Children&apos;s Privacy
            </h2>
            <p>TrendForge AI is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us at <a href="mailto:privacy@trendforge.ai" className="text-emerald-400 hover:text-emerald-300 transition-colors">privacy@trendforge.ai</a> and we will delete it promptly.</p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">12</span>
              Changes to This Policy
            </h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by email or via an in-app notification before they take effect. The &quot;Last Updated&quot; date at the top of this page reflects the most recent revision. We encourage you to review this policy periodically.</p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">13</span>
              Contact & Complaints
            </h2>
            <p>For privacy-related questions, data requests, or complaints:</p>
            <div className="mt-4 bg-gray-900 rounded-xl p-5 border border-gray-800">
              <p className="text-white font-bold">TrendForge AI — Privacy Team</p>
              <p className="text-gray-400 text-sm mt-1">Email: <a href="mailto:privacy@trendforge.ai" className="text-emerald-400 hover:text-emerald-300 transition-colors">privacy@trendforge.ai</a></p>
              <p className="text-gray-400 text-sm mt-1">Response time: within 30 calendar days</p>
            </div>
            <p className="mt-4 text-sm">If you are located in the EEA, you also have the right to lodge a complaint with your local supervisory authority (Data Protection Authority). A full list of EU DPAs can be found at <a href="https://edpb.europa.eu" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">edpb.europa.eu</a>.</p>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} TrendForge AI. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
