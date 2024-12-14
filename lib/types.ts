export interface AIAgent {
  id: string;
  name: string;
  trustScore: number;
  status: 'active' | 'inactive';
  consensusRate: number;
  lastUpdate: string;
  type: 'validator' | 'miner';
}

export type StatusType = 'active' | 'training' | 'inactive' | 'error';

export function isValidStatus(status: string): status is StatusType {
  return ['active', 'training', 'inactive', 'error'].includes(status as StatusType);
}