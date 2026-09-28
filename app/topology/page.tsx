'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/context/AppStateContext';
import {
  Network,
  Plus,
  Trash2,
  Activity,
  Zap,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Radio,
  Server,
  X,
  Clock,
  Gauge,
  Layers,
} from 'lucide-react';
import { AgentCorridor } from '@/lib/types';
import { playClickSound } from '@/lib/audio/soundEffects';

const AVAILABLE_AGENTS = [
  'Cognitive Router',
  'Billing Specialist',
  'Technical Specialist',
  'Order Concierge',
  'Account Specialist',
  'Escalation Arbiter',
  'Human Supervisor VIP',
  'Knowledge Base Curator',
];

export default function TopologyMeshPage() {
  const { corridors, addCorridor, deleteCorridor, pushToast } = useAppState();
  const [protocolFilter, setProtocolFilter] = useState<string>('All');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [sourceAgent, setSourceAgent] = useState('Cognitive Router');
  const [targetAgent, setTargetAgent] = useState('Technical Specialist');
  const [protocol, setProtocol] = useState<'HTTP/REST' | 'gRPC' | 'WebSocket' | 'Neural Stream'>('gRPC');
  const [routeTier, setRouteTier] = useState<'Enterprise' | 'Pro' | 'Free' | 'Global'>('Enterprise');
  const [latencyMs, setLatencyMs] = useState(16);
  const [slaTargetMs, setSlaTargetMs] = useState(50);
  const [throughputTokPerSec, setThroughputTokPerSec] = useState(1450);
  const [description, setDescription] = useState('');

  // Sever state
  const [severingId, setSeveringId] = useState<string | null>(null);

  // Filtering
  const filteredCorridors = corridors.filter((c) => {
    if (protocolFilter !== 'All' && c.protocol !== protocolFilter) return false;
    if (tierFilter !== 'All' && c.routeTier !== tierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.sourceAgent.toLowerCase().includes(q) ||
        c.targetAgent.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Metrics
  const total = corridors.length;
  const active = corridors.filter((c) => c.status === 'ACTIVE').length;
  const avgLatency = total > 0 ? Math.round(corridors.reduce((acc, c) => acc + c.latencyMs, 0) / total) : 0;
  const totalThroughput = corridors.reduce((acc, c) => acc + (c.status === 'ACTIVE' ? c.throughputTokPerSec : 0), 0);
  const slaAdherence =
    total > 0 ? Math.round((corridors.filter((c) => c.latencyMs <= c.slaTargetMs).length / total) * 100) : 100;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceAgent === targetAgent) {
      pushToast('Source and Target agents cannot be identical', 'warning');
      return;
    }

    const newCorridor: AgentCorridor = {
      id: `corridor-${Date.now()}`,
      sourceAgent,
      targetAgent,
      protocol,
      routeTier,
      latencyMs: Number(latencyMs),
      slaTargetMs: Number(slaTargetMs),
      status: 'ACTIVE',
      throughputTokPerSec: Number(throughputTokPerSec),
      description:
        description.trim() || `${sourceAgent} to ${targetAgent} optimized ${protocol} corridor`,
      createdAt: new Date().toISOString(),
    };

    addCorridor(newCorridor);
    playClickSound();
    setIsModalOpen(false);
    setDescription('');
  };

  const handleSever = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to sever the active routing corridor [${label}]?`)) return;
    setSeveringId(id);
    playClickSound();
    await deleteCorridor(id);
    setSeveringId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(14,156,116,0.08)]  text-[#0E9C74]  border border-[rgba(14,156,116,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#0E9C74] animate-pulse" />
              Relational Topology Mesh V5.0
            </span>
            <span className="text-xs text-slate-600 ">Multi-Agent Corridors</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#1B1D2A]  flex items-center gap-3">
            <Network className="text-[#6D4AEB]" size={32} />
            Agent Interconnect & Topology Mesh
          </h1>
          <p className="text-sm text-slate-700   mt-1 max-w-2xl">
            Live cognitive routing corridors connecting specialist AI agents, priority tier channels,
            and real-time RPC/Neural stream telemetry with instant link severing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-[#6EE7C8] via-[#B69CFF] to-[#FFAFD1] text-[#1B1D2A] hover:opacity-95 shadow-md shadow-[#6D4AEB]/20 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transform active:scale-95"
          >
            <Plus size={16} />
            Provision Corridor
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2 border-l-4 border-l-[#6D4AEB]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700   uppercase tracking-wider">
              Active Corridors
            </span>
            <div className="w-8 h-8 rounded-lg bg-[rgba(109,74,235,0.08)] flex items-center justify-center text-[#6D4AEB]">
              <Layers size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-[#1B1D2A] ">
              {active}
            </span>
            <span className="text-xs font-medium text-slate-700 ">/ {total} allocated</span>
          </div>
          <p className="text-[11px] text-[#0E9C74] flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E9C74]" /> Zero-partition state
          </p>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-[#0E9C74]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700   uppercase tracking-wider">
              Mean Latency
            </span>
            <div className="w-8 h-8 rounded-lg bg-[rgba(14,156,116,0.08)] flex items-center justify-center text-[#0E9C74]">
              <Clock size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-[#1B1D2A] ">
              {avgLatency}
            </span>
            <span className="text-xs font-medium text-slate-700 ">ms RTT</span>
          </div>
          <p className="text-[11px] text-[#0E9C74] font-medium">
            Target SLA: &lt; 50ms (Optimal)
          </p>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-[#059669]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700   uppercase tracking-wider">
              SLA Adherence
            </span>
            <div className="w-8 h-8 rounded-lg bg-[rgba(5,150,105,0.08)] flex items-center justify-center text-[#059669]">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-[#1B1D2A] ">
              {slaAdherence}%
            </span>
            <span className="text-xs font-medium text-[#0E9C74]">high-fidelity</span>
          </div>
          <p className="text-[11px] text-slate-700  font-medium">
            Strict enterprise contract compliance
          </p>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-[#C97A00]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700   uppercase tracking-wider">
              Throughput
            </span>
            <div className="w-8 h-8 rounded-lg bg-[rgba(201,122,0,0.08)] flex items-center justify-center text-[#C97A00]">
              <Zap size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-[#1B1D2A] ">
              {totalThroughput.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-700 ">tok/s</span>
          </div>
          <p className="text-[11px] text-[#6D4AEB] font-medium">
            Active neural stream load
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-700  uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter size={13} /> Protocol:
          </span>
          {['All', 'gRPC', 'Neural Stream', 'HTTP/REST', 'WebSocket'].map((proto) => (
            <button
              key={proto}
              onClick={() => {
                playClickSound();
                setProtocolFilter(proto);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                protocolFilter === proto
                  ? 'bg-[rgba(109,74,235,0.12)] text-[#6D4AEB] border border-[rgba(109,74,235,0.3)] shadow-sm'
                  : 'bg-[rgba(255,255,255,0.6)]  text-slate-700   hover:text-[#1B1D2A] border border-white/80 '
              }`}
            >
              {proto}
            </button>
          ))}
        </div>

        {/* Tier filter & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  outline-none focus:border-[#6D4AEB]"
          >
            <option value="All">All Tiers</option>
            <option value="Enterprise">Enterprise Tier</option>
            <option value="Pro">Pro Tier</option>
            <option value="Global">Global Tier</option>
          </select>

          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 " size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agent corridors..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  placeholder-[#9599AD] outline-none focus:border-[#6D4AEB]"
            />
          </div>
        </div>
      </div>

      {/* Corridors Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700   flex items-center gap-2">
            <Radio size={15} className="text-[#6D4AEB]" /> Active Corridors Mesh ({filteredCorridors.length})
          </h2>
          <span className="text-xs text-slate-600 ">Click Sever Link to permanently decouple topology path</span>
        </div>

        {filteredCorridors.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <Network className="mx-auto text-slate-600 " size={40} />
            <h3 className="font-display text-base font-bold text-[#1B1D2A] ">
              No matching agent corridors found
            </h3>
            <p className="text-xs text-slate-700   max-w-md mx-auto">
              No corridors match your current filters. Provision a new corridor or reset search filters.
            </p>
            <button
              onClick={() => {
                setProtocolFilter('All');
                setTierFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[rgba(109,74,235,0.1)] text-[#6D4AEB] border border-[rgba(109,74,235,0.25)]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCorridors.map((c) => {
              const latencyPercent = Math.min(Math.round((c.latencyMs / c.slaTargetMs) * 100), 100);
              const isDegraded = c.latencyMs > c.slaTargetMs;

              return (
                <div
                  key={c.id}
                  className="glass-card p-5 space-y-4 hover:shadow-lg transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none group border border-white/90 "
                >
                  {/* Top Bar: Nodes & Protocol */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[rgba(109,74,235,0.08)]  text-[#6D4AEB]  border border-[rgba(109,74,235,0.2)]">
                        {c.sourceAgent}
                      </span>
                      <ArrowRight size={14} className="text-slate-600 " />
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[rgba(14,156,116,0.08)]  text-[#0E9C74]  border border-[rgba(14,156,116,0.2)]">
                        {c.targetAgent}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          c.status === 'ACTIVE'
                            ? 'bg-[rgba(14,156,116,0.08)] text-[#0E9C74] border-[rgba(14,156,116,0.25)]'
                            : 'bg-[rgba(201,122,0,0.08)] text-[#C97A00] border-[rgba(201,122,0,0.25)]'
                        }`}
                      >
                        {c.status}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[rgba(255,255,255,0.8)]  border border-white/90  text-slate-700 ">
                        {c.routeTier}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {c.description && (
                    <p className="text-xs text-slate-700   line-clamp-2">
                      {c.description}
                    </p>
                  )}

                  {/* Protocol & Latency Telemetry */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[rgba(255,255,255,0.5)]  border border-white/90  text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600  block">Protocol</span>
                      <span className="text-xs font-extrabold text-[#1B1D2A] ">
                        {c.protocol}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600  block">RTT Latency</span>
                      <span
                        className={`text-xs font-extrabold ${
                          isDegraded ? 'text-[#E11D48]' : 'text-[#0E9C74]'
                        }`}
                      >
                        {c.latencyMs} ms
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600  block">Throughput</span>
                      <span className="text-xs font-extrabold text-[#6D4AEB] ">
                        {c.throughputTokPerSec} tok/s
                      </span>
                    </div>
                  </div>

                  {/* SLA Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 ">SLA Budget Usage</span>
                      <span className="font-semibold text-[#1B1D2A] ">
                        {c.latencyMs}ms / {c.slaTargetMs}ms ({latencyPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5  overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          latencyPercent > 80
                            ? 'bg-[#E11D48]'
                            : latencyPercent > 50
                            ? 'bg-[#C97A00]'
                            : 'bg-[#0E9C74]'
                        }`}
                        style={{ width: `${latencyPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-2 border-t border-[rgba(109,74,235,0.08)]  flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-600  truncate max-w-[200px]">
                      ID: {c.id}
                    </span>
                    <button
                      onClick={() => handleSever(c.id, `${c.sourceAgent} ➔ ${c.targetAgent}`)}
                      disabled={severingId === c.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-[#E11D48] hover:bg-[rgba(225,29,72,0.08)] border border-[rgba(225,29,72,0.25)] hover:border-[#E11D48] transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                    >
                      <Trash2 size={13} />
                      Sever Link
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Provision Corridor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-lg w-full p-4 sm:p-5 space-y-5 bg-white  border border-[rgba(109,74,235,0.3)] shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-600  hover:text-[#1B1D2A] "
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[rgba(109,74,235,0.1)] flex items-center justify-center text-[#6D4AEB]">
                <Plus size={20} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1B1D2A] ">
                  Provision Agent Routing Corridor
                </h3>
                <p className="text-xs text-slate-700  ">
                  Establish real-time inter-agent communication channel with QoS parameters
                </p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700  uppercase">Source Agent</label>
                  <select
                    value={sourceAgent}
                    onChange={(e) => setSourceAgent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  outline-none focus:border-[#6D4AEB]"
                  >
                    {AVAILABLE_AGENTS.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700  uppercase">Target Agent</label>
                  <select
                    value={targetAgent}
                    onChange={(e) => setTargetAgent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  outline-none focus:border-[#6D4AEB]"
                  >
                    {AVAILABLE_AGENTS.filter((a) => a !== sourceAgent).map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700  uppercase">Channel Protocol</label>
                  <select
                    value={protocol}
                    onChange={(e: any) => setProtocol(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  outline-none focus:border-[#6D4AEB]"
                  >
                    <option value="gRPC">gRPC (Low Latency Binary)</option>
                    <option value="Neural Stream">Neural Stream (WebSocket)</option>
                    <option value="HTTP/REST">HTTP/REST (Standard JSON)</option>
                    <option value="WebSocket">WebSocket (Full Duplex)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700  uppercase">Routing Tier</label>
                  <select
                    value={routeTier}
                    onChange={(e: any) => setRouteTier(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  outline-none focus:border-[#6D4AEB]"
                  >
                    <option value="Enterprise">Enterprise Priority</option>
                    <option value="Pro">Pro Business</option>
                    <option value="Global">Global Public</option>
                    <option value="Free">Free Sandbox</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 ">RTT Latency (ms)</label>
                  <input
                    type="number"
                    value={latencyMs}
                    onChange={(e) => setLatencyMs(Number(e.target.value))}
                    min={1}
                    max={500}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  outline-none focus:border-[#6D4AEB]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 ">SLA Target (ms)</label>
                  <input
                    type="number"
                    value={slaTargetMs}
                    onChange={(e) => setSlaTargetMs(Number(e.target.value))}
                    min={5}
                    max={1000}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  outline-none focus:border-[#6D4AEB]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 ">Throughput (tok/s)</label>
                  <input
                    type="number"
                    value={throughputTokPerSec}
                    onChange={(e) => setThroughputTokPerSec(Number(e.target.value))}
                    min={100}
                    max={20000}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  outline-none focus:border-[#6D4AEB]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700  uppercase">Corridor Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Dedicated high-urgency fallback pipeline for Stripe billing queries"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[rgba(255,255,255,0.8)]  border border-white/90  text-[#1B1D2A]  placeholder-[#9599AD] outline-none focus:border-[#6D4AEB]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[rgba(255,255,255,0.7)]  text-slate-700  hover:text-[#1B1D2A] border border-white/90 "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#6EE7C8] via-[#B69CFF] to-[#FFAFD1] text-[#1B1D2A] hover:opacity-95 shadow-md shadow-[#6D4AEB]/20 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                >
                  Deploy Corridor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
