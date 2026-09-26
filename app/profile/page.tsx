'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { User as UserIcon, Shield, Save, LogOut } from 'lucide-react';
import { playClickSound } from '@/lib/audio/soundEffects';
import { useAppState } from '@/lib/context/AppStateContext';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { pushToast } = useAppState();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    updateProfile({ name, email });
    pushToast('Profile updated successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-extrabold text-[#1B1D2A] dark:text-white flex items-center gap-2">
          <UserIcon className="text-[#6D4AEB]" /> My Profile
        </h1>
        {user.role === 'admin' && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6D4AEB]/10 border border-[#6D4AEB]/30 text-[#6D4AEB] text-xs font-semibold">
            <Shield size={14} /> Admin Access Granted
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(15,20,35,0.72)] backdrop-blur-[22px] border border-white/90 dark:border-white/8 shadow-[0_8px_30px_rgba(109,74,235,0.07)] dark:shadow-none flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[linear-gradient(135deg,#6EE7C8,#B69CFF_55%,#FFAFD1)] flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-[#1B1D2A] dark:text-white">{user.name}</h2>
            <p className="text-sm text-slate-500 dark:text-[#8B8FA3]">{user.email}</p>
            <p className="text-xs mt-2 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              ID: {user.id}
            </p>

            <button
              onClick={() => {
                playClickSound();
                logout();
              }}
              className="mt-6 w-full py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(15,20,35,0.72)] backdrop-blur-[22px] border border-white/90 dark:border-white/8 shadow-[0_8px_30px_rgba(109,74,235,0.07)] dark:shadow-none">
            <h3 className="text-lg font-bold text-[#1B1D2A] dark:text-white mb-4">Edit Details</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(15,20,35,0.5)] border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm text-[#1B1D2A] dark:text-white focus:outline-none focus:border-[#6D4AEB] focus:ring-1 focus:ring-[#6D4AEB] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(15,20,35,0.5)] border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm text-[#1B1D2A] dark:text-white focus:outline-none focus:border-[#6D4AEB] focus:ring-1 focus:ring-[#6D4AEB] transition"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6D4AEB] text-white text-sm font-semibold hover:bg-[#5b3dc4] transition flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(109,74,235,0.39)]"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>

          {user.role === 'admin' && (
            <div className="p-6 rounded-3xl bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(15,20,35,0.72)] backdrop-blur-[22px] border border-[#6D4AEB]/30 shadow-[0_8px_30px_rgba(109,74,235,0.07)] dark:shadow-none">
              <h3 className="text-lg font-bold text-[#1B1D2A] dark:text-white mb-2 flex items-center gap-2">
                <Shield className="text-[#6D4AEB]" size={20} /> Administrator Settings
              </h3>
              <p className="text-sm text-slate-500 dark:text-[#8B8FA3] mb-4">
                Global settings for the AURA instance. Changes made here apply to all agents.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(15,20,35,0.5)]">
                  <div>
                    <h4 className="font-semibold text-sm text-[#1B1D2A] dark:text-white">Strict Routing Mode</h4>
                    <p className="text-xs text-slate-500 dark:text-[#8B8FA3]">Only allow pre-approved agent corridors.</p>
                  </div>
                  <button className="w-10 h-6 bg-[#6D4AEB] rounded-full relative transition-colors">
                    <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(15,20,35,0.5)]">
                  <div>
                    <h4 className="font-semibold text-sm text-[#1B1D2A] dark:text-white">Auto-Train KB</h4>
                    <p className="text-xs text-slate-500 dark:text-[#8B8FA3]">Automatically draft KB articles on resolution.</p>
                  </div>
                  <button className="w-10 h-6 bg-[#6D4AEB] rounded-full relative transition-colors">
                    <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
