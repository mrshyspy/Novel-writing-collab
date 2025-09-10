import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import io from 'socket.io-client';

const Editor = ({ storyId, user }) => {
  const doc = new Y.Doc();
  const provider = new WebsocketProvider('ws://localhost:5000', storyId, doc, {
    params: { token: localStorage.getItem('token') }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({ document: doc }),
      CollaborationCursor.configure({
        provider,
        user: { name: user.name, color: '#'+Math.floor(Math.random()*16777215).toString(16) }
      })
    ]
  });

  useEffect(() => {
    const socket = io('http://localhost:5000', {
      query: { storyId, token: localStorage.getItem('token') },
      auth: { name: user.name }
    });

    socket.on('update', (update) => Y.applyUpdate(doc, new Uint8Array(update)));
    socket.on('cursor', ({ userId, cursor }) => {
      // Update cursor positions in UI
    });
    socket.on('presence', ({ userId, status }) => {
      // Update collaborator list
    });

    return () => {
      provider.destroy();
      socket.disconnect();
    };
  }, [storyId, user]);

  return <EditorContent editor={editor} className="prose max-w-none p-4" />;
};

export default Editor;