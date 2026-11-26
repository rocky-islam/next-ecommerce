import Link from "next/link";
import { Home } from "lucide-react";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Magnetic } from "@/components/motion/Magnetic";
import { RollText } from "@/components/motion/RollText";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        {/* Oversized floating numerals (decorative) */}
        <div aria-hidden="true" className="animate-float select-none">
          <SplitText
            as="div"
            trigger="mount"
            text="404"
            stagger={0}
            className="text-[7rem] sm:text-[9rem] leading-none font-black tracking-[-0.06em] text-neutral-100"
          />
        </div>
        <StaggerGroup trigger="mount" delay={250} step={90} className="-mt-6 sm:-mt-8 relative">
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
            <Magnetic>
              <Link
                href="/"
                className="group btn-shine inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <RollText>Return Home</RollText>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-colors"
              >
                <RollText>Browse Products</RollText>
              </Link>
            </Magnetic>
          </div>
        </StaggerGroup>
      </div>
    </div>
  );
}
