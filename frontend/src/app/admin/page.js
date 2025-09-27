"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext/authContext';
import { Typography, Form, Input, Button, Switch, Table, Space, Popconfirm, message, Upload, Select, Modal, Layout, Menu, Tag as AntTag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { API_ENDPOINTS, getAuthHeader } from '@/config/api';
import HeaderComponent from '@/components/header/header';
const { Title } = Typography;
const { Sider, Content } = Layout;

const PRESET_CATEGORIES = [
  { key:'big-tech-fortune-500-top-companies', label:'Big Tech, Fortune 500 & Top Companies' },
  { key:'events-community', label:'Events & Community' },
  { key:'main-blog', label:'Main Blog' },
  { key:'professional-development', label:'Professional Development' },
  { key:'resume-job-search-interview-tips', label:'Resume, Job Search & Interview Tips' },
  { key:'industry-insights', label:'Industry Insights' },
  { key:'networking-tips', label:'Networking Tips' },
  { key:'success-stories', label:'Career Stories' },
  { key:'viet-career-conference', label:'Viet Career Conference' },
  { key:'webinars-workshops', label:'Webinars & Workshops' }
];

export default function AdminDashboard(){
  const { userLoggedIn, currentUser, loading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();
  const [createLoading, setCreateLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [coverBase64, setCoverBase64] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  // Legacy modal edit state removed; using inline edit form
  const [tags, setTags] = useState([]);
  const [metaLoading, setMetaLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('blogs');
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsPage, setAppsPage] = useState(1);
  const [appsTotal, setAppsTotal] = useState(0);
  const [appsQuery, setAppsQuery] = useState('');
  const [appsStatusFilter, setAppsStatusFilter] = useState('');
  const [navCurrent, setNavCurrent] = useState('admin');
  // Mentees state
  const [mentees, setMentees] = useState([]);
  const [menteesLoading, setMenteesLoading] = useState(false);
  const [menteeModalOpen, setMenteeModalOpen] = useState(false);
  const [menteeForm] = Form.useForm();
  const [editingMentee, setEditingMentee] = useState(null);

  // New: consultation requests state
  const [consults, setConsults] = useState([]);
  const [consultsLoading, setConsultsLoading] = useState(false);
  const [consultsPage, setConsultsPage] = useState(1);
  const [consultsTotal, setConsultsTotal] = useState(0);
  const [consultsQuery, setConsultsQuery] = useState('');
  const [consultsStatusFilter, setConsultsStatusFilter] = useState('');

  // Consolidated redirect logic to avoid race conditions causing bounce
  useEffect(()=>{
    if(loading) return; // wait until auth state resolved
    if(!userLoggedIn){
      router.replace('/login?next=/admin');
      return;
    }
    if(currentUser?.role !== 'admin'){
      router.replace('/dashboard');
    }
  },[loading, userLoggedIn, currentUser, router]);

  const loadPosts = async ()=>{
    setFetching(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.blog.posts}?limit=50`, { headers:{ ...getAuthHeader() } });
      const data = await res.json();
      setPosts(data.items || []);
    } catch(err){ console.error(err); } finally { setFetching(false); }
  };
  useEffect(()=>{ if(userLoggedIn && currentUser?.role === 'admin') loadPosts(); },[userLoggedIn, currentUser]);
  useEffect(()=>{ if(userLoggedIn && currentUser?.role==='admin') loadMeta(); },[userLoggedIn, currentUser]);
  useEffect(()=>{ if(activeSection==='mentees' && userLoggedIn && currentUser?.role==='admin') fetchMentees(); },[activeSection, userLoggedIn, currentUser]);

  const loadMeta = async ()=>{
    setMetaLoading(true);
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.blog.categories}`),
        fetch(`${API_ENDPOINTS.blog.tags}`)
      ]);
      const [catJson, tagJson] = await Promise.all([catRes.json(), tagRes.json()]);
      setTags(tagJson || []);
    } catch(err){ console.error('Meta load failed', err); }
    finally { setMetaLoading(false); }
  };

  const onCreate = async (values)=>{
    setCreateLoading(true);
    try {
      const body = { postType: values.postType || 'blog', title: values.title, content: values.content, excerpt: values.excerpt || '', featured: !!values.featured, categories: values.categories || [], tags: values.tags || [], coverImageBase64: coverBase64 };
      // If editing, send PUT to overwrite existing post
      const res = isEditing && editingPost? (
        await fetch(`${API_ENDPOINTS.blog.posts}/${editingPost._id}`, { method:'PUT', headers:{ 'Content-Type':'application/json', ...getAuthHeader() }, body: JSON.stringify(body) })
      ) : (
        await fetch(API_ENDPOINTS.blog.posts, { method:'POST', headers:{ 'Content-Type':'application/json', ...getAuthHeader() }, body: JSON.stringify(body) })
      );
      if(!res.ok) throw new Error(isEditing? 'Update failed':'Create failed');
      message.success(isEditing? 'Post updated' : 'Post created (draft).');
      form.resetFields();
      setCoverBase64(null);
      setIsEditing(false);
      setEditingPost(null);
      loadPosts();
    } catch(err){ message.error(err.message); } finally { setCreateLoading(false); }
  };

  // Mentees API
  const fetchMentees = async ()=>{
    setMenteesLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.mentees.list);
      const data = await res.json();
      setMentees(Array.isArray(data) ? data : []);
    } catch(err){ console.error(err); message.error('Failed to load mentees'); }
    finally { setMenteesLoading(false); }
  };

  const openMenteeModal = (record=null)=>{
    setEditingMentee(record);
    if(record){
      menteeForm.setFieldsValue({ name: record.name, company: record.company, position: record.position, location: record.location, image: record.image, featured: !!record.featured, order: record.order||0 });
    } else {
      menteeForm.resetFields();
      menteeForm.setFieldsValue({ featured:false, order:0 });
    }
    setMenteeModalOpen(true);
  };

  const submitMentee = async ()=>{
    try {
      const values = await menteeForm.validateFields();
      const method = editingMentee ? 'PUT' : 'POST';
      const url = editingMentee ? API_ENDPOINTS.mentees.update(editingMentee._id) : API_ENDPOINTS.mentees.create;
      const res = await fetch(url, { method, headers:{ 'Content-Type':'application/json', ...getAuthHeader() }, body: JSON.stringify(values) });
      if(!res.ok) throw new Error('Save failed');
      message.success('Saved');
      setMenteeModalOpen(false);
      setEditingMentee(null);
      fetchMentees();
    } catch(err){ message.error(err.message||'Save failed'); }
  };

  const deleteMentee = async (id)=>{
    try {
      const res = await fetch(API_ENDPOINTS.mentees.remove(id), { method:'DELETE', headers:{ ...getAuthHeader() } });
      if(!res.ok) throw new Error('Delete failed');
      message.success('Deleted');
      fetchMentees();
    } catch(err){ message.error(err.message); }
  };

  const publish = async (id, publish=true)=>{
    try {
      const endpoint = publish ? API_ENDPOINTS.blog.publish(id) : API_ENDPOINTS.blog.unpublish(id);
      const res = await fetch(endpoint, { method:'POST', headers:{ ...getAuthHeader() } });
      if(!res.ok) throw new Error('Action failed');
      message.success(publish ? 'Published' : 'Unpublished');
      loadPosts();
    } catch(err){ message.error(err.message); }
  };

  const updatePostStatus = async (id, status)=>{
    try {
      const res = await fetch(`${API_ENDPOINTS.blog.posts}/${id}`, { method:'PUT', headers:{ 'Content-Type':'application/json', ...getAuthHeader() }, body: JSON.stringify({ status }) });
      if(!res.ok) throw new Error('Status update failed');
      message.success('Status updated');
      loadPosts();
    } catch(err){ message.error(err.message); }
  };

  const remove = async (id)=>{
    try { const res = await fetch(`${API_ENDPOINTS.blog.posts}/${id}`, { method:'DELETE', headers:{ ...getAuthHeader() } }); if(!res.ok) throw new Error('Delete failed'); message.success('Deleted'); loadPosts(); } catch(err){ message.error(err.message); } };

  const columns = [
    { title:'Type', dataIndex:'postType', key:'postType' },
    { title:'Title', dataIndex:'title', key:'title' },
    { title:'Status', dataIndex:'status', key:'status' },
    { title:'Featured', dataIndex:'featured', key:'featured', render: v=> v? 'Yes':'No' },
    { title:'Views', dataIndex:'views', key:'views' },
    { title:'Updated', dataIndex:'updatedAt', key:'updatedAt', render:v=> v? new Date(v).toLocaleString():'' },
    { title:'Actions', key:'actions', render:(_,record)=> (
      <Space size="small">
        {record.status==='draft' && <Button size="small" onClick={()=>publish(record._id,true)}>Publish</Button>}
        {record.status==='published' && <Button size="small" onClick={()=>publish(record._id,false)}>Unpublish</Button>}
        <Button size="small" onClick={()=> openEdit(record)}>Edit</Button>
        <Popconfirm title="Delete?" onConfirm={()=>remove(record._id)}><Button danger size="small">Delete</Button></Popconfirm>
      </Space>
    ) }
  ];

  const openEdit = (post)=>{
    setEditingPost(post);
    setIsEditing(true);
  // no separate edit cover buffer; using coverBase64 inline
    // Populate the main form for inline editing
    form.setFieldsValue({
      postType: post.postType || 'blog',
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured: !!post.featured,
      categories: (post.categories || []).map(c=> c._id || c),
      tags: (post.tags || []).map(t=> t.name || t)
    });
  };

  const cancelEdit = ()=>{
    setIsEditing(false);
    setEditingPost(null);
    setCoverBase64(null);
    form.resetFields();
  };

  // Removed old submitEdit (modal) - using onCreate to handle both create and update flows

  const fetchApplications = async (page=1, q=appsQuery, status=appsStatusFilter)=>{
    setAppsLoading(true);
    try {
      const url = API_ENDPOINTS.applications.list({ page, limit: 20, q, status });
      const res = await fetch(url, { headers: { ...getAuthHeader() } });
      if(!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data.items || []);
      setAppsTotal(data.total || 0);
      setAppsPage(data.page || 1);
    } catch(err){ console.error(err); message.error(err.message); }
    finally { setAppsLoading(false); }
  };

  useEffect(()=>{ if(activeSection==='applications' && userLoggedIn && currentUser?.role==='admin') fetchApplications(); },[activeSection, userLoggedIn, currentUser]);

  const fetchConsults = async (page=1, q=consultsQuery, status=consultsStatusFilter)=>{
    setConsultsLoading(true);
    try {
      const url = API_ENDPOINTS.consultations.adminList({ page, limit: 20, q, status });
      const res = await fetch(url, { headers: { ...getAuthHeader() } });
      if(!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setConsults(data.items || []);
      setConsultsTotal(data.total || 0);
      setConsultsPage(data.page || 1);
    } catch(err){ console.error(err); message.error(err.message); }
    finally { setConsultsLoading(false); }
  };

  useEffect(()=>{ if(activeSection==='consultations' && userLoggedIn && currentUser?.role==='admin') fetchConsults(); },[activeSection, userLoggedIn, currentUser]);

  const successStories = useMemo(()=> posts.filter(p=> p.postType==='success'), [posts]);
  const blogPosts = useMemo(()=> posts.filter(p=> p.postType!=='success'), [posts]);

  if(loading) return <div style={{padding:60, textAlign:'center'}}>Loading admin session…</div>;
  if(!userLoggedIn || currentUser?.role !== 'admin') return null;

  const postColumns = columns; // reuse

  // Google Drive integration state
  const [driveFiles, setDriveFiles] = useState([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const fetchDriveFiles = async ()=>{
    setDriveLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.google.files, { headers:{ ...getAuthHeader() } });
      if(res.status===401){ message.error('Link Google Drive first'); return; }
      const data = await res.json();
      setDriveFiles(data.files||[]);
    } catch(err){ console.error(err); message.error('Failed to load Drive files'); }
    finally { setDriveLoading(false); }
  };
  const importDocAsHtml = async (id)=>{
    try {
      const res = await fetch(API_ENDPOINTS.google.exportHtml(id), { headers:{ ...getAuthHeader() } });
      if(!res.ok) throw new Error('Export failed');
      const html = await res.text();
      // Simple strip of head/body wrappers for insertion
      const cleaned = html.replace(/^[\s\S]*<body[^>]*>/i,'').replace(/<\/body>[\s\S]*$/i,'').trim();
      form.setFieldsValue({ content: (form.getFieldValue('content')||'') + '\n\n' + cleaned });
      message.success('Imported content from Google Doc');
    } catch(err){ message.error(err.message); }
  };

  const applicationsColumns = [
    { title:'Name', dataIndex:'fullName', key:'fullName' },
    { title:'Email', dataIndex:'email', key:'email' },
    { title:'School', dataIndex:'school', key:'school' },
    { title:'Industry', dataIndex:'industryPreference', key:'industryPreference' },
    { title:'Waitlist', dataIndex:'waitlistConsideration', key:'waitlistConsideration' },
    { title:'Status', dataIndex:'status', key:'status', render: v=> <AntTag color={v==='accepted'?'green': v==='rejected'?'red': v==='reviewed'?'blue':'default'}>{v}</AntTag> },
    { title:'Submitted', dataIndex:'createdAt', key:'createdAt', render: v=> v? new Date(v).toLocaleString():'' },
    { title:'Actions', key:'actions', render:(_,record)=> <Space size="small"><Button size="small" onClick={()=> downloadResume(record._id)}>Resume</Button></Space> }
  ];

  const downloadResume = async (id)=>{
    try {
      const res = await fetch(API_ENDPOINTS.applications.resume(id), { headers:{ ...getAuthHeader() } });
      if(!res.ok) throw new Error('Unable to download');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'resume.pdf'; a.click();
      URL.revokeObjectURL(url);
    } catch(err){ message.error(err.message); }
  };

  const updateApplicationStatus = async (id, status)=>{
    try {
      const res = await fetch(API_ENDPOINTS.applications.updateStatus(id), { method:'PATCH', headers:{ 'Content-Type':'application/json', ...getAuthHeader() }, body: JSON.stringify({ status }) });
      if(!res.ok) throw new Error('Status update failed');
      message.success('Status updated');
      fetchApplications(appsPage);
    } catch(err){ message.error(err.message); }
  };

  const handleNavClick = (e)=> setNavCurrent(e.key);

  return (
    <div style={{ overflowX:'hidden', width:'100%' }}>
      <HeaderComponent current={navCurrent} handleClick={handleNavClick} />
      <Layout style={{ minHeight:'100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div style={{ color:'#fff', padding:16, fontWeight:600 }}>Admin</div>
          <Menu theme="dark" mode="inline" selectedKeys={[activeSection]} onClick={(e)=> setActiveSection(e.key)}
            items={[
              { key:'blogs', label:'Blog Posts' },
              { key:'success', label:'Career Stories' },
              { key:'applications', label:'Applications' },
              { key:'consultations', label:'Consultation Requests' },
              { key:'userSubmissions', label:'User Blog Submissions' },
              { key:'mentees', label:'Mentees' },
            ]}
          />
        </Sider>
        <Layout>
          <Content style={{ margin:'24px', background:'transparent' }}>
            {activeSection==='blogs' && (
              <div>
                <Title level={2}>Blog Posts</Title>
                {/* Create form */}
                <div
                  style={{ marginBottom:32, padding:24, background:'#fff', border:'1px solid #eee', borderRadius:8 }}
                  onPaste={async (e)=>{
                    try {
                      const items = e.clipboardData?.items || [];
                      for(const item of items){
                        if(item.kind === 'file' && item.type.startsWith('image/')){
                          const file = item.getAsFile();
                          if(file){
                            const reader = new FileReader();
                            reader.onload = ev => { setCoverBase64(ev.target.result); message.success('Pasted image captured'); };
                            reader.readAsDataURL(file);
                            break;
                          }
                        }
                      }
                    } catch(err){ /* ignore */ }
                  }}
                >
                  <Title level={4} style={{ marginTop:0 }}>{isEditing? 'Edit Post' : 'Create New Post'}</Title>
                  {/* reuse existing create form */}
                  <Form layout="vertical" form={form} onFinish={onCreate} disabled={createLoading}>
                    <Form.Item name="postType" label="Post Type" initialValue="blog" rules={[{ required:true }]}> 
                      <Select options={[{value:'blog', label:'Blog Post'},{value:'success', label:'Success Story'}]} style={{maxWidth:240}} />
                    </Form.Item>
                    <Form.Item name="title" label="Title" rules={[{ required:true, message:'Title required'}]}><Input placeholder="Title" /></Form.Item>
                    <Form.Item name="categories" label="Categories">
                      <Select
                        mode="multiple"
                        placeholder="Select categories"
                        options={PRESET_CATEGORIES.map(c=> ({ value:c.key, label:c.label }))}
                        style={{ maxWidth: 600 }}
                        allowClear
                      />
                    </Form.Item>
                    <Form.Item name="tags" label="Tags (create new by typing and pressing Enter)">
                      <Select
                        mode="tags"
                        placeholder="Add tags"
                        tokenSeparators={[',']}
                        loading={metaLoading}
                        style={{ maxWidth: 600 }}
                        options={tags.map(t=> ({ value:t.name, label:t.name }))}
                      />
                    </Form.Item>
                    <Form.Item name="excerpt" label="Excerpt (optional)"><Input.TextArea rows={2} placeholder="Short summary" /></Form.Item>
                    {/* Google Drive Import Section (moved here) */}
                    <Form.Item label="Import Content (Google Drive)">
                      <Space wrap>
                        <Button onClick={()=> { window.location = API_ENDPOINTS.google.oauthStart; }}>Link / Refresh Google Drive</Button>
                        <Button onClick={fetchDriveFiles} loading={driveLoading}>Load Drive Docs</Button>
                      </Space>
                      {driveFiles.length>0 && (
                        <div style={{ marginTop:12, background:'#fafafa', padding:12, border:'1px solid #eee', borderRadius:6 }}>
                          <strong style={{ display:'block', marginBottom:8 }}>Google Docs (click to import HTML)</strong>
                          <div style={{ maxHeight:180, overflowY:'auto', fontSize:12, lineHeight:1.4 }}>
                            {driveFiles.map(f=> (
                              <div key={f.id} style={{ padding:'4px 6px', cursor:'pointer' }} onClick={()=> importDocAsHtml(f.id)}>
                                {f.name} <span style={{ color:'#666' }}>({f.modifiedTime?.slice(0,10)})</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop:8, fontSize:11, color:'#666' }}>Imported HTML is appended to the Content field; review & clean before publishing.</div>
                        </div>
                      )}
                    </Form.Item>
                    <Form.Item label={isEditing? 'Replace Cover Image (optional)' : 'Cover Image (stored in DB)'}>
                      <Upload
                        beforeUpload={(file)=>{
                          const isImg = file.type.startsWith('image/');
                          if(!isImg){ message.error('Only image files'); return Upload.LIST_IGNORE; }
                          const reader = new FileReader();
                          reader.onload = e => { setCoverBase64(e.target.result); message.success('Image ready for upload'); };
                          reader.readAsDataURL(file);
                          return false; // prevent auto upload
                        }}
                        maxCount={1}
                        accept="image/*"
                        onRemove={()=> setCoverBase64(null)}
                      >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                      </Upload>
                      {isEditing && !coverBase64 && editingPost?.coverImage && (
                        <div style={{ marginTop:8, fontSize:12, color:'#666' }}>Existing cover in use. Selecting a new image will replace it.</div>
                      )}
                      {coverBase64 && <div style={{ marginTop:8, fontSize:12, wordBreak:'break-all' }}>Embedded (base64) size: {Math.round((coverBase64.length*3/4)/1024)} KB</div>}
                    </Form.Item>
                    <Form.Item name="content" label="Content" rules={[{ required:true, message:'Content required'}]}><Input.TextArea rows={8} placeholder="Markdown or plain text content" /></Form.Item>
                    <Form.Item name="featured" label="Featured" valuePropName="checked"><Switch /></Form.Item>
                    <Form.Item>
                      <Space>
                        <Button type="primary" htmlType="submit" loading={createLoading}>{isEditing? 'Save Changes' : 'Save Draft'}</Button>
                        {isEditing && <Button onClick={cancelEdit} disabled={createLoading}>Cancel</Button>}
                      </Space>
                    </Form.Item>
                  </Form>
                </div>
                <div style={{ padding:24, background:'#fff', border:'1px solid #eee', borderRadius:8 }}>
                  <Title level={4} style={{ marginTop:0 }}>Manage Blog Posts</Title>
                  <div style={{ overflowX:'auto' }}>
                    <Table rowKey="_id" dataSource={blogPosts} columns={postColumns} loading={fetching} pagination={{ pageSize:20 }} />
                  </div>
                </div>
              </div>
            )}
            {activeSection==='mentees' && (
              <div>
                <Title level={2}>Mentees</Title>
                <div style={{ marginBottom:12 }}>
                  <Button type="primary" onClick={()=> openMenteeModal(null)}>Add Mentee</Button>
                </div>
                <Table rowKey="_id" dataSource={mentees} loading={menteesLoading}
                  columns={[
                    { title:'#', dataIndex:'order', key:'order', width:60, sorter:(a,b)=> (a.order||0)-(b.order||0) },
                    { title:'Name', dataIndex:'name', key:'name' },
                    { title:'Company', dataIndex:'company', key:'company' },
                    { title:'Position', dataIndex:'position', key:'position' },
                    { title:'Location', dataIndex:'location', key:'location' },
                    { title:'Image', dataIndex:'image', key:'image', render: v=> <span style={{fontSize:12, color:'#999'}}>{v? (v.length>24? (v.slice(0,24)+'…'): v): ''}</span> },
                    { title:'Featured', dataIndex:'featured', key:'featured', render: v=> v? <AntTag color="blue">Yes</AntTag>: <AntTag>No</AntTag> },
                    { title:'Actions', key:'actions', render:(_,r)=> (
                      <Space size="small">
                        <Button size="small" onClick={()=> openMenteeModal(r)}>Edit</Button>
                        <Popconfirm title="Delete?" onConfirm={()=> deleteMentee(r._id)}>
                          <Button danger size="small">Delete</Button>
                        </Popconfirm>
                      </Space>
                    ) }
                  ]}
                  pagination={false}
                />
                <Modal title={editingMentee? 'Edit Mentee':'Add Mentee'} open={menteeModalOpen} onCancel={()=> { setMenteeModalOpen(false); setEditingMentee(null); }} onOk={submitMentee} okText="Save">
                  <Form layout="vertical" form={menteeForm}>
                    <Form.Item name="name" label="Name" rules={[{ required:true }]}>
                      <Input placeholder="Full name" />
                    </Form.Item>
                    <Form.Item name="company" label="Company">
                      <Input placeholder="Company" />
                    </Form.Item>
                    <Form.Item name="position" label="Position">
                      <Input placeholder="Position" />
                    </Form.Item>
                    <Form.Item name="location" label="Location">
                      <Input placeholder="City, State" />
                    </Form.Item>
                    <Form.Item name="image" label="Image URL or /uploads path">
                      <Input placeholder="https://… or /uploads/…" />
                    </Form.Item>
                    <Form.Item name="order" label="Order" initialValue={0}>
                      <Input type="number" min={0} style={{width:120}} />
                    </Form.Item>
                    <Form.Item name="featured" label="Featured" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            )}
            {activeSection==='success' && (
              <div>
                <Title level={2}>Career Stories</Title>
                <div style={{ marginBottom:32, padding:24, background:'#fff', border:'1px solid #eee', borderRadius:8 }}>
                  <Title level={4} style={{ marginTop:0 }}>Create New Career Story</Title>
                  <Form layout="vertical" form={form} onFinish={(vals)=> onCreate({ ...vals, postType:'success' })} disabled={createLoading}>
                    <Form.Item name="title" label="Title" rules={[{ required:true, message:'Title required'}]}><Input placeholder="Title" /></Form.Item>
                    <Form.Item name="categories" label="Categories">
                      <Select
                        mode="multiple"
                        placeholder="Select categories"
                        options={PRESET_CATEGORIES.map(c=> ({ value:c.key, label:c.label }))}
                        style={{ maxWidth: 600 }}
                        allowClear
                      />
                    </Form.Item>
                    <Form.Item name="tags" label="Tags (create new by typing and pressing Enter)">
                      <Select
                        mode="tags"
                        placeholder="Add tags"
                        tokenSeparators={[',']}
                        loading={metaLoading}
                        style={{ maxWidth: 600 }}
                        options={tags.map(t=> ({ value:t.name, label:t.name }))}
                      />
                    </Form.Item>
                    <Form.Item name="excerpt" label="Excerpt (optional)"><Input.TextArea rows={2} placeholder="Short summary" /></Form.Item>
                    <Form.Item label="Cover Image (stored in DB)">
                      <Upload
                        beforeUpload={(file)=>{
                          const isImg = file.type.startsWith('image/');
                          if(!isImg){ message.error('Only image files'); return Upload.LIST_IGNORE; }
                          const reader = new FileReader();
                          reader.onload = e => { setCoverBase64(e.target.result); message.success('Image ready for upload'); };
                          reader.readAsDataURL(file);
                          return false; // prevent auto upload
                        }}
                        maxCount={1}
                        accept="image/*"
                        onRemove={()=> setCoverBase64(null)}
                      >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                      </Upload>
                      {coverBase64 && <div style={{ marginTop:8, fontSize:12, wordBreak:'break-all' }}>Embedded (base64) size: {Math.round((coverBase64.length*3/4)/1024)} KB</div>}
                    </Form.Item>
                    <Form.Item name="content" label="Content" rules={[{ required:true, message:'Content required'}]}><Input.TextArea rows={8} placeholder="Markdown or plain text content" /></Form.Item>
                    <Form.Item name="featured" label="Featured" valuePropName="checked"><Switch /></Form.Item>
                    <Form.Item><Button type="primary" htmlType="submit" loading={createLoading}>Save Draft</Button></Form.Item>
                  </Form>
                </div>
                <div style={{ padding:24, background:'#fff', border:'1px solid #eee', borderRadius:8 }}>
                  <Title level={4} style={{ marginTop:0 }}>Manage Career Stories</Title>
                  <div style={{ overflowX:'auto' }}>
                    <Table rowKey="_id" dataSource={successStories} columns={postColumns} loading={fetching} pagination={{ pageSize:20 }} />
                  </div>
                </div>
              </div>
            )}
            {activeSection==='applications' && (
              <div>
                <Title level={2}>Applications</Title>
                <div style={{ marginBottom:16, display:'flex', gap:12, flexWrap:'wrap' }}>
                  <Input.Search placeholder="Search name/email/school" allowClear style={{ maxWidth:280 }} onSearch={(v)=> { setAppsQuery(v); fetchApplications(1,v); }} />
                  <Select placeholder="Status" allowClear style={{ width:160 }} onChange={(v)=> { setAppsStatusFilter(v||''); fetchApplications(1, appsQuery, v||''); }}
                    options={[{value:'submitted', label:'Submitted'},{value:'reviewed', label:'Reviewed'},{value:'accepted', label:'Accepted'},{value:'rejected', label:'Rejected'}]}
                  />
                </div>
                <Table rowKey="_id" dataSource={applications} columns={[...applicationsColumns, { title:'Set Status', key:'setStatus', render:(_,r)=> (
                  <Select size="small" style={{ width:130 }} value={r.status} onChange={(v)=> updateApplicationStatus(r._id,v)}
                    options={[{value:'submitted',label:'Submitted'},{value:'reviewed',label:'Reviewed'},{value:'accepted',label:'Accepted'},{value:'rejected',label:'Rejected'}]} />
                )}]} loading={appsLoading} pagination={{ pageSize:20, current:appsPage, total:appsTotal, onChange:(p)=> fetchApplications(p) }} />
              </div>
            )}
            {activeSection==='userSubmissions' && (
              <div>
                <Title level={2}>User Blog Submissions</Title>
                <div style={{ padding:24, background:'#fff', border:'1px solid #eee', borderRadius:8 }}>
                  <div style={{ overflowX:'auto' }}>
                    <Table rowKey="_id" dataSource={posts.filter(p=> p.status==='submitted')} columns={[...columns, { title:'Moderation', key:'mod', render:(_,r)=> (
                      <Space size="small">
                        <Button size="small" onClick={()=> publish(r._id,true)}>Approve & Publish</Button>
                        <Button size="small" onClick={()=> updatePostStatus(r._id,'draft')}>Move to Draft</Button>
                        <Popconfirm title="Delete?" onConfirm={()=>remove(r._id)}><Button danger size="small">Delete</Button></Popconfirm>
                      </Space>
                    ) }]} loading={fetching} pagination={{ pageSize:20 }} />
                  </div>
                </div>
              </div>
            )}
            {activeSection==='consultations' && (
              <div>
                <Title level={2}>Consultation Requests</Title>
                <div style={{ marginBottom:16, display:'flex', gap:12, flexWrap:'wrap' }}>
                  <Input.Search placeholder="Search name/email/topic" allowClear style={{ maxWidth:280 }} onSearch={(v)=> { setConsultsQuery(v); fetchConsults(1,v); }} />
                  <Select placeholder="Status" allowClear style={{ width:180 }} onChange={(v)=> { setConsultsStatusFilter(v||''); fetchConsults(1, consultsQuery, v||''); }}
                    options={[{value:'submitted',label:'Submitted'},{value:'reviewed',label:'Reviewed'},{value:'assigned',label:'Assigned'},{value:'scheduled',label:'Scheduled'},{value:'completed',label:'Completed'},{value:'rejected',label:'Rejected'}]}
                  />
                </div>
                <Table rowKey="_id" dataSource={consults} loading={consultsLoading} pagination={{ pageSize:20, current:consultsPage, total:consultsTotal, onChange:(p)=> fetchConsults(p) }}
                  columns={[
                    { title:'Name', dataIndex:'name', key:'name' },
                    { title:'Email', dataIndex:'email', key:'email' },
                    { title:'Topic', dataIndex:'topic', key:'topic' },
                    { title:'Preferred Mentor', dataIndex:'preferredMentor', key:'preferredMentor' },
                    { title:'Status', dataIndex:'status', key:'status' },
                    { title:'Updated', dataIndex:'updatedAt', key:'updatedAt', render: v=> v? new Date(v).toLocaleString():'' },
                    { title:'Actions', key:'actions', render:(_,r)=> (
                      <Space size="small">
                        <Select size="small" value={r.status} style={{ width:150 }} onChange={async (v)=>{
                          try {
                            const res = await fetch(API_ENDPOINTS.consultations.adminUpdate(r._id), { method:'PATCH', headers:{ 'Content-Type':'application/json', ...getAuthHeader() }, body: JSON.stringify({ status: v }) });
                            if(!res.ok) throw new Error('Update failed');
                            message.success('Status updated');
                            fetchConsults(consultsPage);
                          } catch(err){ message.error(err.message); }
                        }} options={[{value:'submitted',label:'Submitted'},{value:'reviewed',label:'Reviewed'},{value:'assigned',label:'Assigned'},{value:'scheduled',label:'Scheduled'},{value:'completed',label:'Completed'},{value:'rejected',label:'Rejected'}]} />
                      </Space>
                    ) }
                  ]}
                />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
