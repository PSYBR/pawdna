const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const { check, validationResult } = require('express-validator');

// @route   POST api/posts
// @desc    Create a post (social or blog)
// @access  Private
router.post('/', [ auth, [
  check('content', 'Content is required').not().isEmpty()
] ], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const newPost = new Post({
      author: req.user.id,
      pet: req.body.pet, // optional for pet posts
      title: req.body.title,
      content: req.body.content,
      isBlog: req.body.isBlog || false,
      tags: req.body.tags || []
    });
    const post = await newPost.save();
    res.json(post);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts
// @desc    Get all posts (social and blog)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['name'])
      .populate('pet');
    res.json(posts);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/like/:id
// @desc    Like a post
// @access  Private
router.post('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(post.likes.includes(req.user.id)){
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.push(req.user.id);
    await post.save();
    res.json(post.likes);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post.likes.includes(req.user.id)){
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    await post.save();
    res.json(post.likes);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', [ auth, [
  check('text', 'Text is required').not().isEmpty()
] ], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const post = await Post.findById(req.params.id);
    const newComment = {
      user: req.user.id,
      text: req.body.text
    };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
