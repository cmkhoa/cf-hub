import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { ArrowRightOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import './BlogGrid.css';

const { Title, Paragraph } = Typography;

const BlogGrid = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Một chút bàn luận về Referral",
      excerpt: "Tìm hiểu cách tận dụng mạng lưới referral để thăng tiến trong sự nghiệp và xây dựng mối quan hệ chuyên nghiệp.",
      image: "/assets/mentors/linh_nguyen.jpg",
      category: "BLOG",
      author: "Linh Nguyen",
      date: "Dec 15, 2024",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Resources, project, và những câu chuyện chưa kể",
      excerpt: "Khám phá các tài nguyên và dự án giúp bạn phát triển kỹ năng và mở rộng mạng lưới chuyên nghiệp.",
      image: "/assets/mentors/tribui.jpg",
      category: "BLOG",
      author: "Tri Bui",
      date: "Dec 12, 2024",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "JOB SEARCH TIMELINE & STRATEGY FOR RECRUITING SEASON",
      excerpt: "Chiến lược tìm việc hiệu quả cho mùa tuyển dụng với timeline chi tiết và các tips thực tế.",
      image: "/assets/mentors/winnie.jpg",
      category: "BLOG",
      author: "Winnie Nguyen",
      date: "Dec 10, 2024",
      readTime: "8 min read"
    },
    {
      id: 4,
      title: "THAY ĐỔI LỚN TRONG CHÍNH SÁCH VISA MỸ TỪ 2/9/2025",
      excerpt: "Cập nhật những thay đổi quan trọng trong chính sách visa Mỹ và tác động đến sinh viên quốc tế.",
      image: "/assets/mentors/hoanguyen.jpg",
      category: "BLOG",
      author: "Hoa Nguyen",
      date: "Dec 8, 2024",
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "FINDING YOUR FIRST INTERNSHIP - ARE YOU READY?",
      excerpt: "Khởi điểm để kiếm internship từ năm nhất là gì? Chia sẻ kinh nghiệm và lời khuyên thực tế.",
      image: "/assets/mentors/linhnguyen.jpg",
      category: "BLOG",
      author: "Linh Nguyen",
      date: "Dec 5, 2024",
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "Machine Learning Engineer at Google - Interview Experience",
      excerpt: "Chia sẻ kinh nghiệm phỏng vấn cho vị trí Machine Learning Engineer tại Google và các tips thành công.",
      image: "/assets/mentors/tribui.jpg",
      category: "INTERVIEW",
      author: "Tri Bui",
      date: "Dec 3, 2024",
      readTime: "10 min read"
    }
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1, 4); // Chỉ hiển thị 3 posts thay vì tất cả

  return (
    <div className="blog-grid-section">
      <div className="container">

        <div className="blog-grid">
          {/* Featured Post */}
          <div className="featured-post">
            <div className="featured-image">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="featured-img"
              />
              <div className="featured-tag">{featuredPost.category}</div>
            </div>
            <div className="featured-content">
              <Title level={3} className="featured-title">
                {featuredPost.title}
              </Title>
              <Paragraph className="featured-excerpt">
                {featuredPost.excerpt}
              </Paragraph>
              <div className="featured-meta">
                <div className="meta-item">
                  <UserOutlined />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="meta-item">
                  <CalendarOutlined />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="meta-item">
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              <Button 
                type="primary" 
                className="read-more-btn"
                icon={<ArrowRightOutlined />}
              >
                Read More
              </Button>
            </div>
          </div>

          {/* Regular Posts Grid */}
          <div className="regular-posts">
            {regularPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-image">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="post-img"
                  />
                  <div className="post-tag">{post.category}</div>
                </div>
                <div className="post-content">
                  <Title level={4} className="post-title">
                    {post.title}
                  </Title>
                  <Paragraph className="post-excerpt">
                    {post.excerpt}
                  </Paragraph>
                  <div className="post-meta">
                    <div className="meta-item">
                      <UserOutlined />
                      <span>{post.author}</span>
                    </div>
                    <div className="meta-item">
                      <CalendarOutlined />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="view-all-section">
          <Button 
            type="default" 
            size="large"
            className="view-all-btn"
            icon={<ArrowRightOutlined />}
          >
            View All Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;
