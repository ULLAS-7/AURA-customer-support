'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MessageSquare,
  LayoutDashboard,
  LineChart,
  GitGraph,
  Zap,
  Download,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Command,
  LucideIcon,
  Sun,
  Moon,
} from 'lucide-react';
import { useAppState } from '@/lib/context/AppStateContext';
import {
  isSoundEnabled,
  setSoundEnabled,
  playClickSound,
  playSuccessSound,
} from '@/lib/audio/soundEffects';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Simulate Scenarios' | 'System Actions';
  label: string;
  sublabel: string;
  icon: LucideIcon;
  action: () => void;
  badge?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { resetDemo, tickets, capsules, resolvedCapsules, theme, toggleTheme } = useAppState();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: 'nav-chat',
      category: 'Navigation',
      label: 'Customer Chat',
      sublabel: 'Interactive customer interface with multi-agent consensus live stream',
      icon: MessageSquare,
      action: () => {
        router.push('/');
        onClose();
      },
    },
    {
      id: 'nav-dashboard',
      category: 'Navigation',
      label: 'Operations Dashboard',
      sublabel: 'Review warm Context Capsules, agent triage, and incident briefs',
      icon: LayoutDashboard,
      action: () => {
        router.push('/dashboard');
        onClose();
      },
    },
    {
      id: 'nav-analytics',
      category: 'Navigation',
      label: 'Analytics Dashboard',
      sublabel: '24-Hour incident density heatmap and deflection analytics',
      icon: LineChart,
      action: () => {
        router.push('/analytics');
        onClose();
      },
    },
    {
      id: 'nav-workflow',
      category: 'Navigation',
      label: 'Workflow DAG',
      sublabel: 'Orchestration architecture graph with step debugger and speed controls',
      icon: GitGraph,
      action: () => {
        router.push('/workflow');
        onClose();
      },
    },

    // Simulations
    {
      id: 'sim-stripe',
      category: 'Simulate Scenarios',
      label: 'Simulate: Stripe Webhook Card Decline (402)',
      sublabel: 'Dispatch invoice failure with proactive churn risk assessment',
      icon: Zap,
      badge: 'Billing Agent',
      action: () => {
        router.push('/?prompt=Payment%20failed%20for%20invoice%20INV-2024-8842%20due%20to%20card_declined');
        onClose();
      },
    },
    {
      id: 'sim-gdpr',
      category: 'Simulate Scenarios',
      label: 'Simulate: GDPR Article 17 Data Erasure',
      sublabel: 'Enterprise compliance verification and human-in-the-loop escalation',
      icon: Sparkles,
      badge: 'Compliance Agent',
      action: () => {
        router.push('/?prompt=Under%20GDPR%20Article%2017%2C%20I%20demand%20immediate%20deletion%20of%20all%20user%20records');
        onClose();
      },
    },
    {
      id: 'sim-rate-limit',
      category: 'Simulate Scenarios',
      label: 'Simulate: API Gateway 429 Throttle Cascade',
      sublabel: 'High-volume bursting diagnosis and temporary quota backoff response',
      icon: Zap,
      badge: 'Technical Agent',
      action: () => {
        router.push('/?prompt=Production%20microservices%20receiving%20HTTP%20429%20Rate%20Limit%20Exceeded');
        onClose();
      },
    },

    // System Actions
    {
      id: 'act-export',
      category: 'System Actions',
      label: 'Export Audit Data',
      sublabel: 'Download JSON export of tickets, capsules, and resolutions',
      icon: Download,
      action: () => {
        const data = JSON.stringify({ tickets, capsules, resolvedCapsules }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aura-audit-dossier-${Date.now()}.json`;
        a.click();
        playSuccessSound();
        onClose();
      },
    },
    {
      id: 'act-sound',
      category: 'System Actions',
      label: 'Toggle Audio Feedback',
      sublabel: 'Toggle system sound effects',
      icon: isSoundEnabled() ? Volume2 : VolumeX,
      action: () => {
        const next = !isSoundEnabled();
        setSoundEnabled(next);
        if (next) playSuccessSound();
        onClose();
      },
    },
    {
      id: 'act-theme',
      category: 'System Actions',
      label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'}`,
      sublabel: `Toggle between light and dark interface themes`,
      icon: theme === 'light' ? Moon : Sun,
      action: () => {
        toggleTheme();
        playSuccessSound();
        onClose();
      },
    },
    {
      id: 'act-reset',
      category: 'System Actions',
      label: 'Reset Demo State to Clean Baseline',
      sublabel: 'Clear current conversation memory and restore initial seed tickets',
      icon: RotateCcw,
      action: () => {
        resetDemo();
        playSuccessSound();
        onClose();
      },
    },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.sublabel.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      playClickSound();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      playClickSound();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        playClickSound();
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-white/60  backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white/95  backdrop-blur-[22px] border border-[rgba(109,74,235,0.2)]  shadow-[0_8px_40px_rgba(109,74,235,0.15)]  overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(109,74,235,0.08)]  bg-[rgba(255,255,255,0.5)] ">
          <Search size={18} className="text-[#6D4AEB]  shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, scenario, or navigate... (e.g. 'Stripe', 'Analytics')"
            className="w-full bg-transparent text-[#1B1D2A]  placeholder-[#9599AD]  text-sm focus:outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#6B6E85]  bg-[rgba(255,255,255,0.7)]  border border-white/90  px-2 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Command Items List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#6B6E85]  text-sm">
              <Command size={28} className="mx-auto text-[#9599AD]  mb-2" />
              No commands matching "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playClickSound();
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-[rgba(109,74,235,0.08)]     border border-[rgba(109,74,235,0.25)]  text-[#1B1D2A]  shadow-sm'
                      : 'hover:bg-[rgba(255,255,255,0.5)]  text-[#6B6E85]  border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-[rgba(109,74,235,0.12)] text-[#6D4AEB]  '
                          : 'bg-[rgba(255,255,255,0.7)]  text-[#6B6E85] '
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#1B1D2A]  truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[rgba(109,74,235,0.06)]  border border-[rgba(109,74,235,0.2)]  text-[#6D4AEB] ">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#9599AD]  truncate mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-mono text-[#9599AD]  uppercase tracking-wider hidden sm:inline">
                      {item.category}
                    </span>
                    {isSelected && (
                      <ArrowRight size={13} className="text-[#6D4AEB] " />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[rgba(255,255,255,0.5)]  border-t border-[rgba(109,74,235,0.08)]  flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.7)]  border border-white/90  rounded font-mono text-[9px] text-[#6B6E85] ">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.7)]  border border-white/90  rounded font-mono text-[9px] text-[#6B6E85] ">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.7)]  border border-white/90  rounded font-mono text-[9px] text-[#6B6E85] ">
                Esc
              </kbd>
              Close
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#6D4AEB] ">AURA Command</span>
        </div>
      </div>
    </div>
  );
}
