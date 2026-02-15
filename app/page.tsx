import CategoryTabs from "@/components/CategoryTabs";
import ShapeGrid from "@/components/ShapeGrid";

export default function Home() {
  return (
    <main className="flex flex-col h-full w-full">
      {/* Header / Nav */}
      <div className="flex-none z-10">
        <div className="pt-6 px-6 pb-2 flex items-center justify-center max-w-5xl mx-auto w-full">
          <h1 className="text-4xl font-black text-orange-500 tracking-wide flex items-center gap-3 drop-shadow-sm font-fredoka" style={{ textShadow: '2px 2px 0px #fff, 4px 4px 0px rgba(0,0,0,0.1)' }}>
            <span className="text-5xl">🐰</span> ColorBun
          </h1>
          {/* Settings or info could go here */}
        </div>
        <CategoryTabs />
      </div>

      {/* Main Content */}
      <ShapeGrid />
    </main>
  );
}
