import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { ArrowRightOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import './BlogGrid.css';

const { Title, Paragraph } = Typography;

const BlogGrid = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
  const res = await fetch(`${base}/blog/posts?status=published&postType=blog&limit=5&page=1`);
        if(!res.ok) throw new Error('Failed to load posts');
        const data = await res.json();
        if(active) setPosts(data.items || []);
      } catch(e){ if(active) setError(e.message); }
      finally { if(active) setLoading(false); }
    })();
    return ()=>{ active=false; };
  },[]);

  if(loading) return <section className="blog-grid-section"><div className="container"><p>Loading latest articles...</p></div></section>;
  if(error) return <section className="blog-grid-section"><div className="container"><p>Error: {error}</p></div></section>;
  if(!posts.length) return <section className="blog-grid-section"><div className="container"><p>No articles yet.</p></div></section>;

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1, 5);

  // Helper to resolve image path (relative '/uploads/...' kept as-is)
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
  const resolveImage = (post) => {
    if(post?.coverImageData || post?.coverImageMime){
      // Use cover endpoint by id
      return `${apiBase}/blog/posts/${post._id}/cover`;
    }
    if(post?.coverImage){
      if(post.coverImage.startsWith('/')) return post.coverImage;
      return post.coverImage;
    }
    return '/images/resume.jpeg';
  };

  // Assign a size class so titles can shrink to fit a fixed two-line space
  const getTitleSizeClass = (text = '', variant = 'regular') => {
    const len = (text || '').trim().length;
    // Slightly stricter thresholds for regular vs featured
    if (variant === 'featured') {
      if (len <= 42) return 'title-xl';
      if (len <= 60) return 'title-lg';
      if (len <= 78) return 'title-md';
      return 'title-sm';
    }
    // regular
    if (len <= 38) return 'title-xl';
    if (len <= 54) return 'title-lg';
    if (len <= 72) return 'title-md';
    return 'title-sm';
  };

  return (
    <section className="blog-grid-section" aria-labelledby="latest-news-heading">
      <div className="container">
        <header className="blog-grid-header">
          <h2 id="latest-news-heading" className="blog-grid-title">Latest News</h2>
        </header>
        <div className="blog-grid">
          {/* Featured Post */}
          <div className="featured-post" onClick={()=> window.location.href = `/blog/${featuredPost.slug}` } style={{ cursor:'pointer' }}>
            <div className="featured-image">
              <Image
                src={resolveImage(featuredPost)}
                alt={featuredPost.title}
                fill
                className="featured-img"
              />
              <div className="featured-tag">{featuredPost.category}</div>
            </div>
            <div className="featured-content">
              <Title level={3} className={`featured-title ${getTitleSizeClass(featuredPost.title, 'featured')}`}>
                {featuredPost.title}
              </Title>
              <Paragraph className="featured-excerpt">
                {featuredPost.excerpt}
              </Paragraph>
              <div className="featured-meta">
                <div className="meta-item">
                  <UserOutlined />
                  <span>{featuredPost.author?.name || (typeof featuredPost.author === 'string' ? featuredPost.author : 'Unknown')}</span>
                </div>
                <div className="meta-item">
                  <CalendarOutlined />
                  <span>{featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString() : ''}</span>
                </div>
                <div className="meta-item">
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              <Button 
                type="primary" 
                className="read-more-btn"
                icon={<ArrowRightOutlined />}
                onClick={()=> window.location.href = `/blog/${featuredPost.slug}` }
              >
                Read More
              </Button>
            </div>
          </div>

          {/* Regular Posts Grid */}
          <div className="regular-posts">
            {regularPosts.map((post) => (
              <div key={post._id} className="post-card" onClick={()=> window.location.href = `/blog/${post.slug}` } style={{ cursor:'pointer' }}>
                <div className="post-image">
                  <Image
                    src={resolveImage(post)}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="post-img"
                  />
                  <div className="post-tag">{post.category}</div>
                </div>
                <div className="post-content">
                  <Title level={4} className={`post-title ${getTitleSizeClass(post.title, 'regular')}`}>
                    {post.title}
                  </Title>
                  <Paragraph className="post-excerpt">
                    {post.excerpt}
                  </Paragraph>
                  <div className="post-meta">
                    <div className="meta-item">
                      <UserOutlined />
                      <span>{post.author?.name || (typeof post.author === 'string' ? post.author : 'Unknown')}</span>
                    </div>
                    <div className="meta-item">
                      <CalendarOutlined />
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="view-all-section">
          <Link href="/blog" legacyBehavior>
            <Button 
              type="default" 
              size="large"
              className="view-all-btn"
              icon={<ArrowRightOutlined />}
            >
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
  </section>
  );
};

export default BlogGrid;
