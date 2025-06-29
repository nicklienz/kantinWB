import Footer from "@/components/landingpage/footer";
import Guide from "@/components/landingpage/guide";
import Header from "@/components/landingpage/header";
import Hero from "@/components/landingpage/hero";
import Location from "@/components/landingpage/location";
import Tenants from "@/components/landingpage/tenants";
import LandingRedirect from "./landing-redirect";

export default function Home() {
  return (
    <LandingRedirect>
      <div>
        <Header />
        <Hero />
        <Tenants />
        <Guide />
        <Location />
        <Footer />
      </div>
    </LandingRedirect>
  );
}
