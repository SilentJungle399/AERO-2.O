const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogPostSchema = new Schema(
  {
    // Author information
    author: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
    },

    // Content
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    sections: [
      {
        id: { type: String, required: true },
        headingText: { type: String, },
        headingColor: { type: String },
        headingSize: {
          type: String,
          enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
        },
        content: { type: String, },
        contentStyle: {
          fontFamily: { type: String },
          fontSize: { type: String },
          fontWeight: { type: String },
          fontStyle: { type: String },
          textAlign: {
            type: String,
            enum: ["left", "center", "right", "justify"],
          },
          lineHeight: { type: String },
          color: { type: String },
        },
        backgroundColor: { type: String },
        padding: { type: String },
        margin: { type: String },
        borderRadius: { type: String },
        image: { type: String },
        imagePosition: {
          type: String,
          enum: ["left", "right", "top", "bottom", "background"],
        },
        imageStyle: {
          width: { type: String },
          height: { type: String },
          objectFit: {
            type: String,
            enum: ["cover", "contain", "fill", "none", "scale-down"],
          },
          opacity: { type: Number, min: 0, max: 1 },
        },
        lists: [
          {
            type: { type: String, enum: ["unordered", "ordered"] },
            items: [{ type: String }],
            listStyle: { type: String },
          },
        ],
        quotes: [
          {
            text: { type: String },
            author: { type: String },
            quoteStyle: {
              fontStyle: { type: String },
              fontWeight: { type: String },
              backgroundColor: { type: String },
              borderLeft: { type: String },
            },
          },
        ],
        codeBlocks: [
          {
            code: { type: String },
            language: { type: String },
            highlightLines: [{ type: Number }],
          },
        ],
        tables: [
          {
            headers: [{ type: String }],
            rows: [[{ type: String }]],
            tableStyle: {
              borderColor: { type: String },
              headerBackgroundColor: { type: String },
              alternateRowColor: { type: String },
            },
          },
        ],
        customCSS: { type: String },
      },
    ],

    // Media
    main_image: { type: String, required: true },
    additional_images: [{ type: String }],
    videoUrl: { type: String },

    // Categories and Tags
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tags: [{ type: String }],

    // Engagement
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
    views: { type: Number, default: 0 },

    // Publication Status
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    lastEditor: { type: Schema.Types.ObjectId, ref: "User" },

    // SEO
    slug: { type: String, required: true, unique: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],

    // Additional Metadata
    readingTime: { type: Number },
    featured: { type: Boolean, default: false },

    // External Resources
    externalLinks: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    attachments: [
      {
        filename: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],

    // Moderation
    commentsEnabled: { type: Boolean, default: true },
    reportedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);


// Indexes for improved query performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ "author.userId": 1 });
blogPostSchema.index({ categories: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ isPublished: 1, publishedAt: -1 });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
