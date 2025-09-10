import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StoryList from '../components/StoryList';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Prevent rendering until navigation occurs
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Collaborative Novel</h1>
        <button onClick={logout} className="p-2 bg-red-500 text-white rounded">
          Logout
        </button>
      </div>
      <StoryList />
    </div>
  );
}

export default Home;