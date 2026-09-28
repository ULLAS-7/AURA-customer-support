'use client';

import { useState } from 'react';
import { ReasoningStep } from '@/lib/types';
import { User, Package, History, BookOpen, CheckCircle2, Loader2, ChevronDown, ChevronUp, Database } from 'lucide-react';

interface SourceDef {
  key: string;
  label: string;
  icon: any;
  match: (text: string) => boolean;
  extractSnippet: (text: string) => string;
}

const SOURCES: SourceDef[] = [
  {
    key: 'customer',
    label: 'Customer Profile',
    icon: User,
    match: (t) => t.includes('matched customer profile'),
    extractSnippet: (t) => {
      const match = t.match(/matched customer profile:\s*([^.]+)/i);
      return match ? match[1].trim() : 'Customer metadata verified';
    },
  },
  {
    key: 'order',
    label: 'Order Records',
    icon: Package,
    match: (t) => t.includes('order records') || t.includes('billing ledger') || t.includes('ord-'),
    extractSnippet: (t) => {
      const match = t.match(/(ord-\d+[^.]+)/i);
      return match ? match[1].trim() : 'Order ledger ledger confirmed';
    },
  },
  {
    key: 'ticket',
    label: 'Ticket History',
    icon: History,
    match: (t) => t.includes('ticket history') || t.includes('prior related ticket') || t.includes('open ticket'),
    extractSnippet: (t) => {
      const match = t.match(/(\d+\s*prior[^.]+|\d+\s*open ticket[^.]+)/i);
      return match ? match[1].trim() : 'Historical precedents referenced';
    },
  },
  {
    key: 'kb',
    label: 'Knowledge Base',
    icon: BookOpen,
    match: (t) => t.includes('knowledge base') || t.includes('retrieved relevant'),
    extractSnippet: (t) => {
      const match = t.match(/article:\s*([^.]+)/i);
      return match ? match[1].replace(/["']/g, '').trim() : 'Enterprise SOP & policy matched';
    },
  },
];

export default function EvidencePanel({ revealedSteps }: { revealedSteps: ReasoningStep[] }) {
  const [expanded, setExpanded] = useState(false);
  const combinedText = revealedSteps.map((s) => s.text).join(' | ');

  const activeMatches = SOURCES.filter(s => s.match(combinedText.toLowerCase()));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-700   px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Database size={13} className="text-[#6D4AEB] " />
          Cross-Source Evidence Corroboration ({activeMatches.length}/{SOURCES.length} sources confirmed)
        </span>
        {activeMatches.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] text-[#6D4AEB]  hover:text-[#5B21B6] flex items-center gap-1 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? 'Collapse Dossier' : 'Inspect Evidence'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {SOURCES.map((source) => {
          const isFound = source.match(combinedText.toLowerCase());
          const snippet = isFound ? source.extractSnippet(combinedText) : null;
          const Icon = source.icon;

          return (
            <div
              key={source.key}
              className={`flex flex-col p-3 rounded-xl border transition-all duration-300 ${
                isFound
                  ? 'border-[rgba(14,156,116,0.3)]  bg-[rgba(14,156,116,0.04)]    text-[#0E9C74] '
                  : 'border-white/90  bg-[rgba(255,255,255,0.5)]  text-slate-600  '
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 font-medium text-xs">
                  <Icon size={14} className={isFound ? 'text-[#0E9C74] ' : 'text-slate-600  '} />
                  <span className={isFound ? 'text-[#1B1D2A] ' : 'text-slate-700  '}>{source.label}</span>
                </div>
                {isFound ? (
                  <CheckCircle2 size={14} className="text-[#0E9C74]  shrink-0" />
                ) : (
                  <Loader2 size={13} className="text-slate-600   animate-spin shrink-0" />
                )}
              </div>

              <div className="text-[11px] leading-tight text-slate-700   mt-0.5">
                {isFound ? (
                  <span className="text-[#0E9C74]  font-mono font-medium truncate block" title={snippet || ''}>
                    {snippet}
                  </span>
                ) : (
                  <span className="text-slate-600  ">Pending query...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Dossier Drawer */}
      {expanded && activeMatches.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[rgba(255,255,255,0.5)]  border border-[rgba(14,156,116,0.15)]  text-xs font-mono text-[#1B1D2A]  space-y-2 animate-fadeIn">
          <div className="text-slate-700   uppercase tracking-wider text-[10px] font-bold border-b border-[rgba(109,74,235,0.08)]  pb-1">
            Corroborated Telemetry Proofs
          </div>
          {revealedSteps
            .filter(s => s.agent === 'Billing' || s.agent === 'Order' || s.agent === 'Technical' || s.agent === 'Account')
            .map((s, idx) => (
              <div key={idx} className="flex gap-2 items-start text-[11px]">
                <span className="text-[#6D4AEB]  shrink-0">[{s.agent}]</span>
                <span className="text-[#1B1D2A] ">{s.text}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
