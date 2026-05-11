import { ChevronDown } from "lucide-react";
import { YoziSymbolicOrganism } from "./components/YoziSymbolicOrganism.jsx";

export default function App() {
  return (
    <main className="min-h-screen bg-[#f6f3eb] text-[#171510]">
      <section className="relative flex min-h-screen overflow-hidden">
        <YoziSymbolicOrganism />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.42),rgba(246,243,235,0.15)_38%,rgba(246,243,235,0.78)_82%)]" />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 text-[11px] tracking-[0.32em] text-[#514a3b]/70 sm:px-8">
          <span>YOZI</span>
          <span className="hidden sm:inline">DAO.RUNTIME</span>
        </div>

        <div className="relative z-10 flex w-full items-center px-5 pb-28 pt-28 sm:px-8 lg:px-14">
          <div className="max-w-5xl">
            <p className="mb-5 text-xs uppercase tracking-[0.46em] text-[#746a55]">
              yozi.runtime.boot()
            </p>
            <h1 className="max-w-4xl text-balance font-serif text-[clamp(3.3rem,8vw,8.4rem)] leading-[0.86] tracking-normal text-[#15130f]">
              YOZI Dao Runtime
            </h1>
            <p className="mt-8 max-w-2xl text-balance text-xl leading-8 text-[#3a352c] sm:text-2xl sm:leading-9">
              Cultivate the Invisible System
            </p>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[#514a3b]/55">
          <span className="text-[10px] uppercase tracking-[0.34em]">descend</span>
          <ChevronDown aria-hidden="true" size={18} strokeWidth={1.4} />
        </div>
      </section>

      <section className="relative z-20 min-h-[64vh] border-t border-[#171510]/10 bg-[#ebe5d8] px-5 py-20 sm:px-8 lg:px-14">
        <div className="grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <p className="text-xs uppercase tracking-[0.42em] text-[#746a55]">runtime.field</p>
          <div className="space-y-7 text-lg leading-8 text-[#2b271f]">
            <p>
              A quiet symbolic layer for systems that grow inward first: breath,
              branch, kernel, void.
            </p>
            <div className="grid gap-3 text-sm text-[#514a3b] sm:grid-cols-4">
              <span>☰ kernel</span>
              <span>☵ breath</span>
              <span>☴ branch</span>
              <span>☷ void</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
