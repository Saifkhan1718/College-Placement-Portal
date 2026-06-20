import React, { useState } from 'react';
import {
  Settings,
  HardDriveDownload,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const SystemSettings = () => {
  const [signupActive, setSignupActive] = useState(true);
  const [offcampusActive, setOffcampusActive] = useState(false);
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [message, setMessage] = useState('');

  const triggerBackup = () => {
    setLoadingBackup(true);
    setMessage('');
    setTimeout(() => {
      setLoadingBackup(false);
      setMessage('Database backup snapshot compiled and saved to server root successfully.');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Global Portal Configurations</h1>
        <p className="text-xs text-slate-500 mt-1">Configure registrations locks, security rules, and database routines.</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5" />
          {message}
        </div>
      )}

      {/* Settings Options Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 space-y-6">
        {/* Toggle signups */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              {signupActive ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-rose-500" />}
              Student Registration Signups
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Controls if new student registration requests are accepted.</p>
          </div>
          <button onClick={() => setSignupActive(!signupActive)} className="cursor-pointer text-brand-500 transition-colors">
            {signupActive ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12 text-slate-400" />}
          </button>
        </div>

        {/* Toggle offcampus */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-slate-800 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              Off-Campus Registration Routing
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Allows candidates outside university rolls to apply.</p>
          </div>
          <button onClick={() => setOffcampusActive(!offcampusActive)} className="cursor-pointer text-brand-500 transition-colors">
            {offcampusActive ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12 text-slate-400" />}
          </button>
        </div>

        {/* Database routines */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-brand-500" /> Administrative Routines
          </h3>
          <p className="text-[10px] text-slate-500">Backup overall Mongo database schemas, application records, and user lists.</p>
          <button
            onClick={triggerBackup}
            disabled={loadingBackup}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <HardDriveDownload className="w-4.5 h-4.5" />
            {loadingBackup ? 'Running Backup snapshot...' : 'Backup Database snapshot'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
