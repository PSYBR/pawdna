import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        // Filter for blog posts
        const blogPosts = res.data.filter(post => post.isBlog);
        setPosts(blogPosts);
      } catch(err) {
        console.error(err);
      }
    };
    fetchBlogPosts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Pet Care Blog</h2>
      {posts.map(post => (
        <div key={post._id} className="bg-white p-4 rounded shadow mb-4">
          <Link to={`/blog/${post._id}`}>
            <h3 className="text-xl font-bold">{post.title}</h3>
          </Link>
          <p>{post.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default BlogList;
