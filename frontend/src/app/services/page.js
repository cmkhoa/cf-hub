"use client";
import ServicesTab from "@/components/componentForServicesPage/ServicesTab/ServiceCards";
import FooterComponent from "@/components/footer/Footer";
import HeaderComponent from "@/components/header/header";
import { Layout } from "antd";
import React, { useState } from "react";

const Services = () => {
  const [current, setCurrent] = useState("services");

  const handleClick = (e) => {
    setCurrent(e.key);
  };
  return (
    <Layout style={{ backgroundColor: "var(--background-color)" }}>
      <HeaderComponent current={current} handleClick={handleClick} />
      <ServicesTab />
      <FooterComponent />
    </Layout>
  );
};

export default Services;
