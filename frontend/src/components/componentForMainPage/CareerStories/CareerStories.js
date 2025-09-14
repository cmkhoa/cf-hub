import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Spin } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import './CareerStories.css';
import { API_ENDPOINTS } from '@/config/api';

const { Title, Text: AntText } = Typography;

const CareerStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let cancelled = false;
    async function load(){
      setLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.blog.posts}?status=published&postType=success&limit=9`);
        const data = await res.json();
        if(!cancelled){ setStories(data.items || []); }
      } catch(err){ if(!cancelled){ console.error('Load career stories failed', err); } }
      finally { if(!cancelled) setLoading(false); }
    }
    load();
    return ()=>{ cancelled = true; };
  },[]);

  const columns = [[],[],[]];
  stories.forEach((story, idx)=>{ columns[idx % 3].push(story); });

  return (
    <section className="success-story-section">
      <div className="container">
        <div className="success-story-header">
          <Title level={2} className="success-story-title">Career Stories</Title>
          <p className="success-story-subtitle">Real journeys, real results. See how CF Hub mentees landed their dream jobs and overcame career challenges.</p>
        </div>
        {loading && <div style={{textAlign:'center', padding:40}}><Spin /></div>}
        {!loading && (
          <Row gutter={[24,24]}>
            {columns.map((col, i)=>(
              <Col xs={24} md={8} key={i}>
                <div className="category-column">
                  <div className="category-header">
                    <Title level={4} className="category-title">{i===0?'Latest Career Stories':''}</Title>
                    <MoreOutlined className="more-icon" />
                  </div>
                  <div className="posts-container redesigned">
                    {col.map(story => (
                      <Card
                        key={story._id}
                        className={`post-card small-card ${story.featured ? 'featured-post':'regular-post'}`}
                        cover={
                          <div className="post-image-container small-image" onClick={()=> window.location.href = `/blog/${story.slug}` } style={{ cursor:'pointer' }}>
                            <img
                              src={story.coverImageData ? `${API_ENDPOINTS.blog.posts}/${story._id}/cover` : '/assets/blank-profile-picture.jpg'}
                              alt={story.title}
                              className="post-image"
                            />
                            <div className="post-tag">CAREER STORY</div>
                          </div>
                        }
                        onClick={()=> window.location.href = `/blog/${story.slug}` }
                        style={{ cursor:'pointer' }}
                      >
                        <div className="post-content small-content">
                          <Title level={4} className="post-title small-title">{story.title}</Title>
                          <div className="post-meta small-meta">
                            {story.author?.name && <AntText className="author">BY {story.author.name.toUpperCase()}</AntText>}
                            <div className="meta-dot"></div>
                            <AntText className="date">{story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : ''}</AntText>
                          </div>
                          {story.excerpt && <AntText className="post-excerpt small-excerpt">{story.excerpt}</AntText>}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
};

export default CareerStories;
