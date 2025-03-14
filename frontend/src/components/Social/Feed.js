import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/feed', {
          headers: { 'x-auth-token': token }
        });
        setPosts(res.data);
      } catch(err) {
        console.error(err);
      }
    };
    fetchFeed();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Activity Feed</h2>
      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
