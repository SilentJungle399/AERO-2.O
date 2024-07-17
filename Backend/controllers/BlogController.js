const express = require('express');
const router = express.Router();
const BlogModel = require('../models/blogmodels/BlogsModel'); // Assuming you've defined the Blog model in a separate file
const CategoryModel = require('../models/blogmodels/CategoriesModel'); // Assuming you have this model
const UserModel = require('../models/usermodel'); // Assuming you have this model

// Get all categories
const getAllCAtegories= async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    console.log(categories)
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create a new category
const addNewCategory=async (req, res) => {
  let parent_=req.body.parent;
  if(parent_==''){
    parent_=null;
  }
  const category = new CategoryModel({
    name: req.body.name,
    description: req.body.description,
    parent: parent_,
  });
  console.log(category)

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Get a specific category
const getOneCategory= async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a category
const updateCategory= async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (req.body.name != null) {
      category.name = req.body.name;
    }
    if (req.body.description != null) {
      category.description = req.body.description;
    }
    if (req.body.slug != null) {
      category.slug = req.body.slug;
    }
    if (req.body.parent != null) {
      category.parent = req.body.parent;
    }
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


const deletecategory= async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await category.remove();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



const getAllBlogs= async (req, res) => {
  try {
    const blogs = await BlogModel.find().populate('categories');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create a new blog post
const createNewBlog = async (req, res) => {
  const { uid, title, content, summary, main_image, additional_images, tags, category, seoTitle, seoDescription, seoKeywords, slug } = req.body;
  console.log("req.body")
  console.log(req.body)
  try {
    const foundAuthor = await UserModel.findById(uid).select('full_name email');
    console.log(foundAuthor)

    if (!foundAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const authorDetails = {
      userId: foundAuthor._id,
      name: foundAuthor.full_name,
      email: foundAuthor.email,
    };
    console.log(req.body)
    const foundcategory=await CategoryModel.findById(category);
    console.log(foundcategory)

    const blog = new BlogModel({
      author: authorDetails,
      title,
      content,
      summary,
      main_image,
      additional_images,
      tags,
      categories:category,
      seoTitle,
      seoDescription,
      seoKeywords,
      slug:slug,
    });

    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBlogPostBySlug= async (req, res) => {
  try {
    console.log("kjds")
    const blogPost = await BlogModel.findOne({ slug: req.params.slug })
      .populate('author.userId')
      .populate('categories');
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Get a specific blog post
const getOneBlog= async (req, res) => {
  try {
    
    const blog = await BlogModel.findById(req.params.id).populate('categories');
    if (blog == null) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a blog post
const updatedBlog= async (req, res) => {
  const { slug } = req.params;
  console.log(slug)
  const { sections } = req.body;
  console.log(sections)


  try {
    // Find the blog post by slug
    const blog = await BlogModel.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Update the sections of the blog post
    blog.sections = sections;

    // Save the updated blog post
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete a blog post
const deleteBlog= async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    await blog.remove();
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports ={deletecategory,updateCategory,getOneCategory,addNewCategory,getAllCAtegories,deleteBlog,updatedBlog,getOneBlog,createNewBlog,getAllBlogs,getBlogPostBySlug}