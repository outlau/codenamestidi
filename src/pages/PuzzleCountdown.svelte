<script lang="ts">
  import { onMount } from 'svelte';
  import { SupabaseObject } from '../db';
  import type { GameElement } from '../interfaces/game-element';
  export let nextGameElement: GameElement;

  let countdownMlt = 0;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let countdownEnds;
  onMount(async () => {
    countdownEnds = new Date(nextGameElement.startTime);
    console.log(countdownEnds);
    setCountdownVariables();
    setInterval(() => {
      setCountdownVariables();
    }, 1000);
  });

  function setCountdownVariables() {
    const diff = Date.parse(countdownEnds) - Date.parse(new Date().toString());
    hours = getHours(diff);
    minutes = getMinutes(diff);
    seconds = getSeconds(diff);
  }

  function getHours(t: any) {
    return Math.floor((t / (1000 * 60 * 60)) % 24);
  }

  function getMinutes(t: any) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  function getSeconds(t: any) {
    return Math.floor((t / 1000) % 60);
  }
</script>

<p>Next event in:</p>
<p class="info-text">{hours}h {minutes}m {seconds}s</p>
<p>
  If you haven't already received your prize for this event, please contact the
  overlord.
</p>
