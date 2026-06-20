import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/authSlice.js';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Calendar,
  FileText,
  BrainCircuit,
  MessageSquare,
  Users,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Define links based on user role
  const getNavLinks = () => {
    switch (user?.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'My Profile', path: '/student/profile', icon: User },
          { name: 'Browse Jobs', path: '/student/jobs', icon: Briefcase },
          { name: 'Interviews', path: '/student/interviews', icon: Calendar },
          { name: 'AI Resume Score', path: '/student/ai-resume', icon: FileText },
          { name: 'Placement Predictor', path: '/student/ai-predictor', icon: BrainCircuit },
          { name: 'Chat & Board', path: '/shared/chat', icon: MessageSquare },
        ];
      case 'recruiter':
        return [
          { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
          { name: 'Company Profile', path: '/recruiter/company', icon: Building2 },
          { name: 'Manage Jobs', path: '/recruiter/jobs', icon: Briefcase },
          { name: 'Applicants Tracker', path: '/recruiter/applicants', icon: Users },
          { name: 'Chat & Board', path: '/shared/chat', icon: MessageSquare },
        ];
      case 'tpo':
        return [
          { name: 'Dashboard', path: '/tpo/dashboard', icon: LayoutDashboard },
          { name: 'Student Eligibility', path: '/tpo/students', icon: Users },
          { name: 'Verify Recruiters', path: '/tpo/recruiters', icon: ShieldCheck },
          { name: 'Approve Jobs', path: '/tpo/jobs', icon: Briefcase },
          { name: 'Campus Drives', path: '/tpo/drives', icon: Calendar },
          { name: 'Broadcast Board', path: '/shared/chat', icon: MessageSquare },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Manage Users', path: '/admin/users', icon: Users },
          { name: 'Audit Logs', path: '/admin/audit', icon: FileText },
          { name: 'System Settings', path: '/admin/settings', icon: Settings },
          { name: 'Broadcast Board', path: '/shared/chat', icon: MessageSquare },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Sidebar overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-full border-r border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200/50 dark:border-slate-800/80">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 shadow-lg shadow-brand-500/20 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200">
              NexusPlacement
            </h1>
            <span className="text-[10px] font-semibold tracking-wider text-brand-600 dark:text-brand-400 uppercase">
              {user?.role} Portal
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 dark:shadow-brand-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-slate-950 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-500'}`} />
                    {link.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile / Logout */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/80">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-brand-500 dark:from-slate-800 dark:to-brand-600 flex items-center justify-center font-bold text-slate-800 dark:text-white text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                {user?.name || 'User'}
              </h4>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
