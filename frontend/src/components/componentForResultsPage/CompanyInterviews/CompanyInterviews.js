import React from "react";
import { Row, Col, Typography, Card } from "antd";
import "./CompanyInterviews.css";

const { Title, Text } = Typography;

const internships = [
  "Apple",
  "Bloomberg",
  "Robinhood",
  "Bank of America",
  "Paypal",
  "Microsoft",
  "Meta",
  "Palantir",
  "Ebay",
  "Hubspot",
  "Morgan Stanley",
  "Plaid",
  "Goldman Sachs",
  "Dell",
  "Wayfair",
  "TikTok",
];

const newGradPositions = [
  "Bloomberg",
  "Stripe",
  "Meta",
  "Arista Network",
  "Affirm",
  "TikTok",
];

const dataPositions = [
  "Meta",
  "Charles Schwab",
  "HubSpot",
  "TikTok",
  "Ebay",
  "Bain",
  "Microsoft",
  "The Trade Desk",
  "Amazon",
];

const CompanyInterviews = () => {
  return (
    <div className="company-interviews-section">
      <Title level={2} className="section-title">
        Top Companies Offering Interviews
      </Title>

      {/* Software Engineer Internships */}
      <div className="company-category">
        <Title level={3} className="category-title">
          Software Engineer Internships
        </Title>
        <Row gutter={[16, 16]}>
          {internships.map((company, index) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={3} key={index}>
              <Card className="company-card">
                <Text>{company}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Software Engineer New Grad Positions */}
      <div className="company-category">
        <Title level={3} className="category-title">
          Software Engineer New Grad Positions
        </Title>
        <Row gutter={[16, 16]}>
          {newGradPositions.map((company, index) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={3} key={index}>
              <Card className="company-card">
                <Text>{company}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Data Related Positions */}
      <div className="company-category">
        <Title level={3} className="category-title">
          Data Related Positions
        </Title>
        <Row gutter={[16, 16]}>
          {dataPositions.map((company, index) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={3} key={index}>
              <Card className="company-card">
                <Text>{company}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default CompanyInterviews;
