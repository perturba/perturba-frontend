import Hero from "@/components/landing/Hero";
import InvisibleCloaking from "@/components/landing/InvisibleCloaking";
import HowToUse from "@/components/landing/HowToUse";
import Features from "@/components/landing/Features";
import Background from "@/components/landing/Background";
import ScrollContainer from "@/components/landing/ScrollContainer";

export default function Page() {
  return (
    <ScrollContainer>
      <Background />
      <Hero />
      <InvisibleCloaking />
      <HowToUse />
      <Features />
    </ScrollContainer>
  );
}
