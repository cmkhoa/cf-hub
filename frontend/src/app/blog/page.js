"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from 'antd';
import { Layout, Pagination, Select, Tag, Space, Button, Radio, Tooltip } from "antd";
// import MentorshipContentLayout from "@/components/componentForBlogPage/MentorshipContentLayout/MentorshipContentLayout";
import HeaderComponent from "@/components/header/header";
import FooterComponent from "@/components/footer/Footer";

const { Content } = Layout;

const PRESET_CATEGORIES = [
  { key:'big-tech-fortune-500-top-companies', label:'Big Tech, Fortune 500 & Top Companies' },
  { key:'events-community', label:'Events & Community' },
  { key:'main-blog', label:'Main Blog' },
  { key:'professional-development', label:'Professional Development' },
  { key:'resume-job-search-interview-tips', label:'Resume, Job Search & Interview Tips' },
  { key:'industry-insights', label:'Industry Insights' },
  { key:'networking-tips', label:'Networking Tips' },
  { key:'success-stories', label:'Success Stories' },
  { key:'viet-career-conference', label:'Viet Career Conference' },
  { key:'webinars-workshops', label:'Webinars & Workshops' }
];

export default function BlogPage() {
  const [current, setCurrent] = useState("blog");
  const handleClick = (e) => setCurrent(e.key);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories] = useState(PRESET_CATEGORIES);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [metaLoading, setMetaLoading] = useState(false);
  const [tagsMode, setTagsMode] = useState('any');
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;

  const load = async (p=1) => {
    try {
      setLoading(true); setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
      const params = new URLSearchParams();
      params.set('status','published');
      params.set('page', String(p));
      params.set('limit', String(pageSize));
  if(searchQuery.trim()) params.set('q', searchQuery.trim());
  if(selectedCategories.length > 0){ params.set('categories', selectedCategories.join(',')); }
      if(selectedTags.length){ params.set('tags', selectedTags.join(',')); params.set('tagsMode', tagsMode); }
      const res = await fetch(`${base}/blog/posts?${params.toString()}`);
      if(!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data.items || []);
      setTotal(data.total || 0);
    } catch(e){ setError(e.message); }
    finally { setLoading(false); }
  };
  // load metadata
  useEffect(()=>{
    async function meta(){
      setMetaLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
        const [tagRes] = await Promise.all([
          fetch(`${base}/blog/tags`)
        ]);
        const [tagJson] = await Promise.all([ tagRes.json()]);
        setTags(tagJson || []);
      } catch(err){ console.error('Meta load failed', err); }
      finally { setMetaLoading(false); }
    }
    meta();
  },[]);

  useEffect(()=>{ load(page); },[page, selectedCategories, selectedTags, tagsMode, searchQuery]);

  // Initialize filters from URL params (q, category, categories)
  useEffect(()=>{
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const categoriesParam = searchParams.get('categories') || '';
    if(q) setSearchQuery(q);
    const fromSingle = category ? [category] : [];
    const fromMulti = categoriesParam ? categoriesParam.split(',').map(s=> s.trim()).filter(Boolean) : [];
    const combined = Array.from(new Set([...fromSingle, ...fromMulti]));
    if(combined.length) setSelectedCategories(combined);
    // reset to page 1 when URL changes
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchParams]);

  const clearFilters = ()=>{ setSelectedCategories([]); setSelectedTags([]); setTagsMode('any'); setPage(1); };

  return (
    <Layout>
      <HeaderComponent current={current} handleClick={handleClick} />
      <Content style={{ minHeight: '60vh' }}>
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 32, marginBottom: 24 }}>All Articles</h1>
          <div style={{ marginBottom:24, background:'#fff', padding:16, border:'1px solid #eee', borderRadius:8 }}>
            <Space direction="vertical" style={{width:'100%'}} size="small">
              <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
                <div style={{ minWidth:280, flex: '1 1 320px' }}>
                  <label style={{ fontSize:12, fontWeight:600, letterSpacing:0.5 }}>Search</label>
                  <Input.Search
                    placeholder="Search articles"
                    allowClear
                    value={searchQuery}
                    onChange={e=> setSearchQuery(e.target.value)}
                    onSearch={(val)=> setSearchQuery(val)}
                  />
                </div>
                <div style={{ minWidth:240 }}>
                  <label style={{ fontSize:12, fontWeight:600, letterSpacing:0.5 }}>Categories</label>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Filter by category"
                    value={selectedCategories}
                    onChange={(vals)=> { setSelectedCategories(vals); setPage(1); }}
                    options={categories.map(c=> ({ value:c.key, label:c.label }))}
                    style={{ width:'100%' }}
                    maxTagCount={2}
                  />
                </div>
                <div style={{ minWidth:240 }}>
                  <label style={{ fontSize:12, fontWeight:600, letterSpacing:0.5 }}>Tags (search)</label>
                  <Select
                    mode="tags"
                    allowClear
                    placeholder="Filter by tags"
                    value={selectedTags}
                    onChange={(vals)=> { setSelectedTags(vals); setPage(1); }}
                    options={tags.map(t=> ({ value:t.name, label:t.name }))}
                    loading={metaLoading}
                    style={{ width:'100%' }}
                    maxTagCount={3}
                  />
                </div>
                {selectedTags.length > 0 && (
                  <div style={{ display:'flex', alignItems:'flex-end', paddingBottom:4 }}>
                    <Tooltip title="Match any = contains at least one selected tag. Match all = contains every selected tag.">
                      <Radio.Group value={tagsMode} onChange={e=> { setTagsMode(e.target.value); setPage(1); }} size="small">
                        <Radio.Button value="any">Any</Radio.Button>
                        <Radio.Button value="all">All</Radio.Button>
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
          {loading && <p>Loading articles...</p>}
          {error && <p style={{ color:'red' }}>Error: {error}</p>}
          {!loading && !error && posts.length === 0 && <p>No articles yet.</p>}
          <div style={{ display:'grid', gap:24, gridTemplateColumns:'repeat(auto-fill, minmax(250px,1fr))' }}>
            {posts.map(p => (
              <article key={p._id} style={{ background:'#fff', border:'1px solid #eee', borderRadius:8, padding:16, display:'flex', flexDirection:'column', cursor:'pointer' }} onClick={()=> window.location.href = `/blog/${p.slug}` }>
                <h3 style={{ marginTop:0, fontSize:18 }}>{p.title}</h3>
                <p style={{ margin:'8px 0', color:'#555', fontSize:14 }}>{p.excerpt || (p.content?.slice(0,120)+'...')}</p>
                <div style={{ marginTop:'auto', fontSize:12, color:'#888' }}>
                  <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ''}</span>
                  {p.readingTimeMins ? <span> · {p.readingTimeMins} min read</span> : null}
                </div>
              </article>
            ))}
          </div>
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