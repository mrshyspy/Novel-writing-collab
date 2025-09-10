import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function StoryList() {
  const [stories, setStories] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/stories', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setStories(res.data));
  }, []);

  const createStory = async () => {
    const title = prompt('Enter story title');
    if (title) {
      await axios.post('http://localhost:5000/api/stories', { title }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Stories</h2>
      <button onClick={createStory} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Create New Story
      </button>
      <ul className="space-y-2">
        {stories.map(story => (
          <li key={story.id} className="p-2 border rounded">
            <a href={`/story/${story.id}`} className="text-blue-500">{story.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoryList;