import { LandingApp } from "@/components/landing/LandingApp";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-hanji">
      <LandingApp />
      <SiteFooter />
    </main>
  );
}
