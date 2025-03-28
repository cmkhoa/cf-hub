import React from "react";
import { Row, Col, Typography } from "antd";
import "./ImpactSection.css";

const { Title, Text } = Typography;

const ImpactSection = () => {
  return (
    <div className="impact-section">
      {/* First Layout */}
      <div className="impact-item">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Title level={2} className="impact-title">
              Improve Profile
            </Title>
            <Text className="impact-subtitle">Resume + LinkedIn</Text>
            <Text className="impact-description">
              Learn how to create a professional resume and get introduced to
              tools for building your profile. Receive specific feedback through
              individual resume reviews. Get support in creating a professional
              LinkedIn profile and guidance on how to upload projects and
              effectively use GitHub.
            </Text>
          </Col>
          <Col xs={24} md={12} className="image-column">
            <img
              src="http://res.cloudinary.com/dbqcioj2g/image/upload/v1730700037/pngoim1ab9al3dce0niv.jpg"
              alt="Profile Improvement"
              className="single-image"
            />
          </Col>
        </Row>
      </div>

      {/* Second Layout */}
      <div className="impact-item">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12} className="image-column">
            <img
              src="https://res.cloudinary.com/dbqcioj2g/image/upload/v1730700037/zl6k4t8jklgzvuppqs97.jpg"
              alt="Project Building"
              className="single-image"
            />
          </Col>
          <Col xs={24} md={12}>
            <Title level={2} className="impact-title">
              Build Technical Projects
            </Title>
            <Text className="impact-subtitle">Full-stack + Cloud + AI</Text>
            <Text className="impact-description">
              Explore popular programming languages for current internship jobs
              and trending tech stacks, including HTML/CSS/JavaScript, MERN
              stack, .NET stack + Azure, Python Flask + AWS, and Expo React
              Native. Learn how to build a personal project from scratch and
              effectively create a portfolio showcasing your projects.
            </Text>
          </Col>
        </Row>
      </div>

      {/* Third Layout */}
      <div className="impact-item">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Title level={2} className="impact-title">
              Mock Interviews
            </Title>
            <Text className="impact-subtitle">Behavioral + Technical</Text>
            <Text className="impact-description">
              Learn effective ways to prepare for behavioral interviews by
              researching the characteristics of each company and tailoring your
              answers. Get guidance on preparing for technical interviews
              through practice with LeetCode problems, object-oriented
              programming, and system design.
            </Text>
          </Col>
          <Col xs={24} md={12} className="image-column">
            <img
              src="http://res.cloudinary.com/dbqcioj2g/image/upload/v1730700037/fsty7qqzsj6ecnb5dpkt.png"
              alt="Mock Interview"
              className="single-image"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ImpactSection;
