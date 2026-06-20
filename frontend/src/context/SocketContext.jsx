import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [toasts, setToasts] = useState([]);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    let socketInstance = null;

    if (isAuthenticated && user) {
      // Connect to server
      socketInstance = io('http://localhost:5000');
      
      // Join room
      socketInstance.emit('join', user._id);
      
      setSocket(socketInstance);

      // Listen for generic notifications
      socketInstance.on('new_notification', (data) => {
        showToast(data.title, data.message, 'info');
      });

      // Listen for drive announcements
      socketInstance.on('new_campus_drive', (data) => {
        showToast(
          'Campus Drive Alert!',
          `${data.companyName} drive scheduled on ${new Date(data.driveDate).toLocaleDateString()} at ${data.location}`,
          'success'
        );
      });

      // Listen for job broadcasts
      socketInstance.on('new_job_broadcast', (data) => {
        showToast(data.title, data.message, 'warning');
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
      setSocket(null);
    };
  }, [isAuthenticated, user]);

  const showToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <SocketContext.Provider value={{ socket, showToast }}>
      {children}
      
      {/* Real-time overlay alerts wrapper */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className="cursor-pointer glass-panel p-4 rounded-2xl border border-white/20 dark:border-slate-800/80 shadow-2xl animate-slide-in flex flex-col gap-1 overflow-hidden relative group"
            style={{
              background: t.type === 'success' 
                ? 'rgba(16, 185, 129, 0.15)' 
                : t.type === 'warning' 
                ? 'rgba(245, 158, 11, 0.15)' 
                : 'rgba(99, 102, 241, 0.15)',
              borderColor: t.type === 'success'
                ? '#10b981'
                : t.type === 'warning'
                ? '#f59e0b'
                : '#6366f1'
            }}
          >
            {/* Ambient glowing particle */}
            <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full blur-xl opacity-30 bg-current transition-all group-hover:scale-125"></div>
            
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{
                backgroundColor: t.type === 'success' ? '#10b981' : t.type === 'warning' ? '#f59e0b' : '#6366f1'
              }}></span>
              {t.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.message}
            </p>
          </div>
        ))}
      </div>
    </SocketContext.Provider>
  );
};
