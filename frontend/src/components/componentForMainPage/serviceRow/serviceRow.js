import React from "react";
import { Row, Col, Typography } from "antd";
import "./serviceRow.css";
import CustomCard from "../customCard/customCard";

const { Text } = Typography;

const ServiceRow = () => (
  <Row gutter={[16, 16]} style={{ padding: "64px 120px 80px 120px" }}>
    {/* Column for "Our Services" text */}
    <Col xs={24} lg={6}>
      <Text
        style={{
          fontWeight: 700,
          fontSize: 40,
          lineHeight: "65.35px",
          color: "#0F2442",
        }}
        level={2}
      >
        Our Services
      </Text>
    </Col>

    {/* Column for the Cards */}
    <Col xs={24} lg={18}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8} lg={8}>
          <CustomCard
            imgSrc="https://bmccprodstroac.blob.core.windows.net/uploads/2020/06/TOP2019_PeerMentoring_DSC3791-1.jpg"
            imgAlt="Full mentorship"
            title="Full mentorship"
            description="Tất cả các bạn mentee sẽ được các mentor trực tiếp theo sát và đồng hành cho đến khi nhận được offer internship. Có thể nhắn tin trực tiếp và đặt lịch hẹn với các mentor để hỏi về career, apply hoặc interview bất kì lúc nào"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <CustomCard
            imgSrc="https://cdn.corporatefinanceinstitute.com/assets/mock-interview-guide.jpeg"
            imgAlt="Mock Interview"
            title="Mock Interview"
            description="Các mentee có thể đặt lịch mock interview behavioral và technical bất kì lúc nào. Mentor sẽ giúp mentee hiểu rõ về công ty và vị trí để chuẩn bị kỹ lưỡng trước khi apply vị trí mình mong muốn"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <CustomCard
            imgSrc="https://assets.entrepreneur.com/content/3x2/2000/1683118869-GettyImages-850630688.jpg"
            imgAlt="Sửa Resume và Profile"
            title="Sửa Resume và Profile"
            description="Hoàn thiện resume và profile, sửa luận và personal statements cho apply các research labs, software và data internship, tham gia làm dự án full-stack cùng các mentee khác"
          />
        </Col>
        {/* Additional cards */}
        {/* <Col xs={24} sm={12} md={8} lg={4}>
          <CustomCard
            imgSrc="https://example.com/card4.jpg"
            imgAlt="Service 4"
            title="Service 4"
            description="Description for service 4"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <CustomCard
            imgSrc="https://example.com/card5.jpg"
            imgAlt="Service 5"
            title="Service 5"
            description="Description for service 5"
          />
        </Col> */}
      </Row>
    </Col>
  </Row>
);

export default ServiceRow;
