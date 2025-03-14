const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Pet = require('../models/Pet');

// @route   GET api/feed
// @desc    Get activity feed for the logged in user (posts from followed pets)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find pets that the user is following
    const followedPets = await Pet.find({ followers: req.user.id }).select('_id');
    const petIds = followedPets.map(pet => pet._id);
    
    // Get posts associated with these pets
    const posts = await Post.find({ pet: { $in: petIds } })
                            .populate('author', ['name'])
                            .populate('pet');
    res.json(posts);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
