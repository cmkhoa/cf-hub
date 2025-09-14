"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Switch, Select, Upload, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/authContext/authContext';
import { API_ENDPOINTS, getAuthHeader } from '@/config/api';

const { Title } = Typography;

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

export default function SubmitBlogPage(){
  const router = useRouter();
  const { userLoggedIn } = useAuth();
  const [form] = Form.useForm();
  const [coverBase64, setCoverBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(()=>{ if(!userLoggedIn) router.replace('/login?next=/dashboard/submit-blog'); },[userLoggedIn, router]);

  useEffect(()=>{
    const fetchTags = async ()=>{
      try { const res = await fetch(API_ENDPOINTS.blog.tags); const data = await res.json(); setTags(data||[]); } catch{}
    };
    fetchTags();
  },[]);

  const onSubmit = async (values)=>{
    setLoading(true);
    try {
      const body = {
        postType: 'blog',
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || '',
        featured: false,
        categories: values.categories || [],
        tags: values.tags || [],
        coverImageBase64: coverBase64,
        status: 'submitted'
      };
      const res = await fetch(API_ENDPOINTS.blog.posts, { method:'POST', headers:{ 'Content-Type':'application/json', ...getAuthHeader() }, body: JSON.stringify(body) });
      if(!res.ok) throw new Error('Submit failed');
      message.success('Blog submitted for review');
      form.resetFields();
      setCoverBase64(null);
    } catch(err){ message.error(err.message); }
    finally { setLoading(false); }
  };

  if(!userLoggedIn) return null;

  return (
    <div style={{ maxWidth:900, margin:'48px auto', padding:'0 24px' }}>
      <Title level={2}>Submit a Blog</Title>
      <div style={{ padding:24, background:'#fff', border:'1px solid #eee', borderRadius:8 }}>
        <Form layout="vertical" form={form} onFinish={onSubmit} disabled={loading}>
          <Form.Item name="title" label="Title" rules={[{ required:true }]}><Input placeholder="Blog title" /></Form.Item>
          <Form.Item name="categories" label="Categories">
            <Select
              mode="multiple"
              placeholder="Select categories"
              options={PRESET_CATEGORIES.map(c=> ({ value:c.key, label:c.label }))}
              style={{ maxWidth: 600 }}
              allowClear
            />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              tokenSeparators={[',']}
              style={{ maxWidth: 600 }}
              options={tags.map(t=> ({ value:t.name, label:t.name }))}
              placeholder="Add tags"
            />
          </Form.Item>
          <Form.Item name="excerpt" label="Excerpt"><Input.TextArea rows={2} placeholder="Short summary" /></Form.Item>
          <Form.Item label="Cover Image">
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
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required:true }]}><Input.TextArea rows={8} placeholder="Markdown or plain text content" /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" loading={loading}>Submit for Review</Button></Form.Item>
        </Form>
      </div>
    </div>
  );
}
