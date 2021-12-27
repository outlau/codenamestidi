export interface GameElement {
  id: number;
  createdAt: Date;
  textOfDay: string;
  completed: boolean;
  approved: boolean;
  timeApproved?: Date;
  hint?: string;
  answer?: string;
  currentCount?: number;
  maxCount?: number;
  timeDependentTime?: string;
  gyro?: boolean;
}
