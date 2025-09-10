import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Editor from '../components/Editor';
import Invite from '../components/Invite';

function Story() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Story Editor</h1>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Editor storyId={id} user={user} />
        </div>
        <div className="w-1/4">
          <Invite storyId={id} />
        </div>
      </div>
    </div>
  );
}

export default Story;