import { YoziHero } from "./components/YoziHero";

export default function App() {
  return (
    <main className="min-h-screen bg-[#f6f3eb] text-[#171510]">
      <YoziHero />

      <section className="relative z-20 border-t border-[#171510]/10 bg-[#ebe5d8] px-5 py-20 sm:px-8 lg:px-14">
        <div className="grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <p className="text-xs uppercase tracking-[0.42em] text-[#746a55]">runtime.field</p>
          <div className="space-y-7 text-lg leading-8 text-[#2b271f]">
            <p>
              A quiet symbolic landscape for systems that move forward through
              mist, distance, and invisible structure.
            </p>
            <div className="grid gap-3 text-sm text-[#514a3b] sm:grid-cols-4">
              <span>road :: dao</span>
              <span>mist / breath</span>
              <span>mountain.kernel</span>
              <span>traveler -&gt; void</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
