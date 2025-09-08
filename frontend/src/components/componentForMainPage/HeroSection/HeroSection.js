import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { PlayCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Image from 'next/image';
import './HeroSection.css';

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  return (
    <div className="hero-section">
      {/* Main Hero Content */}
      <div className="hero-main">
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <div className="hero-content">
              <div className="hero-badge">
                <span>🚀 NEW PROGRAM</span>
              </div>
              
              <Title level={1} className="hero-title">
                EMPOWER VIETNAMESE STUDENTS & PROFESSIONALS IN THE U.S.
              </Title>
              
              <Paragraph className="hero-description">
                Join our comprehensive mentorship program designed specifically for Vietnamese students and professionals 
                seeking to advance their careers in the United States. Get personalized guidance from industry experts 
                and build your professional network.
              </Paragraph>
              
              <div className="hero-actions">
                <Button 
                  type="primary" 
                  size="large"
                  className="cta-button"
                  icon={<ArrowRightOutlined />}
                >
                  Start Your Journey
                </Button>
                
                <Button 
                  size="large"
                  className="secondary-button"
                  icon={<PlayCircleOutlined />}
                >
                  Watch Demo
                </Button>
              </div>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Students Helped</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Industry Mentors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} lg={12}>
            <div className="hero-image-container">
              <div className="hero-image-wrapper">
                <Image
                  src="/assets/bg.jpg"
                  alt="Vietnamese professionals networking"
                  fill
                  className="hero-image"
                  priority
                />
                <div className="hero-image-overlay">
                  <div className="floating-card">
                    <div className="card-icon">💼</div>
                    <div className="card-content">
                      <div className="card-title">Career Success</div>
                      <div className="card-subtitle">Join 500+ successful graduates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      
      {/* Featured Articles Preview */}
      <div className="featured-articles">
        <div className="container">
          <Title level={3} className="section-title">Latest Insights</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="article-card">
                <div className="article-image">
                  <Image
                    src="/assets/mentors/linh_nguyen.jpg"
                    alt="Referral discussion"
                    width={300}
                    height={200}
                    className="article-img"
                  />
                  <div className="article-tag">BLOG</div>
                </div>
                <div className="article-content">
                  <Title level={4} className="article-title">
                    Một chút bàn luận về Referral
                  </Title>
                  <Paragraph className="article-excerpt">
                    Tìm hiểu cách tận dụng mạng lưới referral để thăng tiến trong sự nghiệp...
                  </Paragraph>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div className="article-card">
                <div className="article-image">
                  <Image
                    src="/assets/mentors/tribui.jpg"
                    alt="Resources and projects"
                    width={300}
                    height={200}
                    className="article-img"
                  />
                  <div className="article-tag">BLOG</div>
                </div>
                <div className="article-content">
                  <Title level={4} className="article-title">
                    Resources, project, và những câu chuyện chưa kể
                  </Title>
                  <Paragraph className="article-excerpt">
                    Khám phá các tài nguyên và dự án giúp bạn phát triển kỹ năng...
                  </Paragraph>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div className="article-card">
                <div className="article-image">
                  <Image
                    src="/assets/mentors/winnie.jpg"
                    alt="Job search strategy"
                    width={300}
                    height={200}
                    className="article-img"
                  />
                  <div className="article-tag">BLOG</div>
                </div>
                <div className="article-content">
                  <Title level={4} className="article-title">
                    JOB SEARCH TIMELINE & STRATEGY FOR RECRUITING SEASON
                  </Title>
                  <Paragraph className="article-excerpt">
                    Chiến lược tìm việc hiệu quả cho mùa tuyển dụng...
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
