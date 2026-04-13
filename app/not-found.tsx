// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center
                    px-6 text-center">
      <div className="text-7xl font-black text-brand-700 mb-4">404</div>
      <h1 className="text-xl font-bold text-slate-200 mb-2">Page not found</h1>
      <p className="text-slate-500 text-sm mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link href="/dashboard"
        className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold text-sm
                   hover:bg-brand-500 transition-colors">
        Go to Dashboard
      </Link>
    </div>
  );
}
