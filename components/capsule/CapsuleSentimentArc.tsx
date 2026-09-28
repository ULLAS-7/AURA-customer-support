import { ArrowRight } from 'lucide-react';

export function sentimentEmoji(v: number) {
  if (v <= -0.4) return { emoji: '😠', label: 'Frustrated', color: 'text-[#E11D48] ' };
  if (v <= 0) return { emoji: '😐', label: 'Neutral', color: 'text-[#C97A00] ' };
  return { emoji: '🙂', label: 'Satisfied', color: 'text-[#0E9C74] ' };
}

interface CapsuleSentimentArcProps {
  sentimentTrend: number[];
}

export default function CapsuleSentimentArc({ sentimentTrend }: CapsuleSentimentArcProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.5)]  rounded-xl p-3 border border-white/90 ">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-wider text-slate-700   font-medium">Sentiment Progression Arc</p>
        <span className="text-[10px] font-mono text-slate-600  ">Turn-by-turn trajectory</span>
      </div>
      <div className="flex items-center gap-2">
        {sentimentTrend.map((v, i) => {
          const info = sentimentEmoji(v);
          const isLast = i === sentimentTrend.length - 1;
          return (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                  isLast
                    ? 'bg-[color-mix(in_srgb,var(--rose)_8%,transparent)]  border-[color-mix(in_srgb,var(--rose)_20%,transparent)]  text-[#E11D48]  shadow-[0_0_10px_color-mix(in_srgb,var(--rose)_15%,transparent)] '
                    : 'bg-[rgba(255,255,255,0.7)]  border-white/90  text-slate-700  '
                }`}
              >
                <span className="text-base">{info.emoji}</span>
                <span className="font-mono text-[11px]">{v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}</span>
              </div>
              {i < sentimentTrend.length - 1 && (
                <ArrowRight size={12} className="text-slate-600   shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
