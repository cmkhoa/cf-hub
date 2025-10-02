"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR problems
const ReactQuill = dynamic(()=> import('react-quill'), { ssr: false });

const toolbarOptions = [
  [{ header: [1,2,3,4,5,false] }],
  ['bold','italic','underline','strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['blockquote','code-block'],
  ['link','image'],
  ['clean']
];

export default function RichTextEditor({ value, onChange, placeholder }){
  const [mounted,setMounted] = useState(false);
  useEffect(()=>{ setMounted(true); },[]);
  if(!mounted) return <div style={{ padding:8, minHeight:160, border:'1px solid #d9d9d9', borderRadius:6, background:'#fafafa' }}>Loading editor…</div>;
  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      modules={{ toolbar: toolbarOptions }}
      style={{ background:'#fff' }}
    />
  );
}
