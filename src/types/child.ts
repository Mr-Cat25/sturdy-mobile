// src/types/child.ts
export type Neurotype =
  | 'ADHD'
  | 'Autistic'
  | 'Highly sensitive'
  | 'Not sure yet'
  | 'None';

export interface ChildProfile {
  id: string;
  name: string;
  nickname?: string;
  age: number | null;
  neurotype: Neurotype | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
