'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { UserPlus, Sparkles, User, Lock, Mail } from 'lucide-react';
import { playClickSound } from '@/lib/audio/soundEffects';

export default function RegisterPage() {
  const { register, enableDemoMode } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const success = await register(name, email, password);
    if (!success) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(15,20,35,0.72)] backdrop-blur-[22px] border border-white/90 dark:border-white/8 shadow-[0_8px_30px_rgba(109,74,235,0.07)] dark:shadow-none">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-[linear-gradient(135deg,#6EE7C8,#B69CFF_55%,#FFAFD1)] shadow-md shadow-[#6D4AEB]/15 flex items-center justify-center mb-4">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-[#1B1D2A] dark:text-white">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-[#8B8FA3] mt-2 text-center">
            Join AURA to orchestrate autonomous support intelligence.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(15,20,35,0.5)] border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#1B1D2A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6D4AEB] focus:ring-1 focus:ring-[#6D4AEB] transition"
                placeholder="Jane Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(15,20,35,0.5)] border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#1B1D2A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6D4AEB] focus:ring-1 focus:ring-[#6D4AEB] transition"
                placeholder="jane@aura.inc"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(15,20,35,0.5)] border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#1B1D2A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6D4AEB] focus:ring-1 focus:ring-[#6D4AEB] transition"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
             type="submit"
             className="w-full py-2.5 rounded-xl bg-[#6D4AEB] text-white text-sm font-semibold hover:bg-[#5b3dc4] transition flex items-center justify-center gap-2 mt-2 shadow-[0_4px_14px_rgba(109,74,235,0.39)]"
          >
            <UserPlus size={16} /> Sign Up
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-[#8B8FA3]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#6D4AEB] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
