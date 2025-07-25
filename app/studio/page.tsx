import StudioHeroSection from "@/components/studio/StudioHeroSection";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import InklyStudio from "@/components/studio/InklyStudio";
import Footer from "@/components/Footer";

export default function StudioPage() {
  return (
    <div className="min-h-screen ...">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1">
          <StudioHeroSection />
          <div className="px-4 lg:px-8 pb-8">
            <InklyStudio />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
