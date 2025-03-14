import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts`);
        const blogPost = res.data.find(p => p._id === id);
        setPost(blogPost);
      } catch(err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id]);

  if(!post) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
      <p>{post.content}</p>
      <div className="mt-4">
        <p>Tags: {post.tags.join(', ')}</p>
      </div>
    </div>
  );
}

export default BlogPost;
