import Hero from "@/components/Hero";
import InvisibleCloaking from "@/components/InvisibleCloaking";
import HowToUse from "@/components/HowToUse";
import Features from "@/components/Features";
import Background from "@/components/Background";
import AnimatedSection from "@/components/AnimatedSection";

export default function Page() {
  return (
    <main
      className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollBehavior: "smooth" }}
    >
      <Background />
      <AnimatedSection><Hero /></AnimatedSection>
      <AnimatedSection><InvisibleCloaking /></AnimatedSection>
      <AnimatedSection><HowToUse /></AnimatedSection>
      <AnimatedSection><Features /></AnimatedSection>
    </main>
  );
}
