import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button } from "antd";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import "./BlogGrid.css";

const { Title, Paragraph } = Typography;

const BlogGrid = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const base =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api";
        const res = await fetch(
          `${base}/blog/posts?status=published&postType=blog&limit=2&page=1`
        );
        if (!res.ok) throw new Error("Failed to load posts");
        const data = await res.json();
        if (active) setPosts(data.items || []);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading)
    return (
      <section className="blog-grid-section">
        <div className="container">
          <p>Loading latest articles...</p>
        </div>
      </section>
    );
  if (error)
    return (
      <section className="blog-grid-section">
        <div className="container">
          <p>Error: {error}</p>
        </div>
      </section>
    );
  if (!posts.length)
    return (
      <section className="blog-grid-section">
        <div className="container">
          <p>No articles yet.</p>
        </div>
      </section>
    );

  const regularPosts = posts.slice(0, 3);

  // Helper to resolve image path (relative '/uploads/...' kept as-is)
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api";
  const resolveImage = (post) => {
    if (post?.coverImageData || post?.coverImageMime) {
      // Use cover endpoint by id
      return `${apiBase}/blog/posts/${post._id}/cover`;
    }
    if (post?.coverImage) {
      if (/^https?:\/\//i.test(post.coverImage)) return post.coverImage;
      // Treat as stored key and go through API cover to stream/redirect
      return `${apiBase}/blog/posts/${post._id}/cover`;
    }
    return "/images/resume.jpeg";
  };

  // Assign a size class so titles can shrink to fit a fixed two-line space
  const getTitleSizeClass = (text = "", variant = "regular") => {
    const len = (text || "").trim().length;
    // Slightly stricter thresholds for regular vs featured
    if (variant === "featured") {
      if (len <= 42) return "title-xl";
      if (len <= 60) return "title-lg";
      if (len <= 78) return "title-md";
      return "title-sm";
    }
    // regular
    if (len <= 38) return "title-xl";
    if (len <= 54) return "title-lg";
    if (len <= 72) return "title-md";
    return "title-sm";
  };

  return (
    <section
      className="blog-grid-section"
      aria-labelledby="latest-news-heading"
    >
      <div className="container">
        <header className="blog-grid-header">
          <h2 id="latest-news-heading" className="blog-grid-title">
            Latest News
          </h2>
        </header>
        <div className="blog-grid">
          {/* Two Posts Side by Side */}
          <div className="regular-posts">
            {regularPosts.map((post) => (
              <div
                key={post._id}
                className="post-card"
                onClick={() => (window.location.href = `/blog/${post.slug}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="post-image">
                  <Image
                    src={resolveImage(post)}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="post-img"
                  />
                  <div className="post-tag">
                    {post.category?.name || post.category}
                  </div>
                </div>
                <div className="post-content">
                  <Title
                    level={4}
                    className={`post-title ${getTitleSizeClass(
                      post.title,
                      "regular"
                    )}`}
                  >
                    {post.title}
                  </Title>
                  <Paragraph className="post-excerpt">{post.excerpt}</Paragraph>
                  <div className="post-meta">
                    <div className="meta-item">
                      <UserOutlined />
                      <span>
                        {post.author?.name ||
                          (typeof post.author === "string"
                            ? post.author
                            : "Unknown")}
                      </span>
                    </div>
                    <div className="meta-item">
                      <CalendarOutlined />
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : ""}
                      </span>
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
