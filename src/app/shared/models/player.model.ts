import { Step } from '../steps/step';

export interface Player {
  id: string;
  name: string;
  fireId: string;
  points: number;
  step: Step;
  avatar?: string;
  avatarUrl?: string; // full path for faster loading
}
