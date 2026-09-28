'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReasoningStep } from '@/lib/types';
import { Terminal, Cpu, Zap } from 'lucide-react';

import { playStepSound } from '@/lib/audio/soundEffects';

const AGENT_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Router: { color: 'text-[#6D4AEB] ', bg: 'bg-[rgba(109,74,235,0.06)] ', border: 'border-[rgba(109,74,235,0.2)] ' },
  Billing: { color: 'text-[#C97A00] ', bg: 'bg-[rgba(201,122,0,0.06)] ', border: 'border-[rgba(201,122,0,0.2)] ' },
  Technical: { color: 'text-fuchsia-600 ', bg: 'bg-fuchsia-500/[0.06] ', border: 'border-fuchsia-500/20 ' },
  Order: { color: 'text-[#0E9C74] ', bg: 'bg-[rgba(14,156,116,0.06)] ', border: 'border-[rgba(14,156,116,0.2)] ' },
  Account: { color: 'text-indigo-600 ', bg: 'bg-indigo-500/[0.06] ', border: 'border-indigo-500/20 ' },
  Reasoning: { color: 'text-blue-600 ', bg: 'bg-blue-500/[0.06] ', border: 'border-blue-500/20 ' },
  Escalation: { color: 'text-[#E11D48] ', bg: 'bg-[rgba(225,29,72,0.06)] ', border: 'border-[rgba(225,29,72,0.2)] ' },
};

export default function ReasoningTimeline({
  steps,
  onComplete,
  onProgress,
}: {
  steps: ReasoningStep[];
  onComplete?: () => void;
  onProgress?: (revealedSteps: ReasoningStep[]) => void;
}) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    onProgress?.([]);
    if (!steps.length) return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisible(i);
      playStepSound();
      onProgress?.(steps.slice(0, i));
      if (i >= steps.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 600); // 600ms snappy cadence

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-slate-700   border-b border-[rgba(109,74,235,0.08)]  pb-2">
        <div className="flex items-center gap-2 font-mono">
          <Terminal size={14} className="text-[#6D4AEB] " />
          <span>Chain-of-Thought Stream</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-700  ">
          <span className="flex items-center gap-1 text-[#6D4AEB] ">
            <Zap size={12} /> 85 tok/s
          </span>
          <span className="text-slate-700  ">|</span>
          <span className="flex items-center gap-1">
            <Cpu size={12} className="text-[#6D4AEB] " /> Qwen-Plus
          </span>
        </div>
      </div>

      <div className="space-y-2.5 font-mono text-xs max-h-72 overflow-y-auto pr-1">
        <AnimatePresence>
          {steps.slice(0, visible).map((s, idx) => {
            const isLast = idx === visible - 1;
            const conf = AGENT_CONFIG[s.agent] || { color: 'text-gray-600 ', bg: 'bg-white/5 ', border: 'border-black/10 ' };
            const timestampOffset = `+${(idx * 0.22).toFixed(2)}s`;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`flex gap-3 items-start p-2.5 rounded-xl border transition-all duration-300 ${
                  isLast
                    ? 'border-[rgba(109,74,235,0.3)]  bg-[rgba(109,74,235,0.04)]    shadow-sm'
                    : 'border-white/90  bg-[rgba(255,255,255,0.5)] '
                }`}
              >
                <div className="flex flex-col items-center shrink-0 pt-0.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isLast ? 'bg-[#6D4AEB]  animate-pulse' : 'bg-[#0E9C74] '
                    }`}
                  />
                  <span className="text-[10px] text-gray-500 mt-1 font-mono">{timestampOffset}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${conf.bg} ${conf.color} ${conf.border}`}
                    >
                      {s.agent}
                    </span>
                  </div>
                  <p className="text-[#1B1D2A]  leading-relaxed break-words">{s.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
