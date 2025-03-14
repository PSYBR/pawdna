import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PetForm() {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    photos: '',
    bio: ''
  });
  const navigate = useNavigate();

  const { name, breed, age, photos, bio } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const payload = { ...formData, photos: photos.split(',').map(url => url.trim()) };
      await axios.post('http://localhost:5000/api/pets', payload, {
        headers: { 'x-auth-token': token }
      });
      navigate('/pets');
    } catch(err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Add New Pet</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block">Pet Name</label>
          <input type="text" name="name" value={name} onChange={onChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block">Breed</label>
          <input type="text" name="breed" value={breed} onChange={onChange} className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block">Age</label>
          <input type="number" name="age" value={age} onChange={onChange} className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block">Photos (comma separated URLs)</label>
          <input type="text" name="photos" value={photos} onChange={onChange} className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block">Bio</label>
          <textarea name="bio" value={bio} onChange={onChange} className="w-full border p-2 rounded"></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Save Pet</button>
      </form>
    </div>
  );
}

export default PetForm;
