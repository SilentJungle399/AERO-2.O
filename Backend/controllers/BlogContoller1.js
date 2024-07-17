const BlogPost = require('../models/BlogPost'); // Adjust the path as needed
const mongoose = require('mongoose');

const blogController = {
  // Create a new blog post
  
  createBlogPost: async (req, res) => {
    try {
      const newBlogPost = new BlogPost(req.body);
      const savedBlogPost = await newBlogPost.save();
      res.status(201).json(savedBlogPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all blog posts (with pagination)
  getAllBlogPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { publishedAt: -1 },
        populate: 'author.userId categories'
      };

      const blogPosts = await BlogPost.paginate({}, options);
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single blog post by slug
  getBlogPostBySlug: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOne({ slug: req.params.slug })
        .populate('author.userId')
        .populate('categories');
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a blog post
  updateBlogPost: async (req, res) => {
    try {
      const updatedBlogPost = await BlogPost.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedBlogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(updatedBlogPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a blog post
  deleteBlogPost: async (req, res) => {
    try {
      const deletedBlogPost = await BlogPost.findOneAndDelete({ slug: req.params.slug });
      if (!deletedBlogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add a new section to a blog post
  addSection: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOne({ slug: req.params.slug });
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      blogPost.sections.push(req.body);
      const updatedBlogPost = await blogPost.save();
      res.json(updatedBlogPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a specific section in a blog post
  updateSection: async (req, res) => {
    try {
      const { slug, sectionId } = req.params;
      const blogPost = await BlogPost.findOne({ slug });
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      const sectionIndex = blogPost.sections.findIndex(section => section.id === sectionId);
      if (sectionIndex === -1) {
        return res.status(404).json({ message: 'Section not found' });
      }
      blogPost.sections[sectionIndex] = { ...blogPost.sections[sectionIndex], ...req.body };
      const updatedBlogPost = await blogPost.save();
      res.json(updatedBlogPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a specific section from a blog post
  deleteSection: async (req, res) => {
    try {
      const { slug, sectionId } = req.params;
      const blogPost = await BlogPost.findOne({ slug });
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      blogPost.sections = blogPost.sections.filter(section => section.id !== sectionId);
      const updatedBlogPost = await blogPost.save();
      res.json(updatedBlogPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Publish or unpublish a blog post
  togglePublishStatus: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOne({ slug: req.params.slug });
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      blogPost.isPublished = !blogPost.isPublished;
      blogPost.publishedAt = blogPost.isPublished ? new Date() : null;
      const updatedBlogPost = await blogPost.save();
      res.json(updatedBlogPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Increment view count
  incrementViews: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOneAndUpdate(
        { slug: req.params.slug },
        { $inc: { views: 1 } },
        { new: true }
      );
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json({ views: blogPost.views });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add a comment to a blog post
  addComment: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOne({ slug: req.params.slug });
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      blogPost.comments.push(req.body.commentId);
      const updatedBlogPost = await blogPost.save();
      res.json(updatedBlogPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Add an upvote to a blog post
  addUpvote: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOne({ slug: req.params.slug });
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      if (!blogPost.upvotes.includes(req.body.userId)) {
        blogPost.upvotes.push(req.body.userId);
        const updatedBlogPost = await blogPost.save();
        res.json(updatedBlogPost);
      } else {
        res.status(400).json({ message: 'User has already upvoted this post' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Report a blog post
  reportBlogPost: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOne({ slug: req.params.slug });
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      if (!blogPost.reportedBy.includes(req.body.userId)) {
        blogPost.reportedBy.push(req.body.userId);
        const updatedBlogPost = await blogPost.save();
        res.json(updatedBlogPost);
      } else {
        res.status(400).json({ message: 'User has already reported this post' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Search blog posts
  searchBlogPosts: async (req, res) => {
    try {
      const { query, page = 1, limit = 10 } = req.query;
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: 'author.userId categories'
      };

      const searchQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { summary: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ],
        isPublished: true
      };

      const blogPosts = await BlogPost.paginate(searchQuery, options);
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = blogController;