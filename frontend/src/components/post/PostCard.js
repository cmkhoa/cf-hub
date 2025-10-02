"use client";
import React from 'react';

export default function PostCard({ post, onClick, layout='card' }) {
  const title = post.title;
  const excerpt = post.excerpt ? String(post.excerpt).trim() : '';
  const coverBase64 = post.coverImageData ? `data:${post.coverImageMime||'image/jpeg'};base64,${post.coverImageData}` : null;
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const renderTags = tags.length ? (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop: excerpt ? 4 : 0 }}>
      {tags.map(t => {
        const key = t._id || t.name || t;
        const label = t.name || t;
        return (
          <span key={key} style={{ background:'#f0f2f5', color:'#555', fontSize:11, padding:'2px 6px', borderRadius:4, lineHeight:1.2 }}>
            {label}
          </span>
        );
      })}
    </div>
  ) : null;

  if(layout === 'row') {
    return (
      <div
        onClick={onClick}
        style={{
          display:'flex', gap:16, padding:16, border:'1px solid #eee', borderRadius:8, background:'#fff', cursor:'pointer',
          alignItems:'stretch'
        }}
      >
        <div style={{ width:160, flex:'0 0 160px', position:'relative', overflow:'hidden', borderRadius:6, background:'#f5f5f5' }}>
          {coverBase64 ? <img src={coverBase64} alt={title} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{fontSize:12, color:'#888', display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>No Image</div>}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{ margin:'0 0 8px', fontSize:20, lineHeight:1.2 }}>{title}</h3>
          {excerpt && <p style={{ margin:'0 0 8px', color:'#555', fontSize:14, lineHeight:1.45 }}>{excerpt}</p>}
          {renderTags}
        </div>
      </div>
    );
  }

  return (
    <article
      onClick={onClick}
      style={{ background:'#fff', border:'1px solid #eee', borderRadius:8, overflow:'hidden', cursor:'pointer', display:'flex', flexDirection:'column' }}
    >
      <div style={{ position:'relative', width:'100%', paddingTop:'56%', background:'#f5f5f5' }}>
        {coverBase64 ? <img src={coverBase64} alt={title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} /> : (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#888' }}>No Image</div>
        )}
      </div>
      <div style={{ padding:16, display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ margin:'0 0 8px', fontSize:18 }}>{title}</h3>
  {excerpt && <p style={{ margin:'0 0 8px', color:'#555', fontSize:14, lineHeight:1.45 }}>{excerpt}</p>}
        {renderTags}
      </div>
    </article>
  );
}
