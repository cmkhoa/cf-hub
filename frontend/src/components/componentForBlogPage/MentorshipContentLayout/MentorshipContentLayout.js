import React, { useState } from "react";
import { Row, Col, Card, Typography, Layout, Input } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./MentorshipContentLayout.css";

const { Title, Text } = Typography;
const { Search } = Input;

const MentorshipContentLayout = ({ blogPosts }) => {
  const router = useRouter();
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchValue) ||
        post.excerpt.toLowerCase().includes(searchValue) ||
        post.date.toLowerCase().includes(searchValue)
    );
    setFilteredPosts(filtered);
  };

  return (
    <Layout className="mentorship-layout">
      {/* Hero Section */}
      <div className="hero-section">
        <Title level={2} className="hero-title" style={{ color: "white" }}>
          Explore Our Latest Blog Posts
        </Title>
        <Text className="hero-description">
          Những thông tin chuyên sâu mới nhất, đầy đủ, và sâu sắc để tìm việc và
          thăng tiến sự nghiệp trong lĩnh vực công nghệ
        </Text>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search
          placeholder="Search blog posts..."
          enterButton="Search"
          onSearch={handleSearch}
          className="search-input"
        />
      </div>

      <Row gutter={[16, 16]}>
        {/* Blog List (Left Column) */}
        <Col xs={24} md={16}>
          <div className="blog-list-container">
            {filteredPosts.map((post, index) => (
              <Card
                key={index}
                className="blog-card"
                onClick={() => router.push(`/blog/${post.id}`)}
              >
                <Row gutter={16}>
                  <Col xs={8} md={6}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="blog-image"
                    />
                  </Col>
                  <Col xs={16} md={18}>
                    <Text className="blog-date">{post.date}</Text>
                    <Title level={5}>
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </Title>
                    <Text>{post.excerpt}</Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </Col>

        {/* Sidebar for Popular Posts (Right Column) */}
        <Col xs={24} md={8}>
          <div className="sidebar">
            <Title level={5}>Popular Posts</Title>
            <ul className="sidebar-list">
              {blogPosts.slice(0, 5).map((post, index) => (
                <li key={index}>
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default MentorshipContentLayout;
