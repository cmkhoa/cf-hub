"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, Select, message, Table, Tag } from 'antd';
import { useAuth } from '@/contexts/authContext/authContext';
import { API_ENDPOINTS, getAuthHeader } from '@/config/api';

const { Title } = Typography;

export default function ConsultationPage(){
  const router = useRouter();
  const { userLoggedIn } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(()=>{ if(!userLoggedIn) router.replace('/login?next=/dashboard/consultation'); },[userLoggedIn, router]);

  const fetchMine = async ()=>{
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.consultations.mine, { headers: { ...getAuthHeader() } });
      if(!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRequests(data || []);
    } catch(err){ message.error(err.message); } finally { setLoading(false); }
  };

  useEffect(()=>{ if(userLoggedIn) fetchMine(); },[userLoggedIn]);

  const onSubmit = async (values)=>{
    setSubmitting(true);
    try {
      const res = await fetch(API_ENDPOINTS.consultations.submit, { method:'POST', headers:{ 'Content-Type':'application/json', ...getAuthHeader() }, body: JSON.stringify(values) });
      if(!res.ok) throw new Error('Submit failed');
      message.success('Consultation request submitted');
      form.resetFields();
      fetchMine();
    } catch(err){ message.error(err.message); } finally { setSubmitting(false); }
  };

  const columns = [
    { title:'Topic', dataIndex:'topic', key:'topic' },
    { title:'Preferred Mentor', dataIndex:'preferredMentor', key:'preferredMentor' },
    { title:'Status', dataIndex:'status', key:'status', render: v=> <Tag color={v==='submitted'?'default': v==='reviewed'?'blue': v==='assigned'?'orange': v==='scheduled'?'purple': v==='completed'?'green':'red'}>{v}</Tag> },
    { title:'Updated', dataIndex:'updatedAt', key:'updatedAt', render: v=> v? new Date(v).toLocaleString():'' }
  ];

  if(!userLoggedIn) return null;

  return (
    <div style={{ maxWidth:900, margin:'48px auto', padding:'0 24px' }}>
      <Title level={2}>1-1 Consultation</Title>
      <div style={{ padding:24, background:'#fff', border:'1px solid #eee', borderRadius:8, marginBottom:32 }}>
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item name="name" label="Your Name" rules={[{ required:true }]}><Input placeholder="Full name" /></Form.Item>
          <Form.Item name="email" label="Your Email" rules={[{ required:true, type:'email' }]}><Input placeholder="Email" /></Form.Item>
          <Form.Item name="preferredMentor" label="Preferred Mentor (optional)"><Input placeholder="Mentor name" /></Form.Item>
          <Form.Item name="topic" label="Topic" rules={[{ required:true }]}><Input placeholder="e.g., Resume review, interview prep" /></Form.Item>
          <Form.Item name="goals" label="Goals" rules={[{ required:true }]}><Input.TextArea rows={3} placeholder="Describe your goals" /></Form.Item>
          <Form.Item name="availability" label="Availability" rules={[{ required:true }]}><Input.TextArea rows={2} placeholder="Share your available times" /></Form.Item>
          <Form.Item name="timezone" label="Time Zone"><Input placeholder="e.g., PST, GMT+7" /></Form.Item>
          <Form.Item name="contactMethod" label="Preferred Contact Method"><Select allowClear options={[{value:'email',label:'Email'},{value:'zoom',label:'Zoom'},{value:'phone',label:'Phone'}]} /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" loading={submitting}>Submit Request</Button></Form.Item>
        </Form>
      </div>

      <div style={{ padding:24, background:'#fff', border:'1px solid #eee', borderRadius:8 }}>
        <Title level={4} style={{ marginTop:0 }}>Your Requests</Title>
        <Table rowKey="_id" columns={columns} dataSource={requests} loading={loading} pagination={{ pageSize:10 }} />
      </div>
    </div>
  );
}
