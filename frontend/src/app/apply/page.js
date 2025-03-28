"use client";
import React, { useState } from "react";
import { Layout } from "antd";
import HeaderComponent from "@/components/header/header";
import FooterComponent from "@/components/footer/Footer";
import ApplySection from "@/components/componentForApplyPage/ApplySection/ApplySection";

const ApplyPage = () => {
  const [current, setCurrent] = useState("apply");

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Layout>
      <HeaderComponent current={current} handleClick={handleClick} />
      <ApplySection />
      <FooterComponent />
    </Layout>
  );
};

export default ApplyPage;
