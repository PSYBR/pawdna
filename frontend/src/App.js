import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Feed from './components/Social/Feed';
import PetList from './components/PetProfile/PetList';
import PetForm from './components/PetProfile/PetForm';
import BlogList from './components/Blog/BlogList';
import BlogPost from './components/Blog/BlogPost';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/new" element={<PetForm />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
