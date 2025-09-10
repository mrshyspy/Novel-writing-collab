import React, { useState } from 'react';
import axios from 'axios';

function Invite({ storyId }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [expiresAt, setExpiresAt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/stories/${storyId}/invite`, {
        email,
        role,
        expiresAt: expiresAt || null
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Invite sent');
    } catch (error) {
      alert('Failed to send invite');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold">Invite Collaborator</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Collaborator Email"
          className="w-full p-2 border rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="author">Author</option>
          <option value="editor">Editor</option>
          <option value="commenter">Commenter</option>
          <option value="viewer">Viewer</option>
        </select>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Send Invite
        </button>
      </form>
    </div>
  );
}

export default Invite;