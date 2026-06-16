import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Daily Briefing</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-blue-800">Good morning!</h2>
        <p className="text-blue-700 mt-1 text-sm">
          You have 0 items today. Your schedule is clear.
        </p>
      </div>

      <div className="pt-6">
        <Link href="/record" className="block w-full py-4 bg-blue-600 text-white text-center rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition-colors">
          Start Voice Data Entry
        </Link>
      </div>
    </div>
  );
}
