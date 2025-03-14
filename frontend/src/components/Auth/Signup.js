import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch(err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Signup</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block">Name</label>
          <input type="text" name="name" value={name} onChange={onChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block">Email</label>
          <input type="email" name="email" value={email} onChange={onChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} className="w-full border p-2 rounded" required />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
