"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button, Space } from 'antd';
import { useAuth } from '@/contexts/authContext/authContext';

const { Title, Paragraph } = Typography;

export default function UserDashboardPage(){
  const { userLoggedIn, currentUser } = useAuth();
  const router = useRouter();
  useEffect(()=>{ if(!userLoggedIn) router.replace('/login'); },[userLoggedIn, router]);
  if(!userLoggedIn) return null;
  return (
    <div style={{ maxWidth:900, margin:'60px auto', padding:'0 24px' }}>
      <Title level={2}>Your Dashboard</Title>
      <Paragraph>Welcome {currentUser?.name || currentUser?.email}. Use the shortcuts below to get started.</Paragraph>
      <Space size="middle" wrap>
        <Button type="primary" onClick={()=> router.push('/dashboard/consultation')}>Request 1-1 Consultation</Button>
        <Button onClick={()=> router.push('/dashboard/submit-blog')}>Submit a Blog</Button>
  <Button onClick={()=> router.push('/dashboard/applications')}>My Applications</Button>
      </Space>
    </div>
  );
}
