import React from "react";
import { Row, Col, Typography } from "antd";
import "./Community.css";
import Image from "next/image";
import { useLang } from "@/contexts/langprov";

const { Text } = Typography;

const Community = () => {
  const { t } = useLang();
  
  const handleClick = (url) => {
    window.open(url, "_blank"); // Opens the link in a new tab
  };

  return (
    <div className="community-container">
      <div className="community-title-wrapper">
        <Text className="community-title">{t("community.title")}</Text>
      </div>
      <Row gutter={[16, 16]} justify="center" className="community-row">
        <Col xs={24} sm={12} md={8} lg={6} className="image-col">
          <div
            className="clickable-image"
            onClick={() =>
              handleClick("https://www.facebook.com/CareerFoundationHub")
            }
          >
            <Image
              src="/assets/facebook-screenshot.png"
              alt="CF Hub Group Tech Community"
              className="community-image"
              width={300}
              height={200}
            />
            <Text className="image-description">{t("community.groupTech")}</Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} className="image-col">
          <div
            className="clickable-image"
            onClick={() =>
              handleClick("https://www.instagram.com/cf.hub_2025/")
            }
          >
            <Image
              src="/assets/instagram-screenshot.png"
              alt="CF Hub Instagram Tech"
              className="community-image"
              width={300}
              height={200}
            />
            <Text className="image-description">{t("community.instagramTech")}</Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Community;
