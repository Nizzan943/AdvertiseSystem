export const baseServerUrl = 'http://localhost:8082';

export interface TimeRange {
  days: string[];
  startHour: string;
  endHour: string;
}

export interface Commercial {
  id: string;
  title: string;
  image: string;
  duration: number;
  timeRange: TimeRange;
}

export interface Client {
  name: string;
  id: string;
  commercials: Commercial[];
  isActive: boolean;
}
