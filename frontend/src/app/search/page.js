"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from 'antd';
import { Layout, Pagination, Select, Tag, Space, Button, Segmented } from "antd";
import PostCard from '@/components/post/PostCard';
import HeaderComponent from "@/components/header/header";
import FooterComponent from "@/components/footer/Footer";

const { Content } = Layout;

export const dynamic = 'force-dynamic';

function SearchPageInner(){
  const [current, setCurrent] = useState("blog");
  const handleClick = (e) => setCurrent(e.key);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsMode, setTagsMode] = useState('any');
  const [metaLoading, setMetaLoading] = useState(false);
  // searchQuery is the live input; committedQuery triggers fetch when Enter/search pressed
  const [searchQuery, setSearchQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const pageSize = 10;

  const load = async (p=1) => {
    try {
      setLoading(true); setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
      const params = new URLSearchParams();
      params.set('status','published');
      params.set('page', String(p));
      params.set('limit', String(pageSize));
      if(committedQuery.trim()) params.set('q', committedQuery.trim());
      if(selectedTags.length){ params.set('tags', selectedTags.join(',')); params.set('tagsMode', tagsMode); }
      // include all post types (blog + success)
      // backend treats unspecified postType as all; otherwise could pass postType=all
      const res = await fetch(`${base}/blog/posts?${params.toString()}`);
      if(!res.ok) throw new Error('Failed to fetch results');
      const data = await res.json();
      setPosts(data.items || []);
      setTotal(data.total || 0);
    } catch(e){ setError(e.message); }
    finally { setLoading(false); }
  };

  // Load tags
  useEffect(()=>{ (async ()=>{
    try{
      setMetaLoading(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
      const res = await fetch(`${base}/blog/tags`);
      const data = await res.json();
      setTags(data || []);
    }catch(err){ /* ignore */ } finally { setMetaLoading(false); }
  })(); },[]);

  // Only fetch when committedQuery exists (or tags changed with a committed query)
  useEffect(()=>{ if (committedQuery.trim()) load(page); },[page, selectedTags, tagsMode, committedQuery]);

  // init from URL
  useEffect(()=>{
    const q = searchParams.get('q') || '';
    const tagsParam = searchParams.get('tags') || '';
    if(q) { setSearchQuery(q); setCommittedQuery(q); }
    if(tagsParam) setSelectedTags(tagsParam.split(',').map(s=>s.trim()).filter(Boolean));
    setPage(1);
  },[searchParams]);

  const clearFilters = ()=>{ setSelectedTags([]); setTagsMode('any'); setPage(1); };

  return (
    <Layout>
      <HeaderComponent current={current} handleClick={handleClick} />
      <Content style={{ minHeight:'60vh' }}>
        <div style={{ maxWidth:1100, margin:'40px auto', padding:'0 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap', marginBottom:24 }}>
            <h1 style={{ fontSize:32, margin:0 }}>Search Results</h1>
            <Segmented size="middle" value={viewMode} onChange={setViewMode} options={[{label:'Cards', value:'card'},{label:'Rows', value:'row'}]} />
          </div>
          <div style={{ marginBottom:24, background:'#fff', padding:16, border:'1px solid #eee', borderRadius:8 }}>
            <Space direction='vertical' style={{ width:'100%' }} size='small'>
              <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
                <div style={{ minWidth:280, flex:'1 1 320px' }}>
                  <label style={{ fontSize:12, fontWeight:600, letterSpacing:0.5 }}>Search</label>
                  <Input.Search
                    placeholder='Search all posts'
                    allowClear
                    value={searchQuery}
                    onChange={e=> setSearchQuery(e.target.value)}
                    onSearch={(val)=> { const v = (val||'').trim(); setCommittedQuery(v); setPage(1); }}
                  />
                </div>
                <div style={{ minWidth:240 }}>
                  <label style={{ fontSize:12, fontWeight:600, letterSpacing:0.5 }}>
                    {`Tags${selectedTags.length ? ` (${selectedTags.length})` : ''}`}
                  </label>
                  <Select mode='tags' allowClear placeholder='Filter by tags' value={selectedTags} onChange={vals=> { setSelectedTags(vals); setPage(1); }} options={tags.map(t=> ({ value:t.name, label:t.name }))} loading={metaLoading} style={{ width:'100%' }} maxTagCount={3} />
                </div>
                {/* Removed Any/All switch; default tag matching is OR (any) */}
              </div>
              {(selectedTags.length > 0) && (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, flex:1 }}>
                    {selectedTags.map(t=> <Tag key={t} closable onClose={()=> setSelectedTags(selectedTags.filter(x=> x!==t))}>{t}</Tag>)}
                  </div>
                  <Button onClick={clearFilters}>Clear</Button>
                </div>
              )}
            </Space>
          </div>
          {!committedQuery && (
            <p style={{ color:'#666' }}>Type a query above and press Enter to search across blogs and stories.</p>
          )}
          {committedQuery && loading && <p>Loading results...</p>}
          {committedQuery && error && <p style={{ color:'red' }}>Error: {error}</p>}
          {committedQuery && !loading && !error && posts.length === 0 && <p>No results for "{committedQuery}".</p>}
          {committedQuery && posts.length > 0 && (
            viewMode === 'card' ? (
              <div style={{ display:'grid', gap:24, gridTemplateColumns:'repeat(auto-fill, minmax(250px,1fr))' }}>
                {posts.map(p=> <PostCard key={p._id} post={p} layout='card' onClick={()=> window.location.href = `/blog/${p.slug}`} />)}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {posts.map(p=> <PostCard key={p._id} post={p} layout='row' onClick={()=> window.location.href = `/blog/${p.slug}`} />)}
              </div>
            )
          )}
          {committedQuery && total > pageSize && (
            <div style={{ marginTop:32, textAlign:'center' }}>
              <Pagination current={page} pageSize={pageSize} total={total} onChange={setPage} showSizeChanger={false} />
            </div>
          )}
        </div>
        <FooterComponent />
      </Content>
    </Layout>
  );
}

export default function SearchPage(){
  return (
    <Suspense fallback={<div />}> <SearchPageInner /> </Suspense>
  );
}
