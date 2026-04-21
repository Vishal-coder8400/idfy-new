import './index.css';
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import PillarsSection from "./components/PillarsSection";
import TrustSection from "./components/TrustSection";
import WhyReportSection from "./components/WhyReportSection";
import PeopleSection from './components/PeopleSection';
import FraudSection from './components/FraudSection';
import Question from './components/Question';
import GeographicSection from './components/GeographicSection';
import Risk from './components/Risk';
import SpikesSection from './components/SpikeSection';
import ImpactSection from './components/ImpactSection';
import FraudImpact from './components/FraudImpact';
import CaseFilesSection from './components/CaseFile';
import ReferralRingSection from './components/RefferalRing';
import GpsSpoofer from './components/GpsSpoofer';
import WhyForward from './components/whyForward'
import Footer from './components/Footer';
import Workforce from './components/Workforce';
import HeroSection2 from './components/HeroSection2';
import UnifiedBackground from './components/UnifiedBackground';
export default function App() {
  return (
    <div>
      {/* <Navbar /> */}
      {/* <HeroSection /> */}
      <HeroSection2 />
      <StatsSection />
      <PillarsSection />
      <TrustSection />
      <WhyReportSection />
      <Workforce />
      <PeopleSection />
      <UnifiedBackground>
        <FraudSection />
        <Question />
        <GeographicSection />
        <Risk />
        <SpikesSection />
        <ImpactSection />
        <FraudImpact />
        <CaseFilesSection />
        <ReferralRingSection />
        <GpsSpoofer />
        <WhyForward />
        <Footer />
      </UnifiedBackground>
    </div>
  );
}
