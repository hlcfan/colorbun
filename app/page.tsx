import CategoryTabs from "@/components/CategoryTabs";
import ShapeGrid from "@/components/ShapeGrid";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-full bg-[#fdfbf7]">
      {/* Header / Nav */}
      <div className="flex-none z-10">
        <div className="pt-4 px-6 pb-2 flex items-center justify-between max-w-5xl mx-auto w-full">
          <h1 className="text-3xl font-black text-orange-400 tracking-tight flex items-center gap-2">
            🐰 ColorBun
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
