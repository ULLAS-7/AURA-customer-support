import { FileText, Printer, X } from 'lucide-react';
import { ContextCapsule } from '@/lib/types';

interface CapsuleReportModalProps {
  capsule: ContextCapsule;
  ltvDisplay: string;
  onClose: () => void;
}

export default function CapsuleReportModal({ capsule, ltvDisplay, onClose }: CapsuleReportModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card p-4 sm:p-5 max-w-2xl w-full bg-white  border-[color-mix(in_srgb,var(--indigo)_30%,transparent)] space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--indigo)_10%,transparent)]  pb-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#6D4AEB] " />
            <div>
              <h3 className="font-bold text-[#1B1D2A]  text-base">Executive Incident Brief</h3>
              <p className="text-xs text-slate-600   font-mono">INC-{capsule.id.slice(0, 10).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[color-mix(in_srgb,var(--indigo)_10%,transparent)] text-[#6D4AEB] border border-[color-mix(in_srgb,var(--indigo)_30%,transparent)]    text-xs font-semibold flex items-center gap-1.5 hover:bg-[color-mix(in_srgb,var(--indigo)_20%,transparent)]  transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <Printer size={13} /> Print Brief
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.5)] hover:bg-white   text-slate-700  hover:text-[#1B1D2A]  "
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[rgba(255,255,255,0.5)]  p-3 rounded-xl border border-white/90 ">
            <div>
              <span className="text-slate-700   block">Customer</span>
              <strong className="text-[#1B1D2A] ">{capsule.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-700   block">Tier / Value</span>
              <strong className="text-[#6D4AEB] ">{capsule.customerTier} ({ltvDisplay})</strong>
            </div>
            <div>
              <span className="text-slate-700   block">SLA Priority</span>
              <strong className="text-[#E11D48] ">{capsule.urgency} Urgency</strong>
            </div>
            <div>
              <span className="text-slate-700   block">Root-Cause Confidence</span>
              <strong className="text-[#0E9C74] ">{Math.round(capsule.confidence * 100)}%</strong>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-700   uppercase tracking-wider text-[11px] mb-1">
              Customer Incident Message
            </h4>
            <p className="text-[#1B1D2A]  bg-[rgba(255,255,255,0.5)]  p-2.5 rounded-lg border border-white/90  italic">
              &ldquo;{capsule.originalMessage}&rdquo;
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-700   uppercase tracking-wider text-[11px] mb-1">
              Corroborated Systemic Root Cause
            </h4>
            <p className="text-[#1B1D2A]  bg-[rgba(255,255,255,0.5)]  p-2.5 rounded-lg border border-white/90 ">
              {capsule.rootCause}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-700   uppercase tracking-wider text-[11px] mb-1">
              Pre-Escalation Automated Checks
            </h4>
            <ul className="space-y-1 list-disc list-inside text-[#1B1D2A]  bg-[rgba(255,255,255,0.5)]  p-2.5 rounded-lg border border-white/90 ">
              {capsule.attemptedActions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[color-mix(in_srgb,var(--indigo)_6%,transparent)]  border border-[color-mix(in_srgb,var(--indigo)_25%,transparent)]  rounded-xl p-3">
            <h4 className="font-bold text-[#6D4AEB]  uppercase tracking-wider text-[11px] mb-0.5">
              Remediation Protocol
            </h4>
            <p className="text-[#1B1D2A] ">{capsule.recommendedAction}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-[color-mix(in_srgb,var(--indigo)_10%,transparent)]  flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.7)]  hover:bg-white  border border-white/90  text-[#1B1D2A]  text-xs font-semibold"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
