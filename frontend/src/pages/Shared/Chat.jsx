import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketContext.jsx';
import axios from 'axios';
import {
  MessageSquare,
  Volume2,
  Send,
  User,
  Megaphone,
  Plus,
  Clock,
  Shield
} from 'lucide-react';

export const Chat = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState('announcements'); // 'announcements' or 'direct'
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  
  // Direct chats state
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messageElRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : 'https://college-placement-portal-fvu8.onrender.com/api');

  // Helper to generate auth headers dynamically to prevent 401 token mismatch issues
  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token || localStorage.getItem('token')}`,
    },
  });

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/chat/announcements`, getAuthConfig());
      setAnnouncements(data);
    } catch (e) {
      console.error('Error fetching TPO announcements:', e);
    }
  };

  // Fetch demo contacts depending on user role
  const fetchContacts = async () => {
    try {
      let contactsRes;
      if (user.role === 'student') {
        // Students chat with recruiters
        contactsRes = await axios.get(`${API_URL}/tpo/recruiters`, getAuthConfig());
      } else {
        // Recruiters/TPO chat with students
        contactsRes = await axios.get(`${API_URL}/tpo/students`, getAuthConfig());
      }

      // Map to standardized format
      const list = contactsRes.data.map((c) => ({
        id: c.user?._id || c._id,
        name: c.user?.name || c.name,
        email: c.user?.email || c.email,
        sub: c.company?.name || c.department || 'Student',
      }));
      setContacts(list);
    } catch (e) {
      console.error('Error fetching chat contacts:', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnnouncements();
      fetchContacts();
    }
  }, [user, token]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (messageElRef.current) {
      messageElRef.current.scrollTop = messageElRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, announcements]);

  // Socket triggers
  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on('receive_message', (msg) => {
        if (selectedContact && (msg.sender === selectedContact.id || msg.recipient === selectedContact.id)) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      // Listen for incoming direct websocket-only messages
      socket.on('receive_direct_message', (msg) => {
        if (selectedContact && msg.senderId === selectedContact.id) {
          setMessages((prev) => [...prev, {
            sender: msg.senderId,
            recipient: user._id,
            message: msg.message,
            createdAt: msg.createdAt,
          }]);
        }
      });

      // Listen for new announcements
      socket.on('new_announcement', (ann) => {
        setAnnouncements((prev) => [ann, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('receive_direct_message');
        socket.off('new_announcement');
      }
    };
  }, [socket, selectedContact]);

  // Load message history with contact
  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    setLoadingMessages(true);
    try {
      const { data } = await axios.get(`${API_URL}/chat/messages/${contact.id}`, getAuthConfig());
      setMessages(data);
    } catch (e) {
      console.error('Error loading message history:', e);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send Direct Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const text = newMessage;
    setNewMessage('');

    try {
      const { data } = await axios.post(`${API_URL}/chat/messages`, {
        recipientId: selectedContact.id,
        message: text,
      }, getAuthConfig());

      setMessages((prev) => [...prev, data]);

      // Emit web socket message fallback trigger
      if (socket) {
        socket.emit('send_direct_message', {
          senderId: user._id,
          recipientId: selectedContact.id,
          message: text,
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Post Announcement
  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    const text = newAnnouncement;
    setNewAnnouncement('');

    try {
      await axios.post(`${API_URL}/chat/announcements`, { message: text }, getAuthConfig());
      fetchAnnouncements();
    } catch (err) {
      console.error('Error posting TPO announcement:', err);
    }
  };

  const isTpoOrAdmin = user?.role === 'tpo' || user?.role === 'admin';

  return (
    <div className="glass-panel border border-white/20 dark:border-slate-800/80 rounded-3xl overflow-hidden" style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'calc(100vh - 140px)' }}>
      <div className="border-r border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30" style={{ width: '320px', minWidth: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex gap-2">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
            }`}
          >
            <Volume2 className="w-4 h-4" /> Announcements
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'direct'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Direct Messages
          </button>
        </div>

        {/* Scrollable contents */}
        <div className="flex-grow overflow-y-auto p-3.5 space-y-1.5">
          {activeTab === 'announcements' ? (
            <div
              onClick={() => setSelectedContact(null)}
              className="w-full p-3 rounded-xl bg-brand-50 dark:bg-brand-900/10 border border-brand-500/20 text-left cursor-pointer transition-colors"
            >
              <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-brand-500" />
                Success Broadcast Board
              </h4>
              <p className="text-[10px] text-slate-500 mt-1">Official announcements by TPO office.</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3.5 ${
                  selectedContact?.id === contact.id
                    ? 'bg-brand-500 border-brand-500 text-white shadow-md'
                    : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 text-slate-600 dark:text-slate-300">
                  {contact.name ? contact.name[0].toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold truncate leading-none">{contact.name}</h4>
                  <span className="text-[9px] opacity-75 mt-1 block truncate font-medium">
                    {contact.sub}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="bg-transparent" style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0 }}>
        {/* Right Header */}
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3 bg-slate-50/20 dark:bg-slate-900/10 shrink-0">
          <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
            {selectedContact ? (selectedContact.name ? selectedContact.name[0].toUpperCase() : 'U') : <Megaphone className="w-4.5 h-4.5" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white leading-none">
              {selectedContact ? selectedContact.name : 'TPO Broadcast Channels'}
            </h3>
            <span className="text-[9px] text-slate-400 font-medium block mt-1">
              {selectedContact ? selectedContact.sub : 'Campus-wide announcements'}
            </span>
          </div>
        </div>

        {/* Message View Area */}
        <div ref={messageElRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/10 dark:bg-slate-900/5">
          {activeTab === 'announcements' ? (
            announcements.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-12">No announcements posted yet.</div>
            ) : (
              announcements.map((ann) => (
                <div
                  key={ann._id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-brand-500 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      {ann.sender?.name} ({ann.sender?.role?.toUpperCase()})
                    </span>
                    <span className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ann.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-line">
                    {ann.message}
                  </p>
                </div>
              ))
            )
          ) : !selectedContact ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
              <MessageSquare className="w-10 h-10 text-slate-400 opacity-40 mb-2" />
              Select a contact to begin direct conversation messages.
            </div>
          ) : loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-400 text-xs py-12">No messages recorded. Send a greeting!</div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender === user._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3.5 rounded-2xl shadow-sm text-xs leading-normal break-words ${
                      isMine
                        ? 'bg-brand-500 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className={`text-[8px] block text-right mt-1.5 opacity-60`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/20 dark:bg-slate-900/10 shrink-0">
          {activeTab === 'announcements' ? (
            isTpoOrAdmin ? (
              <form onSubmit={handlePostAnnouncement} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Broadcast a new placement season announcement..."
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  className="flex-grow px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-4.5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                >
                  <Megaphone className="w-4 h-4" /> Broadcast
                </button>
              </form>
            ) : (
              <div className="text-center py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900/40 rounded-xl">
                Read-Only Feed. Announcements managed by placement officer.
              </div>
            )
          ) : (
            selectedContact && (
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
