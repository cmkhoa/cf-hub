"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/utils/sanitizeContent';

function looksLikeHtml(str){
  return /<\w+[^>]*>/i.test(str) && /<\/\w+>/.test(str);
}

export default function PostContent({ content }){
  if(!content) return null;
  if(looksLikeHtml(content)){
    const safe = sanitizeContent(content);
    return <div className="post-html" dangerouslySetInnerHTML={{ __html: safe }} />;
  }
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
