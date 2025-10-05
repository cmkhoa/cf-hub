"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout, Pagination, Select, Tag, Space, Button, Radio, Tooltip, Input, Segmented } from 'antd';
import PostCard from '@/components/post/PostCard';
import HeaderComponent from '@/components/header/header';
import FooterComponent from '@/components/footer/Footer';

const { Content } = Layout;

const PRESET_CATEGORIES = [
  { key:'resume-tips', label:'Resume Tips' },
  { key:'interview-tips', label:'Interview Tips' },
  { key:'technical-tips', label:'Technical Tips' }
];

export const dynamic = 'force-dynamic';

function StoriesPageInner(){
  const [current, setCurrent] = useState('blog'); // reuse same nav key if header expects it
  const handleClick = (e) => setCurrent(e.key);
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories] = useState(PRESET_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState([]); // may be reused if stories share tag taxonomy
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsMode, setTagsMode] = useState('any');
  const [metaLoading, setMetaLoading] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const pageSize = 10;

  const load = async (p=1) => {
    try {
      setLoading(true); setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
      const params = new URLSearchParams();
      params.set('status','published');
      params.set('postType','success');
      params.set('page', String(p));
      params.set('limit', String(pageSize));
      if(searchQuery.trim()) params.set('q', searchQuery.trim());
      if(selectedCategories.length) params.set('categories', selectedCategories.join(','));
      if(selectedTags.length){ params.set('tags', selectedTags.join(',')); params.set('tagsMode', tagsMode); }
      const res = await fetch(`${base}/blog/posts?${params.toString()}`);
      if(!res.ok) throw new Error('Failed to fetch stories');
      const data = await res.json();
      setPosts(data.items || []);
      setTotal(data.total || 0);
    } catch(e){ setError(e.message); }
    finally { setLoading(false); }
  };

  // Load tags if shared
  useEffect(()=>{ (async ()=> {
    try {
      setMetaLoading(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
      const res = await fetch(`${base}/blog/tags`);
      const data = await res.json();
      setTags(data || []);
    } catch(err){ /* ignore */ } finally { setMetaLoading(false); }
  })(); },[]);

  useEffect(()=> { load(page); },[page, selectedCategories, selectedTags, tagsMode, searchQuery]);

  useEffect(()=> {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const categoriesParam = searchParams.get('categories') || '';
    if(q) setSearchQuery(q);
    const fromSingle = category ? [category] : [];
    const fromMulti = categoriesParam ? categoriesParam.split(',').map(s=> s.trim()).filter(Boolean) : [];
    const combined = Array.from(new Set([...fromSingle, ...fromMulti]));
    if(combined.length) setSelectedCategories(combined);
    setPage(1);
  },[searchParams]);

  const clearFilters = () => { setSelectedCategories([]); setSelectedTags([]); setTagsMode('any'); setPage(1); };

  return (
    <Layout>
      <HeaderComponent current={current} handleClick={handleClick} />
      <Content style={{ minHeight:'60vh' }}>
        <div style={{ maxWidth:1100, margin:'40px auto', padding:'0 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap', marginBottom:24 }}>
            <h1 style={{ fontSize:32, margin:0 }}>Job Application Tips</h1>
            <Segmented size='middle' value={viewMode} onChange={setViewMode} options={[{label:'Cards', value:'card'},{label:'Rows', value:'row'}]} />
          </div>
          <div style={{ marginBottom:24, background:'#fff', padding:16, border:'1px solid #eee', borderRadius:8 }}>
            <Space direction='vertical' style={{ width:'100%' }} size='small'>
              <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
                <div style={{ minWidth:280, flex:'1 1 320px' }}>
                  <label style={{ fontSize:12, fontWeight:600, letterSpacing:0.5 }}>Search</label>
                  <Input.Search placeholder='Search stories' allowClear value={searchQuery} onChange={e=> setSearchQuery(e.target.value)} onSearch={val=> setSearchQuery(val)} />
                </div>
                <div style={{ minWidth:240 }}>
                  <label style={{ fontSize:12, fontWeight:600, letterSpacing:0.5 }}>Categories</label>
                  <Select mode='multiple' allowClear placeholder='Filter by category' value={selectedCategories} onChange={vals=> { setSelectedCategories(vals); setPage(1); }} options={categories.map(c=> ({ value:c.key, label:c.label }))} style={{ width:'100%' }} maxTagCount={2} />
                </div>
                <div style={{ minWidth:240 }}>
                  <label style={{ fontSize:12, fontWeight:600, letterSpacing:0.5 }}>Tags (search)</label>
                  <Select mode='tags' allowClear placeholder='Filter by tags' value={selectedTags} onChange={vals=> { setSelectedTags(vals); setPage(1); }} options={tags.map(t=> ({ value:t.name, label:t.name }))} loading={metaLoading} style={{ width:'100%' }} maxTagCount={3} />
                </div>
                {selectedTags.length > 0 && (
                  <div style={{ display:'flex', alignItems:'flex-end', paddingBottom:4 }}>
                    <Tooltip title='Match any = contains at least one selected tag. Match all = contains every selected tag.'>
                      <Radio.Group value={tagsMode} onChange={e=> { setTagsMode(e.target.value); setPage(1); }} size='small'>
                        <Radio.Button value='any'>Any</Radio.Button>
                        <Radio.Button value='all'>All</Radio.Button>
                      </Radio.Group>
                    </Tooltip>
                  </div>
                )}
                {(selectedCategories.length || selectedTags.length) && (
                  <div>
                    <Button onClick={clearFilters}>Clear</Button>
                  </div>
                )}
              </div>
              {(selectedCategories.length || selectedTags.length) && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {selectedCategories.map(id=> {
                    const cat = categories.find(c=> c.key===id); return <Tag key={id} closable onClose={()=> setSelectedCategories(selectedCategories.filter(c=> c!==id))}>{cat?.label || id}</Tag>;
                  })}
                  {selectedTags.map(t=> <Tag key={t} closable onClose={()=> setSelectedTags(selectedTags.filter(x=> x!==t))}>{t}</Tag>)}
                </div>
              )}
            </Space>
          </div>
          {loading && <p>Loading stories...</p>}
          {error && <p style={{ color:'red' }}>Error: {error}</p>}
          {!loading && !error && posts.length === 0 && <p>No stories yet.</p>}
          {posts.length > 0 && (
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
          {total > pageSize && (
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

export default function StoriesPage(){
  return <Suspense fallback={<div />}> <StoriesPageInner /> </Suspense>;
}
