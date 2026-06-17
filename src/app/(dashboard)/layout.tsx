import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Show when="signed-in">
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
        
        {/* Modern Dotted Grid Background */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Vibrant Glassmorphism Glowing Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none z-0 mix-blend-multiply" />
        <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-500/20 blur-[150px] pointer-events-none z-0 mix-blend-multiply" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none z-0 mix-blend-multiply" />
        
        <nav className="relative z-10">
          <header className="py-4 px-6 bg-[#0a0f1d] border-b border-gray-800 flex justify-between items-center shadow-md">
            <Link href="/dashboard" className="flex items-center">
              <img src="/logo.png" alt="Digireach Technologies" className="h-16 md:h-20 w-auto object-contain drop-shadow-xl" />
            </Link>
            <div className="flex items-center gap-6">
              <NotificationBell />
              <Link href="/history" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">History</Link>
              <Link href="/setup" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">Settings</Link>
              <UserButton />
            </div>
          </header>
        </nav>
        <main className="flex-1 max-w-md mx-auto w-full p-4 sm:max-w-2xl sm:p-6 lg:max-w-4xl relative z-10">
          {children}
        </main>
        
        {/* Global Footer */}
        <footer className="relative z-10 py-6 text-center border-t border-gray-200/50 mt-auto backdrop-blur-sm bg-white/30">
          <div className="flex justify-center gap-6 mb-2">
            <Link href="/docs" className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition">Setup Guide</Link>
            <Link href="/privacy" className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition">Terms of Service</Link>
          </div>
          <p className="text-xs font-bold text-gray-600 tracking-wide uppercase">
            &copy; 2026 DIGIREACH TECHNOLOGIES. All rights reserved.
          </p>
          <p className="text-[10px] font-semibold text-blue-600 mt-1 uppercase tracking-widest">
            "A Product of DIGIREACH TECHNOLOGIES"
          </p>
        </footer>
      </div>
    </Show>
  );
}
