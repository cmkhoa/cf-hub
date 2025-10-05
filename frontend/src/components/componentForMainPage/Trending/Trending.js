import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Card, Tag, Avatar, Spin } from 'antd';
import { FireOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import './Trending.css';
import { API_ENDPOINTS } from '@/config/api';
import { useLang } from "@/contexts/langprov";

const { Title, Paragraph } = Typography;

const Trending = () => {
  const { t } = useLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let cancelled = false;
    async function load(){
      setLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.blog.posts}?status=published&sort=views&limit=7`);
        const data = await res.json();
        if(!cancelled){ setPosts(data.items || []); }
      } catch(err){ if(!cancelled) console.error('Load trending failed', err); }
      finally { if(!cancelled) setLoading(false); }
    }
    load();
    return ()=>{ cancelled = true; };
  },[]);

  const featuredPost = posts[0];

  return (
    <div className="trending-section">
      <div className="container">
        {/* Section Header */}
        <div className="trending-header">
          <div className="trending-title-wrapper">
            <FireOutlined className="trending-icon" />
            <Title level={2} className="trending-title">{t("trending.title")}</Title>
          </div>
          <Paragraph className="trending-subtitle">
            {t("trending.subtitle")}
          </Paragraph>
        </div>

        {/* Featured Trending Post */}
  {loading && <div style={{textAlign:'center', padding:40}}><Spin /></div>}
  {!loading && featuredPost && <div className="featured-trending">
          <Card className="featured-trending-card" onClick={()=> window.location.href=`/blog/${featuredPost.slug}`} style={{ cursor:'pointer' }}>
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12} onClick={()=> window.location.href=`/blog/${featuredPost.slug}` } style={{ cursor:'pointer' }}>
                <div className="featured-content">
                    <div className="featured-badge">
                    <FireOutlined />
                      <span>{t("trending.now")}</span>
                  </div>
                  <div className="featured-category">{featuredPost.categories?.[0]?.name || 'Blog'}</div>
                  <Title level={3} className="featured-title">
                    {featuredPost.title}
                  </Title>
                  <div className="featured-meta">
                    <div className="author-info">
                      <Avatar size="small" src={'/assets/blank-profile-picture.jpg'} />
                      <span className="author-name">BY {(featuredPost.author?.name || '').toUpperCase()}</span>
                    </div>
                    <div className="trending-post-date">{featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString() : ''}</div>
                  </div>
                  <div className="featured-stats">
                    <div className="stat-item">
                      <EyeOutlined />
                      <span>{featuredPost.views || 0} {t("trending.views")}</span>
                    </div>
                    <div className="stat-item">
                      <ClockCircleOutlined />
                      <span>{featuredPost.readingTimeMins || 1} {t("trending.minRead")}</span>
                    </div>
                  </div>
                  {featuredPost.tags?.length > 0 && (
                    <div className="featured-tags">
                      {featuredPost.tags.slice(0,4).map(t => (
                        <Tag key={t._id || t.name} className="trending-tag">{t.name || t}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={24} lg={12} onClick={()=> window.location.href=`/blog/${featuredPost.slug}` } style={{ cursor:'pointer' }}>
                <div className="featured-image">
                  <Image src={featuredPost.coverImageData ? `${API_ENDPOINTS.blog.posts}/${featuredPost._id}/cover` : '/assets/blank-profile-picture.jpg'} alt={featuredPost.title} fill className="featured-img" />
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
        </div>}

        {/* Trending Posts Grid */}
        {!loading && posts.length > 1 && <div className="trending-grid">
          <Row gutter={[24, 24]}>
            {posts.slice(1).map((post) => (
              <Col xs={24} md={12} lg={8} key={post._id} onClick={()=> window.location.href=`/blog/${post.slug}` } style={{ cursor:'pointer' }}>
                <Card className="trending-card" hoverable>
                  <div className="trending-card-image">
                    <Image src={post.coverImageData ? `${API_ENDPOINTS.blog.posts}/${post._id}/cover` : '/assets/blank-profile-picture.jpg'} alt={post.title} width={300} height={200} className="trending-img" />
                    {posts.indexOf(post) < 6 && (
                      <div className="trending-badge">
                        <FireOutlined />
                        <span>{t("trending.badge")}</span>
                      </div>
                    )}
                    <div className="category-badge">{post.categories?.[0]?.name || 'Blog'}</div>
                  </div>
                  <div className="trending-card-content">
                    <Title level={4} className="trending-card-title">
                      {post.title}
                    </Title>
                    <div className="trending-card-meta">
                      <div className="author-info">
                        <Avatar size="small" src={'/assets/blank-profile-picture.jpg'} />
                        <span className="author-name">BY {(post.author?.name || '').toUpperCase()}</span>
                      </div>
                      <div className="trending-post-date">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</div>
                    </div>
                      <div className="trending-card-stats">
                      <div className="stat-item">
                        <EyeOutlined />
                          <span>{post.views || 0}</span>
                      </div>
                      <div className="stat-item">
                        <ClockCircleOutlined />
                          <span>{post.readingTimeMins || 1} {t("trending.min")}</span>
                      </div>
                    </div>
                    <div className="trending-card-tags">
                      {post.tags?.slice(0,2).map(t => (
                        <Tag key={t._id || t.name} className="trending-tag-small">{t.name || t}</Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>}

        {/* View All Button */}
        <div className="trending-actions">
          <Link href="/blog">
            <button className="view-all-trending-btn">
              {t("trending.viewAll")}
              <FireOutlined />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Trending;
