import sanitizeHtml from 'sanitize-html';

const options = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3','span','code','pre']),
  allowedAttributes: {
    a: ['href','name','target','rel'],
    img: ['src','alt','title','width','height'],
    '*': ['style','class']
  },
  allowedSchemes: ['http','https','mailto','tel','data'],
  transformTags: {
    'a': (tag, attribs) => ({ tagName:'a', attribs: { ...attribs, rel:'noopener noreferrer' } })
  }
};

export function sanitizeContent(html){
  if(!html) return '';
  return sanitizeHtml(html, options);
}
