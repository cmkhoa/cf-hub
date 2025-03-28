// pages/api/blog/[id].js

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { id } = req.query;

  // Build the path to the markdown file dynamically
  const blogPath = path.join(process.cwd(), `src/content/blogs/${id}/index.md`);

  // Check if the file exists; if not, return a 404 response
  if (!fs.existsSync(blogPath)) {
    return res.status(404).json({ error: "Blog post not found" });
  }

  // Read and send the markdown content
  const markdownContent = fs.readFileSync(blogPath, "utf8");
  res.status(200).json({ content: markdownContent });
}
