import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#0a0f1d]">
      <div className="mb-8 w-full max-w-2xl flex justify-center">
        <img src="/logo.png" alt="Voice2Sheet by Digireach" className="h-32 md:h-48 w-full object-contain" />
      </div>
      <p className="text-lg text-blue-100 mb-8 max-w-lg text-center font-medium">
        The general-purpose, mobile-first, voice-driven CRM and data entry software.
      </p>
      <div className="flex gap-4 mb-20">
        <Link href="/sign-in" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
          Sign In
        </Link>
        <Link href="/sign-up" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition">
          Get Started
        </Link>
      </div>

      {/* Global Footer */}
      <footer className="absolute bottom-0 w-full py-6 text-center border-t border-gray-800 bg-[#0a0f1d]">
        <div className="flex justify-center gap-6 mb-2">
          <Link href="/docs" className="text-xs font-semibold text-gray-400 hover:text-white transition">Setup Guide</Link>
          <Link href="/privacy" className="text-xs font-semibold text-gray-400 hover:text-white transition">Privacy Policy</Link>
          <Link href="/terms" className="text-xs font-semibold text-gray-400 hover:text-white transition">Terms of Service</Link>
        </div>
        <p className="text-xs font-bold text-gray-500 tracking-wide uppercase">
          &copy; 2026 DIGIREACH TECHNOLOGIES. All rights reserved.
        </p>
        <p className="text-[10px] font-semibold text-blue-500 mt-1 uppercase tracking-widest">
          "A Product of DIGIREACH TECHNOLOGIES"
        </p>
      </footer>
    </main>
  );
}
