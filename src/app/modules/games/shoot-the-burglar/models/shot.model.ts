export interface Shot {
  id: string;
  userFireId: string;
  target: any;
  targetIndex: number;
  timestamp: number;
  shotTime: number;
  relativeX: number; // use window.outerWidth * relativeX to find the real X
  relativeY: number;
}
