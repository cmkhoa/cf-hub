import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { MessageOutlined, MoreOutlined } from '@ant-design/icons';
import './SuccessStory.css';

const { Title, Text: AntText } = Typography;

const SuccessStory = () => {
  const categories = [
    {
      title: "CAREER TIPS & INTERVIEW PREP",
      posts: [
        {
          featured: true,
          image: "/assets/blank-profile-picture.jpg",
          tag: "SUCCESS STORY",
          title: "From Zero to Hero: How I Landed My Dream Job at Google",
          author: "BY SARAH NGUYEN",
          date: "SEPTEMBER 7, 2024",
          excerpt: "After 6 months of intensive preparation with CF Hub mentors, I successfully transitioned from a non-tech background to landing a Software Engineer role at Google. Here's my complete journey...",
          comments: 12
        },
        {
          image: "/assets/blank-profile-picture.jpg",
          title: "Resume Optimization: The Key to Getting Past ATS",
          date: "SEPTEMBER 5, 2024"
        },
        {
          image: "/assets/blank-profile-picture.jpg",
          title: "Interview Preparation: 30-Day Action Plan",
          date: "SEPTEMBER 4, 2024"
        }
      ]
    },
    {
      title: "PROFESSIONAL DEVELOPMENT",
      posts: [
        {
          featured: true,
          image: "/assets/blank-profile-picture.jpg",
          tag: "SUCCESS STORY",
          title: "Career Pivot Success: From Finance to Tech in 8 Months",
          author: "BY MICHAEL TRAN",
          date: "SEPTEMBER 4, 2024",
          excerpt: "After being laid off from my finance role, I used CF Hub's mentorship program to successfully pivot into tech. Now I'm a Senior Product Manager at a Fortune 500 company...",
          comments: 8
        },
        {
          image: "/assets/blank-profile-picture.jpg",
          title: "Networking Strategies That Actually Work",
          date: "AUGUST 25, 2024"
        },
        {
          image: "/assets/blank-profile-picture.jpg",
          title: "Building Your Personal Brand Online",
          date: "AUGUST 28, 2024"
        }
      ]
    },
    {
      title: "IMMIGRATION & VISA",
      posts: [
        {
          featured: true,
          image: "/assets/blank-profile-picture.jpg",
          tag: "SUCCESS STORY",
          title: "H-1B to Green Card: My Complete Immigration Journey",
          author: "BY LINH PHAM",
          date: "SEPTEMBER 4, 2024",
          excerpt: "Navigating the complex US immigration system seemed impossible until I found the right guidance through CF Hub. Here's how I successfully obtained my green card...",
          comments: 15
        },
        {
          image: "/assets/blank-profile-picture.jpg",
          title: "OPT to H-1B: Step-by-Step Guide",
          date: "AUGUST 31, 2024"
        }
      ]
    }
  ];

  return (
    <div className="success-story-section">
      <div className="container">
        <Row gutter={[32, 32]}>
          {categories.map((category, categoryIndex) => (
            <Col xs={24} lg={8} key={categoryIndex}>
              <div className="category-column">
                <div className="category-header">
                  <Title level={4} className="category-title">
                    {category.title}
                  </Title>
                  <MoreOutlined className="more-icon" />
                </div>

                <div className="posts-container">
                  {category.posts.map((post, postIndex) => (
                    <Card
                      key={postIndex}
                      className={`post-card ${post.featured ? 'featured-post' : 'regular-post'}`}
                      cover={
                        <div className="post-image-container">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="post-image"
                          />
                          {post.tag && (
                            <div className="post-tag">
                              {post.tag}
                            </div>
                          )}
                        </div>
                      }
                    >
                      <div className="post-content">
                        <Title level={post.featured ? 3 : 4} className="post-title">
                          {post.title}
                        </Title>
                        
                        {post.featured && (
                          <>
                            <div className="post-meta">
                              <AntText className="author">{post.author}</AntText>
                              <div className="meta-dot"></div>
                              <AntText className="date">{post.date}</AntText>
                              <div className="comments">
                                <MessageOutlined />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                            <AntText className="post-excerpt">
                              {post.excerpt}
                            </AntText>
                          </>
                        )}
                        
                        {!post.featured && (
                          <AntText className="post-date">{post.date}</AntText>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default SuccessStory;
