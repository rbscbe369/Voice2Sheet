export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: June 2026</p>
        
        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
            <p>At Voice2Sheet, a product of DIGIREACH TECHNOLOGIES, we collect information you provide directly to us when using our application, including audio recordings for transcription, images uploaded for receipts/charts, and your account email.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">2. How We Use Your Information</h2>
            <p>We use the collected data exclusively to provide, maintain, and improve the Voice2Sheet service. Your voice data is temporarily processed by our AI partners (Google Gemini) for transcription and formatting but is not used to train global AI models. Your final data is stored securely in your connected Supabase database.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">3. Third-Party Services</h2>
            <p>Voice2Sheet integrates with third-party services, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Clerk:</strong> For secure user authentication.</li>
              <li><strong>Supabase:</strong> As your personal cloud database.</li>
              <li><strong>Cloudinary:</strong> For secure image hosting.</li>
              <li><strong>Google Gemini:</strong> For AI-powered transcription correction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Data Security</h2>
            <p>We implement robust security measures to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact DIGIREACH TECHNOLOGIES.</p>
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
