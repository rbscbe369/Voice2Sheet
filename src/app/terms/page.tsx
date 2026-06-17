export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: June 2026</p>
        
        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p>By accessing or using Voice2Sheet, a product of DIGIREACH TECHNOLOGIES, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Description of Service</h2>
            <p>Voice2Sheet is a voice-enabled CRM application that transcribes speech, formats it using AI, and securely saves the data into databases and Excel sheets managed by the user.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">3. User Responsibilities</h2>
            <p>You are responsible for safeguarding the credentials associated with your Supabase, Cloudinary, and Clerk accounts. You agree not to use the service for any illegal or unauthorized purpose.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Intellectual Property</h2>
            <p>The software, design, and branding of Voice2Sheet are the exclusive property of DIGIREACH TECHNOLOGIES. You may not copy, modify, or distribute our intellectual property without explicit permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">5. Limitation of Liability</h2>
            <p>In no event shall DIGIREACH TECHNOLOGIES be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>&copy; 2026 DIGIREACH TECHNOLOGIES. All rights reserved.</p>
          <p className="mt-1">A Product of DIGIREACH TECHNOLOGIES</p>
        </div>
      </div>
    </div>
  );
}
