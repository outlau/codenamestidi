<script lang="ts">
  import type { GameElement } from '../game-element';
  import { onMount } from 'svelte';

  export let gameElement: GameElement;
  // Hours
  let countdownDuration = 10;

  let hours;
  let minutes;
  let seconds;
  let countdownEnds;
  onMount(() => {
    console.log(gameElement.timeApproved);
    countdownEnds = new Date(
      gameElement.timeApproved.getTime() + countdownDuration * 60000
    );
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

<p> Next puzzle in:</p>
<p class="info-text">{hours}h {minutes}m {seconds}s</p>
