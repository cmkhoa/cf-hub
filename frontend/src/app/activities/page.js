"use client";
import HeroSection from "@/components/componentForActivitiesPage/HeroSection/HeroSection";
import ImpactSection from "@/components/componentForActivitiesPage/ImpactSection/ImpactSection";
import Timeline from "@/components/componentForActivitiesPage/Timeline/Timeline";
import FooterComponent from "@/components/footer/Footer";
import HeaderComponent from "@/components/header/header";
import { Layout } from "antd";
import React, { useState } from "react";

const Activities = () => {
  const [current, setCurrent] = useState("activities");

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Layout>
      <HeaderComponent current={current} handleClick={handleClick} />
      <HeroSection />
      <Timeline />
      <ImpactSection />
      <FooterComponent />
    </Layout>
  );
};

export default Activities;
