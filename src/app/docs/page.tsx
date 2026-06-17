import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/setup" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
          <ArrowLeft size={18} className="mr-2" /> Back to Setup Wizard
        </Link>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Account Setup Guide</h1>
          <p className="text-gray-500 mb-10 text-lg">Follow these detailed instructions to create your Supabase and Cloudinary accounts and connect them to Voice2Sheet.</p>
          
          <div className="space-y-12">
            {/* Supabase Section */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm">Step 1</span> 
                How to set up Supabase (Database)
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700">
                <ol className="list-decimal pl-5 space-y-3">
                  <li>Go to <a href="https://supabase.com/" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">supabase.com</a> and click <strong>"Start your project"</strong>.</li>
                  <li>Sign in using your GitHub account or Email.</li>
                  <li>Click <strong>"New Project"</strong>. Select a generous free-tier region near you, give it a name (e.g., "Voice2Sheet Database"), and set a strong database password. Wait a few minutes for the database to finish building.</li>
                  <li>Once your project dashboard loads, look at the left sidebar and click on the <strong>Gear Icon (Project Settings)</strong>.</li>
                  <li>In the Settings menu, click on <strong>API</strong>.</li>
                  <li>Here you will find two critical pieces of information:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Project URL:</strong> This looks like <code>https://abcdefg.supabase.co</code>. Copy this and paste it into the <strong>"Supabase URL"</strong> box in the Voice2Sheet Setup Wizard.</li>
                      <li><strong>Project API Keys:</strong> Under this section, find the key labeled <code>anon</code> <code>public</code>. It is a very long string starting with <code>eyJ...</code>. Copy this and paste it into the <strong>"Anon Public Key"</strong> box in the Voice2Sheet Setup Wizard.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Cloudinary Section */}
            <section>
              <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">Step 2</span> 
                How to set up Cloudinary (Image Storage)
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700">
                <ol className="list-decimal pl-5 space-y-3">
                  <li>Go to <a href="https://cloudinary.com/" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">cloudinary.com</a> and click <strong>"Sign Up For Free"</strong>.</li>
                  <li>Create an account and log into your Console Dashboard.</li>
                  <li>On the main dashboard page, look for your <strong>"Cloud Name"</strong> (it's usually a random word or your username). Copy this and paste it into the <strong>"Cloudinary Cloud Name"</strong> box in the Voice2Sheet Setup Wizard.</li>
                  <li>Next, look at the left sidebar menu and click on <strong>Settings</strong> (the gear icon at the bottom left).</li>
                  <li>Click on the <strong>"Upload"</strong> tab.</li>
                  <li>Scroll down to the section titled <strong>"Upload presets"</strong> and click <strong>"Add upload preset"</strong>.</li>
                  <li>In the "Upload preset name" box, type a simple name like <code>voice_images</code>.</li>
                  <li><strong>CRITICAL:</strong> Change the "Signing Mode" dropdown from "Signed" to <strong>"Unsigned"</strong>.</li>
                  <li>Click the <strong>Save</strong> button at the top right.</li>
                  <li>Copy the Upload preset name (e.g., <code>voice_images</code>) and paste it into the <strong>"Cloudinary Upload Preset"</strong> box in the Voice2Sheet Setup Wizard.</li>
                </ol>
              </div>
            </section>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-blue-800 font-bold mb-2">You're All Set!</h3>
              <p className="text-blue-900 text-sm">Once you have pasted these 4 values into the Setup Wizard, simply upload your blank Excel template and click "Finish & Save". Voice2Sheet will securely connect your accounts and generate your CRM instantly.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          <p>&copy; 2026 DIGIREACH TECHNOLOGIES. All rights reserved.</p>
          <p className="mt-1">A Product of DIGIREACH TECHNOLOGIES</p>
        </div>
      </div>
    </div>
  );
}
