"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Tag, Typography, Space, Empty } from 'antd';
import { useAuth } from '@/contexts/authContext/authContext';
import { API_ENDPOINTS, getAuthHeader } from '@/config/api';

const { Title } = Typography;

export default function MyApplicationsPage(){
  const { userLoggedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(()=>{ if(!userLoggedIn) router.replace('/login'); },[userLoggedIn, router]);
  useEffect(()=>{
    let cancelled = false;
    const load = async ()=>{
      if(!userLoggedIn) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.applications.submit}/mine`, { headers: { ...getAuthHeader() } });
        if(!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if(!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch(e){ if(!cancelled) setItems([]); }
      finally { if(!cancelled) setLoading(false); }
    };
    load();
    return ()=>{ cancelled = true; };
  }, [userLoggedIn]);

  const statusTag = (s)=>{
    const label = s === 'reviewed' ? 'processing' : s;
    const color = s === 'accepted' ? 'green' : s === 'rejected' ? 'red' : 'gold';
    return <Tag color={color} style={{ textTransform:'capitalize' }}>{label}</Tag>;
  };

  const columns = [
    { title: 'Submitted', dataIndex: 'createdAt', key:'createdAt', render: v => new Date(v).toLocaleString() },
    { title: 'Name', dataIndex: 'fullName', key:'fullName' },
    { title: 'Email', dataIndex: 'email', key:'email' },
    { title: 'School', dataIndex: 'school', key:'school', ellipsis: true },
    { title: 'Status', dataIndex: 'status', key:'status', render: statusTag },
    { title: 'Notes', dataIndex: 'adminNotes', key:'adminNotes', ellipsis: true },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '60px auto', padding: '0 24px' }}>
      <Title level={2}>My Applications</Title>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={items}
          columns={columns}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No applications yet" /> }}
        />
      </Space>
    </div>
  );
}
