"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout, Spin, Tag, Button } from 'antd';
import HeaderComponent from '@/components/header/header';
import FooterComponent from '@/components/footer/Footer';
import PostContent from '@/components/post/PostContent';

const { Content } = Layout;

export default function StoryDetail(){
  const { slug } = useParams();
  const router = useRouter();
  const [current, setCurrent] = useState('blog');
  const handleClick = (e)=> setCurrent(e.key);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    async function load(){
      try {
        setLoading(true); setError(null);
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
        const res = await fetch(`${base}/blog/posts/slug/${slug}`);
        if(res.status === 404){ setError('Not found'); return; }
        if(!res.ok) throw new Error('Failed to fetch story');
        const data = await res.json();
        if(data.postType !== 'success'){ setError('Not found'); return; }
        setPost(data);
      } catch(err){ setError(err.message); }
      finally { setLoading(false); }
    }
    if(slug) load();
  },[slug]);

  return (
    <Layout>
      <HeaderComponent current={current} handleClick={handleClick} />
      <Content style={{ minHeight:'60vh' }}>
        <div style={{ maxWidth:900, margin:'40px auto', padding:'0 24px' }}>
          <Button onClick={()=> router.back()} style={{ marginBottom:16 }}>← Back</Button>
          {loading && <div style={{ textAlign:'center', padding:40 }}><Spin /></div>}
          {error && !loading && <p style={{ color:'red' }}>{error}</p>}
          {!loading && !error && post && (
            <article>
              <h1 style={{ fontSize:34, marginBottom:12 }}>{post.title}</h1>
              <div style={{ fontSize:13, color:'#666', marginBottom:16 }}>
                {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()} {post.readingTimeMins && `· ${post.readingTimeMins} min read`}
              </div>
              {post.categories?.length ? (
                <div style={{ marginBottom:12 }}>
                  {post.categories.map(c=> <Tag key={c._id || c}>{c.name || c}</Tag>)}
                </div>
              ): null}
              {post.tags?.length ? (
                <div style={{ marginBottom:24 }}>
                  {post.tags.map(t=> <Tag color="blue" key={t._id || t.name || t}>{t.name || t}</Tag>)}
                </div>
              ): null}
              <div style={{ fontSize:16, lineHeight:1.6 }}>
                <PostContent content={post.content} />
              </div>
            </article>
          )}
        </div>
        <FooterComponent />
      </Content>
    </Layout>
  );
}
