import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { GameElement } from './interfaces/game-element';

const supabaseUrl = 'https://aterkwnsxqhjpefecakz.supabase.co';
// const supabaseKey = process.env.SUPABASE_KEY
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDUzNzc4NSwiZXhwIjoxOTU2MTEzNzg1fQ.Lo27ObpnErXjkgkGQPnME4cIVM7vD2C5rxB05vY73k4';

const tableName = 'GameElements';

export class SupabaseObject {
  static user;
  static supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

  constructor() {}

  static async signUp(email, password) {
    return await SupabaseObject.supabase.auth.signUp({
      email,
      password,
    });
  }

  static async signIn(email, password) {
    return await SupabaseObject.supabase.auth.signIn({
      email,
      password,
    });
  }

  static async getGameElement(): Promise<GameElement> {
    const { data, error } = await SupabaseObject.supabase
      .from(tableName)
      .select()
      .is('timeCompleted', null)
      .lte('startTime', 'NOW()')
      .order('startTime', { ascending: true })
      .limit(1);
    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      return null;
    }
    return {
      ...data[0],
      timeCompleted: new Date(data[0].timeCompleted + 'Z'),
      createdAt: new Date(data[0].createdAt + 'Z'),
      startTime: new Date(data[0].startTime + 'Z'),
    } as GameElement;
  }

  static async getNextGameElement(): Promise<GameElement> {
    const { data, error } = await SupabaseObject.supabase
      .from(tableName)
      .select()
      .is('timeCompleted', null)
      .order('startTime', { ascending: true })
      .limit(1);
    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      return null;
    }
    return {
      ...data[0],
      timeCompleted: new Date(data[0].timeCompleted + 'Z'),
      createdAt: new Date(data[0].createdAt + 'Z'),
      startTime: new Date(data[0].startTime + 'Z'),
    } as GameElement;
  }

  static async getGameElementById(id: number): Promise<GameElement> {
    const { data, error } = await SupabaseObject.supabase
      .from(tableName)
      .select()
      .match({ id });
    if (error) {
      throw error;
    }
    return {
      ...data[0],
      timeCompleted: new Date(data[0].timeCompleted + 'Z'),
      createdAt: new Date(data[0].createdAt + 'Z'),
    } as GameElement;
  }

  static async setGameElementCount(gameElement: GameElement): Promise<void> {
    await SupabaseObject.supabase
      .from(tableName)
      .update({ currentCount: gameElement.currentCount })
      .match({ id: gameElement.id });
  }

  static async confirmGameElementFinished(
    gameElement: GameElement
  ): Promise<any> {
    if (gameElement.needsApproval) {
      return SupabaseObject.supabase
        .from(tableName)
        .update({ completed: true })
        .match({ id: gameElement.id });
    }
    return SupabaseObject.supabase
      .from(tableName)
      .update({
        completed: true,
        approved: true,
        timeCompleted: new Date(),
      })
      .match({ id: gameElement.id });
  }

  static async approveGameElement(gameElement: GameElement): Promise<any> {
    return SupabaseObject.supabase
      .from(tableName)
      .update({
        approved: true,
        timeCompleted: new Date(),
      })
      .match({ id: gameElement.id });
  }

  static async getCompletedAndApprovedGameElements(): Promise<GameElement[]> {
    const { data, error } = await SupabaseObject.supabase
      .from(tableName)
      .select()
      .match({ completed: true, approved: true })
      .order('timeCompleted', { ascending: false });
    if (error) {
      throw error;
    }
    return data.map((e) => ({
      ...e,
      timeCompleted: new Date(e.timeCompleted + 'Z'),
    })) as Array<GameElement>;
  }

  static async getGameElementsWaitingForApproval(): Promise<GameElement[]> {
    const { data, error } = await SupabaseObject.supabase
      .from(tableName)
      .select()
      .match({ completed: true, approved: false, needsApproval: true })
      .order('id', { ascending: false });
    if (error) {
      throw error;
    }
    return data.map((e) => ({
      ...e,
      timeCompleted: new Date(e.timeCompleted + 'Z'),
    })) as Array<GameElement>;
  }

  static async getIntervalTime(): Promise<string> {
    const { data, error } = await SupabaseObject.supabase.rpc(
      'get_interval_time'
    );
    if (error) {
      throw error;
    }
    return data as unknown as string;
  }
  static async resetGame() {
    await SupabaseObject.supabase
      .from(tableName)
      .update({
        completed: false,
        approved: false,
        timeCompleted: null,
        currentCount: 0,
      })
      .gte('id', 0);
    await SupabaseObject.supabase
      .from(tableName)
      .update({
        completed: false,
        approved: false,
        timeCompleted: null,
        currentCount: 1,
      })
      .match({ textOfDay: 'Not opposite day' });
  }
}
