export interface AIAgent {
  id: string;
  name: string;
  trustScore: number;
  status: 'active' | 'inactive';
  consensusRate: number;
  lastUpdate: string;
  type: 'validator' | 'miner';
}