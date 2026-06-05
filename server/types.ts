export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
export type ChurnRisk = 'Low' | 'Medium' | 'High';
export type Channel = 'Email' | 'SMS' | 'WhatsApp' | 'Omnichannel';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: LoyaltyTier;
  churnRisk: ChurnRisk;
  lastPurchaseDaysAgo: number;
  purchaseCount: number;
  totalSpend: number;
  preferredChannel: Channel;
  predictedNextCategory: string;
  joinedDate: string;
}

export interface AgentStep {
  id: string;
  name: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed';
  timestamp: string;
  output: string;
}

export interface AgentPlan {
  id: string;
  campaignGoal: string;
  status: 'Idle' | 'Analyzing' | 'Writing' | 'Optimizing' | 'Ready';
  steps: AgentStep[];
  generatedTemplate: string;
  channelSelectionRationale: string;
  discountRationale: string;
  targetCount: number;
}

export interface Campaign {
  id: string;
  goal: string;
  status: 'Planning' | 'Active' | 'Completed';
  targetSegment: string;
  channel: Channel;
  discountPercentage: number;
  pointsMultiplier: number;
  createdDate: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  revenueGenerated: number;
  agentPlan?: AgentPlan;
}

export interface LoyaltyRule {
  id: string;
  name: string;
  trigger: string;
  pointsGiven: number;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'CampaignSent' | 'CampaignOpen' | 'CampaignClick' | 'Purchase' | 'PointsEarned' | 'TierUpgrade' | 'RewardRedemption';
  customerName: string;
  description: string;
  metricChange?: string;
}
