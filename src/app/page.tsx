import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#0a0f1d]">
      <div className="mb-8 w-full max-w-2xl flex justify-center">
        <img src="/logo.png" alt="Voice2Sheet by Digireach" className="h-32 md:h-48 w-full object-contain" />
      </div>
      <p className="text-lg text-blue-100 mb-8 max-w-lg text-center font-medium">
        The general-purpose, mobile-first, voice-driven CRM and data entry software.
      </p>
      <div className="flex gap-4">
        <Link href="/sign-in" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
          Sign In
        </Link>
        <Link href="/sign-up" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition">
          Get Started
        </Link>
      </div>
    </main>
  );
}
