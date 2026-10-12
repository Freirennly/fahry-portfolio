"use client";

import { MotionConfig } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Marquee } from "@/components/ui/Marquee";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Journey } from "@/components/sections/Journey";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Skills } from "@/components/sections/Skills";
import { Archive } from "@/components/sections/Archive";
import { Currently } from "@/components/sections/Currently";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main id="main-content" className="flex-1">
        {/* BLUE */} <Hero />

        {/* Identity band: a single marquee of the disciplines, framing the work. */}
        <Marquee items={["TECHNOLOGY", "CREATIVE", "MEDIA", "RESEARCH", "SYSTEMS"]} tone="ink" speed="slow" />

        {/* LIGHT */} <Intro />
        {/* LIGHT */} <Journey />
        {/* BLUE */} <SelectedWork />
        {/* LIGHT */} <Skills />
        {/* LIGHT */} <Archive />

        {/* Second marquee: a blue beat that hands the light field over to the dark one. */}
        <Marquee
          items={["VIDEOGRAFI", "WEBGIS", "OTOMASI", "KEPEMIMPINAN", "AGEN AI"]}
          tone="blue"
          speed="normal"
          separator="dot"
        />

        {/* BLUE */} <Currently />
        {/* BLUE */} <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
