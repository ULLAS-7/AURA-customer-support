import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 z-10">
        <h1 className="text-6xl font-bold text-slate-800 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The requested page could not be found. It might have been removed or the URL is incorrect.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
