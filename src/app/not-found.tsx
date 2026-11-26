import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">
          404 Error
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-neutral-900 font-sans sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-sm text-neutral-500 leading-relaxed">
          The product or page you are looking for may have been moved, renamed, or
          is no longer available in the catalog.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-colors"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
