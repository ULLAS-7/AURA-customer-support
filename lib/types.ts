export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  joinDate: string;
}

export interface Order {
  id: string;
  customerId: string;
  product: string;
  amount: number;
  status: string;
  date: string;
  notes?: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  category: 'Billing' | 'Technical' | 'Order' | 'Account';
  subject: string;
  status: 'Resolved' | 'Escalated' | 'Open';
  date: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  resolutionSummary?: string;
}

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

export interface ReasoningStep {
  agent: string;
  text: string;
}

export type Decision = 'auto-resolve' | 'escalate';

export interface ContextCapsule {
  id: string;
  customerName: string;
  customerTier: string;
  category: string;
  urgency: 'Low' | 'Medium' | 'High';
  sentimentTrend: number[];
  rootCause: string;
  confidence: number;
  attemptedActions: string[];
  recommendedAction: string;
  originalMessage: string;
  createdAt: string;
}

export interface InvestigationResult {
  category: string;
  urgency: 'Low' | 'Medium' | 'High';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  steps: ReasoningStep[];
  rootCause: string;
  confidence: number;
  decision: Decision;
  resolutionMessage: string;
  contextCapsule?: ContextCapsule;
}
