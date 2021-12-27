import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { GameElement } from './game-element';

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
    await SupabaseObject.supabase.auth.signUp({
      email,
      password,
    });
  }

  static async signIn(email, password) {
    await SupabaseObject.supabase.auth.signIn({
      email,
      password,
    });
  }

  static async getGameElement(): Promise<GameElement> {
    const { data, error } = await SupabaseObject.supabase.rpc(
      'select_current_game_element'
    );
    if (error) {
      throw error;
    }
    return {
      ...data[0],
      timeApproved: new Date(data[0].timeApproved + 'Z'),
      createdAt: new Date(data[0].createdAt + 'Z'),
    } as GameElement;
  }

  static async setGameElementCount(
    gameElementId: number,
    gameElementCount: number
  ) {
    await SupabaseObject.supabase
      .from(tableName)
      .update({ currentCount: gameElementCount })
      .match({ id: gameElementId });
  }

  static async confirmGameElementFinished(gameElementId: number) {
    await SupabaseObject.supabase
      .from(tableName)
      .update({ completed: true })
      .match({ id: gameElementId });
  }

  static async getCompletedAndApprovedGameElements(): Promise<GameElement[]> {
    const { data, error } = await SupabaseObject.supabase
      .from(tableName)
      .select()
      .match({ completed: true, approved: true })
      .order('id', { ascending: false });
    if (error) {
      throw error;
    }
    return data.map((e) => ({
      ...e,
      timeApproved: new Date(e.timeApproved).toLocaleString(),
    })) as Array<GameElement>;
  }
}
