import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import axios from 'axios';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  CheckCircle,
  Inbox,
  UserCheck
} from 'lucide-react';

export const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.auth);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const API_URL = 'http://localhost:5000/api';

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notifications`);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Hook into Socket for real-time notifications count and list update
  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((c) => c + 1);
      });
      socket.on('new_campus_drive', () => {
        fetchNotifications();
      });
      socket.on('new_job_broadcast', () => {
        fetchNotifications();
      });
    }
    return () => {
      if (socket) {
        socket.off('new_notification');
        socket.off('new_campus_drive');
        socket.off('new_job_broadcast');
      }
    };
  }, [socket]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md">
      {/* Sidebar Hamburguer for Mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden text-slate-600 dark:text-slate-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Portal Control Center
          </h2>
        </div>
      </div>

      {/* Right Header Panel */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 border border-white dark:border-slate-950 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifPanel && (
            <>
              <div
                onClick={() => setShowNotifPanel(false)}
                className="fixed inset-0 z-40 bg-transparent"
              ></div>
              <div className="absolute right-0 mt-3 w-80 max-h-[420px] z-50 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
                <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications list */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500">All caught up! No notifications yet.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleMarkAsRead(n._id)}
                        className={`p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20 cursor-pointer ${
                          !n.read ? 'bg-brand-50/20 dark:bg-brand-500/5' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <span
                            className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                              !n.read ? 'bg-brand-500' : 'bg-transparent'
                            }`}
                          />
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                              {n.title}
                            </h4>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
                              {new Date(n.createdAt).toLocaleDateString()} at{' '}
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Info Circle */}
        <div className="flex items-center gap-3 border-l border-slate-200/50 dark:border-slate-800/80 pl-3">
          <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="hidden md:block">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">
              {user?.name}
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium capitalize mt-1 block">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
