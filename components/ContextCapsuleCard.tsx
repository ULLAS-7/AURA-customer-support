'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextCapsule } from '@/lib/types';
import {
  AlertTriangle,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import CapsuleHeader from './capsule/CapsuleHeader';
import CapsuleSentimentArc from './capsule/CapsuleSentimentArc';
import CapsuleReportModal from './capsule/CapsuleReportModal';

const URGENCY_STYLES: Record<string, { badge: string; border: string; glow: string }> = {
  High: {
    badge: 'bg-[color-mix(in_srgb,var(--rose)_8%,transparent)] text-[#E11D48] border-[color-mix(in_srgb,var(--rose)_20%,transparent)]   ',
    border: 'border-[color-mix(in_srgb,var(--rose)_20%,transparent)] hover:border-[color-mix(in_srgb,var(--rose)_40%,transparent)]  ',
    glow: 'from-[color-mix(in_srgb,var(--rose)_4%,transparent)] via-transparent to-transparent   ',
  },
  Medium: {
    badge: 'bg-[color-mix(in_srgb,var(--amber)_8%,transparent)] text-[#C97A00] border-[color-mix(in_srgb,var(--amber)_20%,transparent)]   ',
    border: 'border-[color-mix(in_srgb,var(--amber)_20%,transparent)] hover:border-[color-mix(in_srgb,var(--amber)_40%,transparent)]  ',
    glow: 'from-[color-mix(in_srgb,var(--amber)_4%,transparent)] via-transparent to-transparent   ',
  },
  Low: {
    badge: 'bg-[color-mix(in_srgb,var(--mint)_8%,transparent)] text-[#0E9C74] border-[color-mix(in_srgb,var(--mint)_20%,transparent)]   ',
    border: 'border-[color-mix(in_srgb,var(--mint)_20%,transparent)] hover:border-[color-mix(in_srgb,var(--mint)_40%,transparent)]  ',
    glow: 'from-[color-mix(in_srgb,var(--mint)_4%,transparent)] via-transparent to-transparent   ',
  },
};

const TIER_BADGES: Record<string, string> = {
  Enterprise: 'bg-[color-mix(in_srgb,var(--indigo)_8%,transparent)] text-[#6D4AEB] border-[color-mix(in_srgb,var(--indigo)_25%,transparent)]    shadow-[0_0_12px_color-mix(in_srgb,var(--indigo)_10%,transparent)] ',
  Pro: 'bg-[color-mix(in_srgb,var(--mint)_8%,transparent)] text-[#0E9C74] border-[color-mix(in_srgb,var(--mint)_25%,transparent)]    shadow-[0_0_12px_color-mix(in_srgb,var(--mint)_10%,transparent)] ',
  Free: 'bg-[rgba(107,110,133,0.08)] text-slate-700  border-[rgba(107,110,133,0.2)]   ',
};

export default function ContextCapsuleCard({
  capsule,
  onResolve,
  onDelete,
}: {
  capsule: ContextCapsule;
  onResolve: (id: string, note: string) => void;
  onDelete?: (id: string) => void;
}) {
  const [note, setNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const urgencyConfig = URGENCY_STYLES[capsule.urgency] || URGENCY_STYLES.Medium;
  const tierClass = TIER_BADGES[capsule.customerTier] || TIER_BADGES.Free;

  const ltvDisplay =
    capsule.customerTier === 'Enterprise'
      ? '$14,400 LTV'
      : capsule.customerTier === 'Pro'
      ? '$870 LTV'
      : 'Conversion Prospect';

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(capsule, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (presetText: string) => {
    setNote(presetText);
    setResolving(true);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`glass-card p-5 space-y-5 relative overflow-hidden border transition-all duration-300 bg-gradient-to-b ${urgencyConfig.glow} ${urgencyConfig.border}`}
      >
        <CapsuleHeader
          capsule={capsule}
          urgencyConfig={urgencyConfig}
          tierClass={tierClass}
          onShowReport={() => setShowReportModal(true)}
          onCopyPayload={handleCopyPayload}
          copied={copied}
          onDelete={onDelete}
        />

        {/* Category, LTV & Time Meta */}
        <div className="flex flex-wrap items-center justify-between text-xs border-y border-[color-mix(in_srgb,var(--indigo)_8%,transparent)]  py-2.5 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 ">Domain:</span>
            <span className="px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.5)]  border border-white/90  text-[#1B1D2A]  font-medium">
              {capsule.category}
            </span>
            <span className="text-slate-600 ">·</span>
            <span className="text-slate-600 ">Account Exposure:</span>
            <span className="px-2 py-0.5 rounded-md bg-[color-mix(in_srgb,var(--indigo)_6%,transparent)]  border border-[color-mix(in_srgb,var(--indigo)_20%,transparent)]  text-[#6D4AEB]  font-mono text-[11px]">
              {ltvDisplay}
            </span>
          </div>

          {capsule.createdAt && (
            <span className="font-mono text-slate-600   text-[11px]">
              {new Date(capsule.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <CapsuleSentimentArc sentimentTrend={capsule.sentimentTrend} />

        {/* Root Cause Analysis */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-700  font-medium mb-1.5">Corroborated Root Cause</p>
          <p className="text-sm text-[#1B1D2A]  leading-relaxed bg-[rgba(255,255,255,0.5)]  border border-white/90  rounded-xl p-3">
            {capsule.rootCause}
          </p>
        </div>

        {/* What AURA Already Executed */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-700   font-medium mb-1.5 flex items-center gap-1.5">
            <Zap size={13} className="text-[#6D4AEB] " /> Automated Interventions Executed
          </p>
          <div className="space-y-1.5">
            {capsule.attemptedActions.slice(0, 4).map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-[#1B1D2A]  bg-[rgba(255,255,255,0.5)]  rounded-lg p-2 border border-white/90 "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#6D4AEB]  mt-1.5 shrink-0" />
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="flex items-start gap-2.5 bg-[color-mix(in_srgb,var(--indigo)_6%,transparent)]    border border-[color-mix(in_srgb,var(--indigo)_25%,transparent)]  rounded-xl p-3.5 shadow-[0_0_15px_color-mix(in_srgb,var(--indigo)_5%,transparent)] ">
          <AlertTriangle size={18} className="text-[#6D4AEB]  mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#6D4AEB]  uppercase tracking-wide">
              Recommended Autonomous Resolution
            </p>
            <p className="text-sm text-[#1B1D2A]  mt-0.5">{capsule.recommendedAction}</p>
          </div>
        </div>

        {/* One-Click Resolution Presets */}
        {!resolving && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-700  ">
              <span>Fast Dispatch Presets:</span>
              <span className="text-[#6D4AEB] ">1-click draft</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => applyPreset('Approved full credit adjustment + complimentary 1-month service waiver.')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.7)] hover:bg-[color-mix(in_srgb,var(--indigo)_10%,transparent)] border border-white/90 hover:border-[color-mix(in_srgb,var(--indigo)_30%,transparent)] text-slate-700  hover:text-[#6D4AEB]       transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                💳 Credit Adjustment
              </button>
              <button
                onClick={() =>
                  applyPreset('Expedited overnight carrier replacement dispatched via tier-1 priority queue.')
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.7)] hover:bg-[color-mix(in_srgb,var(--indigo)_10%,transparent)] border border-white/90 hover:border-[color-mix(in_srgb,var(--indigo)_30%,transparent)] text-slate-700  hover:text-[#6D4AEB]       transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                📦 Expedite Dispatch
              </button>
              <button
                onClick={() =>
                  applyPreset(
                    'Applied 25% annual retention discount and assigned dedicated enterprise account engineer.'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.7)] hover:bg-[color-mix(in_srgb,var(--indigo)_10%,transparent)] border border-white/90 hover:border-[color-mix(in_srgb,var(--indigo)_30%,transparent)] text-slate-700  hover:text-[#6D4AEB]       transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                🤝 Executive Retention
              </button>
            </div>
          </div>
        )}

        {/* Human Resolution Box */}
        {!resolving ? (
          <button
            onClick={() => setResolving(true)}
            className="w-full py-2.5 rounded-xl bg-[rgba(255,255,255,0.7)] hover:bg-[color-mix(in_srgb,var(--indigo)_10%,transparent)] border border-white/90    transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none text-sm font-semibold text-[#6D4AEB]  flex items-center justify-center gap-2 shadow-sm"
          >
            Resolve this case &amp; Update KB
          </button>
        ) : (
          <div className="space-y-3 bg-[rgba(255,255,255,0.5)]  border border-white/90  rounded-xl p-3.5 animate-fadeIn">
            <label className="text-xs font-medium text-[#1B1D2A]  flex items-center justify-between">
              <span>Resolution Rationale</span>
              <span className="text-[10px] text-[#6D4AEB]  font-mono">Feeds Self-Learning Loop</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Document corrective actions taken. This will automatically draft a permanent Knowledge Base article..."
              className="w-full bg-[rgba(255,255,255,0.7)]  border border-white/90  rounded-xl p-3 text-sm text-[#1B1D2A]  placeholder-[#9599AD]  focus:outline-none focus:border-[#6D4AEB]  resize-none transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setResolving(false)}
                className="px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.7)] hover:bg-white border border-white/90    text-xs text-slate-700   transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => onResolve(capsule.id, note || 'Standard enterprise remediation protocol executed.')}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#6EE7C8] via-[#B69CFF] to-[#FFAFD1] hover:opacity-95 text-[#1B1D2A] transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_15px_color-mix(in_srgb,var(--indigo)_20%,transparent)]"
              >
                <CheckCircle2 size={15} /> Confirm Resolution &amp; Synthesize Article
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Printable Executive Incident Report Modal */}
      {showReportModal && (
        <CapsuleReportModal
          capsule={capsule}
          ltvDisplay={ltvDisplay}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}
