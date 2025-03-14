const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pet = require('../models/Pet');
const { check, validationResult } = require('express-validator');

// @route   POST api/pets
// @desc    Create a pet profile
// @access  Private
router.post('/', [ auth, [
  check('name', 'Pet name is required').not().isEmpty()
] ], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const newPet = new Pet({
      owner: req.user.id,
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      photos: req.body.photos,
      bio: req.body.bio
    });
    const pet = await newPet.save();
    res.json(pet);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/pets
// @desc    Get all pet profiles for the logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    res.json(pets);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/pets/:id
// @desc    Update a pet profile
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, breed, age, photos, bio } = req.body;
  const petFields = {};
  if(name) petFields.name = name;
  if(breed) petFields.breed = breed;
  if(age) petFields.age = age;
  if(photos) petFields.photos = photos;
  if(bio) petFields.bio = bio;
  
  try {
    let pet = await Pet.findById(req.params.id);
    if(!pet) return res.status(404).json({ msg: 'Pet not found' });
    if(pet.owner.toString() !== req.user.id){
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    pet = await Pet.findByIdAndUpdate(req.params.id, { $set: petFields }, { new: true });
    res.json(pet);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/pets/:id
// @desc    Delete a pet profile
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    if(!pet) return res.status(404).json({ msg: 'Pet not found' });
    if(pet.owner.toString() !== req.user.id){
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await Pet.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Pet removed' });
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/pets/follow/:id
// @desc    Follow a pet
// @access  Private
router.post('/follow/:id', auth, async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ msg: 'Pet not found' });
    if (pet.followers.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already following this pet' });
    }
    pet.followers.push(req.user.id);
    await pet.save();
    res.json({ msg: 'Pet followed', followers: pet.followers });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
 
// @route   POST api/pets/unfollow/:id
// @desc    Unfollow a pet
// @access  Private
router.post('/unfollow/:id', auth, async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ msg: 'Pet not found' });
    if (!pet.followers.includes(req.user.id)) {
      return res.status(400).json({ msg: 'You are not following this pet' });
    }
    pet.followers = pet.followers.filter(follower => follower.toString() !== req.user.id);
    await pet.save();
    res.json({ msg: 'Pet unfollowed', followers: pet.followers });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
