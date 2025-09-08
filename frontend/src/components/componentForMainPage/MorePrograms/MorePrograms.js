import React from 'react';
import { Row, Col, Typography, Card, Button } from 'antd';
import { ArrowRightOutlined, CalendarOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import './MorePrograms.css';

const { Title, Paragraph } = Typography;

const MorePrograms = () => {
  const programs = [
    {
      id: 1,
      title: "Viet Career Conference 2025",
      description: "Join our annual conference featuring industry leaders, networking opportunities, and career development workshops.",
      image: "/assets/mentors/linh_nguyen.jpg",
      date: "August 2025",
      participants: "500+",
      type: "CONFERENCE",
      featured: true
    },
    {
      id: 2,
      title: "Mentorship Program",
      description: "Get paired with experienced professionals for personalized career guidance and industry insights.",
      image: "/assets/mentors/tribui.jpg",
      date: "Ongoing",
      participants: "100+",
      type: "MENTORSHIP"
    },
    {
      id: 3,
      title: "Workshop Series",
      description: "Monthly workshops covering resume building, interview preparation, and technical skills development.",
      image: "/assets/mentors/winnie.jpg",
      date: "Monthly",
      participants: "50+",
      type: "WORKSHOP"
    },
    {
      id: 4,
      title: "Networking Events",
      description: "Connect with fellow Vietnamese professionals and expand your professional network.",
      image: "/assets/mentors/hoanguyen.jpg",
      date: "Bi-weekly",
      participants: "200+",
      type: "NETWORKING"
    }
  ];

  const upcomingEvents = [
    {
      title: "Resume Workshop",
      date: "Dec 20, 2024",
      time: "6:00 PM PST",
      type: "WORKSHOP"
    },
    {
      title: "Tech Interview Prep",
      date: "Dec 25, 2024",
      time: "7:00 PM PST",
      type: "WORKSHOP"
    },
    {
      title: "Networking Mixer",
      date: "Jan 5, 2025",
      time: "6:30 PM PST",
      type: "NETWORKING"
    }
  ];

  return (
    <div className="more-programs">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <Title level={2} className="section-title">
            More Programs
          </Title>
          <Paragraph className="section-subtitle">
            Discover our comprehensive range of programs designed to accelerate your career growth
          </Paragraph>
        </div>

        {/* Featured Program */}
        <div className="featured-program">
          <Card className="featured-card">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <div className="featured-content">
                  <div className="program-badge featured">
                    {programs[0].type}
                  </div>
                  <Title level={3} className="featured-title">
                    {programs[0].title}
                  </Title>
                  <Paragraph className="featured-description">
                    {programs[0].description}
                  </Paragraph>
                  <div className="featured-meta">
                    <div className="meta-item">
                      <CalendarOutlined />
                      <span>{programs[0].date}</span>
                    </div>
                  <div className="meta-item">
                    <UserOutlined />
                    <span>{programs[0].participants} participants</span>
                  </div>
                  </div>
                  <Button 
                    type="primary" 
                    size="large"
                    className="featured-btn"
                    icon={<ArrowRightOutlined />}
                  >
                    Learn More
                  </Button>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="featured-image">
                  <Image
                    src={programs[0].image}
                    alt={programs[0].title}
                    fill
                    className="featured-img"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <TrophyOutlined className="overlay-icon" />
                      <span>Featured Event</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Programs Grid */}
        <div className="programs-grid">
          <Row gutter={[24, 24]}>
            {programs.slice(1).map((program) => (
              <Col xs={24} md={12} lg={8} key={program.id}>
                <Card className="program-card">
                  <div className="program-image">
                    <Image
                      src={program.image}
                      alt={program.title}
                      width={300}
                      height={200}
                      className="program-img"
                    />
                    <div className="program-badge">
                      {program.type}
                    </div>
                  </div>
                  <div className="program-content">
                    <Title level={4} className="program-title">
                      {program.title}
                    </Title>
                    <Paragraph className="program-description">
                      {program.description}
                    </Paragraph>
                    <div className="program-meta">
                      <div className="meta-item">
                        <CalendarOutlined />
                        <span>{program.date}</span>
                      </div>
                    <div className="meta-item">
                      <UserOutlined />
                      <span>{program.participants}</span>
                    </div>
                    </div>
                    <Button 
                      type="default" 
                      className="program-btn"
                      icon={<ArrowRightOutlined />}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Upcoming Events */}
        <div className="upcoming-events">
          <Title level={3} className="events-title">
            Upcoming Events
          </Title>
          <div className="events-list">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-details">
                    <span className="event-date">{event.date}</span>
                    <span className="event-time">{event.time}</span>
                  </div>
                </div>
                <div className="event-type">
                  {event.type}
                </div>
              </div>
            ))}
          </div>
          <div className="events-actions">
            <Button 
              type="primary" 
              size="large"
              className="view-all-btn"
              icon={<ArrowRightOutlined />}
            >
              View All Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorePrograms;
