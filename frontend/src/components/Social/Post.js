import React, { useState } from 'react';
import axios from 'axios';

function Post({ post }) {
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments);

  const token = localStorage.getItem('token');

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:5000/api/posts/like/${post._id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setLikeCount(likeCount + 1);
    } catch(err) {
      console.error(err);
    }
  };

  const handleComment = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/comment/${post._id}`, { text: commentText }, {
        headers: { 'x-auth-token': token }
      });
      setComments(res.data);
      setCommentText('');
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      {post.title && <h3 className="text-xl font-bold">{post.title}</h3>}
      <p>{post.content}</p>
      <div className="mt-2">
        <button onClick={handleLike} className="text-blue-500">Like ({likeCount})</button>
      </div>
      <div className="mt-2">
        <form onSubmit={handleComment}>
          <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment" className="border p-1 rounded w-full" />
          <button type="submit" className="mt-1 bg-green-500 text-white py-1 px-2 rounded">Comment</button>
        </form>
      </div>
      <div className="mt-2">
        {comments.map(comment => (
          <div key={comment._id} className="border-t pt-2">
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
