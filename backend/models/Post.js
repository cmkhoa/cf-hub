const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema({
  postType: {
    type: String,
    enum: ["blog", "success"],
    default: "blog",
    index: true,
  },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, maxlength: 400 },
  content: { type: String, required: true }, // store markdown or HTML
  coverImage: { type: String },
  coverImageData: { type: Buffer },
  coverImageMime: { type: String },
  status: {
    type: String,
    enum: ["draft", "submitted", "published", "archived"],
    default: "draft",
    index: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  featured: { type: Boolean, default: false, index: true },
  readingTimeMins: { type: Number },
  views: { type: Number, default: 0 },
  meta: {
    title: String,
    description: String,
    keywords: [String],
  },
  publishedAt: { type: Date },
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Text index for search on title + content + excerpt
postSchema.index({ title: "text", content: "text", excerpt: "text" });

// Auto slug + reading time
postSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified("content")) {
    const words = this.content ? this.content.split(/\s+/).length : 0;
    this.readingTimeMins = Math.max(1, Math.round(words / 200));
  }
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

// Ensure JSON output converts coverImageData buffer to base64 string (if present)
postSchema.set("toJSON", {
  transform: function (_doc, ret) {
    if (ret.coverImageData && Buffer.isBuffer(ret.coverImageData)) {
      ret.coverImageData = ret.coverImageData.toString("base64");
    }
    return ret;
  },
});

module.exports = mongoose.model("Post", postSchema);
