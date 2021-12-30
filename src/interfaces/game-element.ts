import type { GameType } from './game-type';

export interface GameElement {
  id: number;
  createdAt: Date;
  textOfDay: string;
  completed: boolean;
  approved: boolean;
  timeApproved?: Date;
  hint?: string;
  currentCount?: number;
  maxCount?: number;
  attributes?: AnswerAttribute | TimeDependentAttribute;
  needsApproval: boolean;
  timeCompleted?: Date;
}
interface GenericAttributes {
  type: GameType;
}

interface AnswerAttribute extends GenericAttributes {
  answer: string;
}

interface TimeDependentAttribute extends GenericAttributes {
  time: string;
}
