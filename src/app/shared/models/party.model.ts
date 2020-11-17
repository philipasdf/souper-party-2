import { Step } from '../steps/step';

export interface Party {
  name: string;
  host: string;
  hostFireId?: string;
  step?: Step;
  currGameIndex?: number;
}
