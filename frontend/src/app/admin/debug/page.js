"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext/authContext';
import { auth } from '@/services/firebase/firebase';
import { API_ENDPOINTS, getAuthHeader } from '@/config/api';
import { Typography, Descriptions, Button, Space, Tag, message } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function AdminDebugPage(){
  const { currentUser, userLoggedIn } = useAuth();
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileStatus, setProfileStatus] = useState('idle');
  const [tokenPreview, setTokenPreview] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{ setMounted(true); },[]);

  const loadFirebase = () => {
    try { setFirebaseUid(auth?.currentUser?.uid || null); }
    catch { setFirebaseUid(null); }
  };

  const loadProfile = async () => {
    setProfileStatus('loading');
    try {
      const res = await fetch(API_ENDPOINTS.auth.profile, { headers:{ ...getAuthHeader() } });
      if(!res.ok){ setProfileStatus('error'); return; }
      const data = await res.json();
      setProfile(data);
      setProfileStatus('ok');
    } catch(err){
      console.error(err);
      setProfileStatus('error');
    }
  };

  const refreshAll = () => { loadFirebase(); loadProfile(); loadTokenPreview(); message.success('Refreshed'); };

  const loadTokenPreview = () => {
    if(typeof window === 'undefined') return;
    const t = localStorage.getItem('token');
    if(!t) { setTokenPreview(null); return; }
    setTokenPreview(`${t.slice(0,8)}…${t.slice(-8)}`);
  };

  useEffect(()=>{ loadFirebase(); loadProfile(); loadTokenPreview(); },[userLoggedIn]);

  if(!mounted) return null; // avoid hydration mismatch
  if(!userLoggedIn || currentUser?.role !== 'admin') return <div style={{padding:40}}><Title level={4}>Not authorized</Title></div>;

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 24px' }}>
      <Title level={2}>Admin Debug Panel</Title>
      <Paragraph type="secondary">Internal diagnostic view to confirm Firebase ⇄ Backend ⇄ Mongo linkage.</Paragraph>
      <Space style={{ marginBottom: 24 }} wrap>
        <Button onClick={refreshAll}>Refresh</Button>
        <Button onClick={loadFirebase}>Reload Firebase UID</Button>
        <Button onClick={loadProfile}>Reload Backend Profile</Button>
        <Button onClick={loadTokenPreview}>Reload Token Preview</Button>
      </Space>
      <Descriptions bordered column={1} size="small" labelStyle={{ width: 220 }}>
        <Descriptions.Item label="Logged In">
          {userLoggedIn ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag color={currentUser?.role === 'admin' ? 'blue' : 'default'}>{currentUser?.role || 'n/a'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Email">{currentUser?.email || '—'}</Descriptions.Item>
        <Descriptions.Item label="Firebase UID (client)">{firebaseUid || '—'}</Descriptions.Item>
        <Descriptions.Item label="Mongo User Id">{profile?._id || profile?.id || '—'}</Descriptions.Item>
        <Descriptions.Item label="firebaseUid in Mongo">{profile?.firebaseUid || '—'}</Descriptions.Item>
        <Descriptions.Item label="Backend Profile Status">
          {profileStatus === 'ok' && <Tag color="green">OK</Tag>}
          {profileStatus === 'loading' && <Tag color="gold">LOADING</Tag>}
          {profileStatus === 'error' && <Tag color="red">ERROR</Tag>}
          {profileStatus === 'idle' && <Tag>IDLE</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="JWT Preview">{tokenPreview || '—'} <Text type="secondary">(first/last 8 chars)</Text></Descriptions.Item>
        <Descriptions.Item label="Last Login">{profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : '—'}</Descriptions.Item>
        <Descriptions.Item label="Created At">{profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : '—'}</Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop:32 }}>
        <Title level={4}>Interpretation</Title>
        <ul style={{ lineHeight: 1.6 }}>
          <li>If Firebase UID is present but firebaseUid in Mongo is —, re‑sign in with Google to force exchange.</li>
          <li>If role ≠ admin but you promoted this email, log out then sign in again to refresh token.</li>
          <li>If Backend Profile Status is ERROR, your stored JWT may be invalid; try a fresh login.</li>
        </ul>
      </div>
    </div>
  );
}
