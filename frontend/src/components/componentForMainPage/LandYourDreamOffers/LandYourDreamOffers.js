import React from 'react';
import { Row, Col, Typography, Card, Statistic } from 'antd';
import { TrophyOutlined, TeamOutlined, BankOutlined, RocketOutlined } from '@ant-design/icons';
import './LandYourDreamOffers.css';

const { Title, Paragraph } = Typography;

const LandYourDreamOffers = () => {
  const stats = [
    {
      number: 10,
      label: 'offers in research labs and data programs',
      icon: <RocketOutlined />,
      color: '#52c41a'
    },
    {
      number: 28,
      label: 'job offers in the U.S.',
      icon: <TrophyOutlined />,
      color: '#1890ff'
    },
    {
      number: 5,
      label: 'new grad offers in the tech industry',
      icon: <BankOutlined />,
      color: '#722ed1'
    }
  ];

  const companies = [
    { name: 'Capital One', logo: '/assets/logos/capitalone.png' },
    { name: 'Uber', logo: '/assets/logos/uber.png' },
    { name: 'Smithfield', logo: '/assets/logos/smithfield.png' },
    { name: 'Unilever', logo: '/assets/logos/unilever.png' },
    { name: 'JP Morgan Chase', logo: '/assets/logos/jpmorgan.png' }
  ];

  const fields = [
    { name: 'Software', icon: '💻', color: '#1890ff' },
    { name: 'Data', icon: '📊', color: '#52c41a' },
    { name: 'Finance', icon: '💰', color: '#faad14' },
    { name: 'Consulting', icon: '🎯', color: '#722ed1' }
  ];

  return (
    <div className="land-dream-offers">
      <div className="container">
        {/* Main Content */}
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <div className="content-section">
              <div className="badge">
                <span>2024 SUCCESS STORY</span>
              </div>
              
              <Title level={1} className="main-title">
                Land Your Dream Offers
              </Title>
              
              <Paragraph className="main-description">
                In the first year of launching the 2024 program, we helped <strong>100 mentees</strong> secure 
                multiple interviews and job offers from major companies in the U.S. like Capital One, Uber, 
                Smithfield, Unilever, and JP Morgan Chase. Our mentors have experience in various fields 
                such as Software, Data, Finance, and Consulting.
              </Paragraph>

              {/* Statistics */}
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <Card key={index} className="stat-card">
                    <Statistic
                      value={stat.number}
                      valueStyle={{ 
                        color: stat.color, 
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                      }}
                      prefix={stat.icon}
                    />
                    <div className="stat-label">{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          </Col>
          
          <Col xs={24} lg={12}>
            <div className="visual-section">
              {/* Company Logos */}
              <div className="companies-section">
                <Title level={4} className="section-subtitle">
                  Our mentees work at
                </Title>
                <div className="company-logos">
                  {companies.map((company, index) => (
                    <div key={index} className="company-logo">
                      <div className="logo-placeholder">
                        {company.name.charAt(0)}
                      </div>
                      <span className="company-name">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fields of Expertise */}
              <div className="fields-section">
                <Title level={4} className="section-subtitle">
                  Mentorship expertise
                </Title>
                <div className="fields-grid">
                  {fields.map((field, index) => (
                    <div key={index} className="field-item" style={{ borderColor: field.color }}>
                      <div className="field-icon" style={{ color: field.color }}>
                        {field.icon}
                      </div>
                      <span className="field-name">{field.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Success Metrics */}
        <div className="success-metrics">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div className="metric-card">
                <div className="metric-icon">
                  <TeamOutlined />
                </div>
                <div className="metric-content">
                  <div className="metric-number">100+</div>
                  <div className="metric-label">Mentees Helped</div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="metric-card">
                <div className="metric-icon">
                  <TrophyOutlined />
                </div>
                <div className="metric-content">
                  <div className="metric-number">95%</div>
                  <div className="metric-label">Success Rate</div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="metric-card">
                <div className="metric-icon">
                  <BankOutlined />
                </div>
                <div className="metric-content">
                  <div className="metric-number">50+</div>
                  <div className="metric-label">Industry Mentors</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default LandYourDreamOffers;
