import { writable } from 'svelte/store';
import type { GameElement } from './interfaces/game-element';

export const gameElementStore = writable<GameElement>();

export const inputButtonsVisible = writable(false);
