import React from 'react';
import { Row, Col, Typography, Card, Tag, Avatar } from 'antd';
import { FireOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import './Trending.css';

const { Title, Paragraph } = Typography;

const Trending = () => {
  const trendingPosts = [
    {
      id: 1,
      title: "Machine Learning Engineer at Google: Công Việc Thực Sự Là Gì?",
      author: "Anh Van Dong Nguyen",
      date: "August 28, 2025",
      category: "BIG TECH, FORTUNE 500 & TOP COMPANIES",
      image: "/assets/mentors/linh_nguyen.jpg",
      views: 1250,
      trending: true,
      tags: ["Machine Learning", "Google", "Career"]
    },
    {
      id: 2,
      title: "Pricing Job Sharing",
      author: "Ashley Hoang",
      date: "August 27, 2025",
      category: "BLOG",
      image: "/assets/mentors/tribui.jpg",
      views: 890,
      trending: true,
      tags: ["Job Search", "Pricing", "Strategy"]
    },
    {
      id: 3,
      title: "SDE Amazon Interview Review",
      author: "Bach Nguyen",
      date: "August 28, 2025",
      category: "BIG TECH, FORTUNE 500 & TOP COMPANIES",
      image: "/assets/mentors/winnie.jpg",
      views: 2100,
      trending: true,
      tags: ["Amazon", "Interview", "SDE"]
    },
    {
      id: 4,
      title: "Career Mapping & Assessment Guide",
      author: "Mai Anh Pham",
      date: "September 5, 2025",
      category: "CAREER DEVELOPMENT",
      image: "/assets/mentors/hoanguyen.jpg",
      views: 1560,
      trending: false,
      tags: ["Career Mapping", "Assessment", "Development"]
    },
    {
      id: 5,
      title: "Resume Workshop: From Zero to Hero",
      author: "Linh Nguyen",
      date: "September 3, 2025",
      category: "WORKSHOP",
      image: "/assets/mentors/linhnguyen.jpg",
      views: 980,
      trending: false,
      tags: ["Resume", "Workshop", "Career"]
    },
    {
      id: 6,
      title: "Networking Strategies for International Students",
      author: "Tri Bui",
      date: "September 1, 2025",
      category: "NETWORKING",
      image: "/assets/mentors/tribui.jpg",
      views: 1340,
      trending: false,
      tags: ["Networking", "International Students", "Strategy"]
    }
  ];

  const featuredPost = trendingPosts[0];

  return (
    <div className="trending-section">
      <div className="container">
        {/* Section Header */}
        <div className="trending-header">
          <div className="trending-title-wrapper">
            <FireOutlined className="trending-icon" />
            <Title level={2} className="trending-title">TRENDING</Title>
          </div>
          <Paragraph className="trending-subtitle">
            Discover the most popular articles and insights from our community
          </Paragraph>
        </div>

        {/* Featured Trending Post */}
        <div className="featured-trending">
          <Card className="featured-trending-card">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <div className="featured-content">
                  <div className="featured-badge">
                    <FireOutlined />
                    <span>TRENDING NOW</span>
                  </div>
                  <div className="featured-category">{featuredPost.category}</div>
                  <Title level={3} className="featured-title">
                    {featuredPost.title}
                  </Title>
                  <div className="featured-meta">
                    <div className="author-info">
                      <Avatar size="small" src={featuredPost.image} />
                      <span className="author-name">BY {featuredPost.author.toUpperCase()}</span>
                    </div>
                    <div className="post-date">{featuredPost.date}</div>
                  </div>
                  <div className="featured-stats">
                    <div className="stat-item">
                      <EyeOutlined />
                      <span>{featuredPost.views} views</span>
                    </div>
                    <div className="stat-item">
                      <ClockCircleOutlined />
                      <span>5 min read</span>
                    </div>
                  </div>
                  <div className="featured-tags">
                    {featuredPost.tags.map((tag, index) => (
                      <Tag key={index} className="trending-tag">{tag}</Tag>
                    ))}
                  </div>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="featured-image">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="featured-img"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <FireOutlined className="overlay-icon" />
                      <span>Hot Topic</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Trending Posts Grid */}
        <div className="trending-grid">
          <Row gutter={[24, 24]}>
            {trendingPosts.slice(1).map((post) => (
              <Col xs={24} md={12} lg={8} key={post.id}>
                <Card className="trending-card">
                  <div className="trending-card-image">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="trending-img"
                    />
                    {post.trending && (
                      <div className="trending-badge">
                        <FireOutlined />
                        <span>TRENDING</span>
                      </div>
                    )}
                    <div className="category-badge">{post.category}</div>
                  </div>
                  <div className="trending-card-content">
                    <Title level={4} className="trending-card-title">
                      {post.title}
                    </Title>
                    <div className="trending-card-meta">
                      <div className="author-info">
                        <Avatar size="small" src={post.image} />
                        <span className="author-name">BY {post.author.toUpperCase()}</span>
                      </div>
                      <div className="post-date">{post.date}</div>
                    </div>
                    <div className="trending-card-stats">
                      <div className="stat-item">
                        <EyeOutlined />
                        <span>{post.views}</span>
                      </div>
                      <div className="stat-item">
                        <ClockCircleOutlined />
                        <span>3 min</span>
                      </div>
                    </div>
                    <div className="trending-card-tags">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Tag key={index} className="trending-tag-small">{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* View All Button */}
        <div className="trending-actions">
          <Link href="/blog">
            <button className="view-all-trending-btn">
              View All Trending Posts
              <FireOutlined />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Trending;
