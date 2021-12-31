<script lang="ts">
  import { onMount } from 'svelte';
  import { gameElementStore } from '../store';
  import { SupabaseObject } from '../db';

  let countdownMlt = 0;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let countdownEnds;
  onMount(async () => {
    const intervalTime = await SupabaseObject.getIntervalTime();
    const [duration, unit] = intervalTime.trim().split(' ');
    switch (unit.toLowerCase()) {
      case 'mins':
        countdownMlt = 60000;
        break;
      case 'hours':
        countdownMlt = 60000 * 60;
        break;
      case 'second':
        countdownMlt = 60000 / 60;
        break;
      default:
        throw Error('Invalid unit ' + unit);
    }
    countdownEnds = new Date(
      $gameElementStore.timeCompleted.getTime() +
        Number(duration) * countdownMlt
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

<p>Next event in:</p>
<p class="info-text">{hours}h {minutes}m {seconds}s</p>
<p>
  If you haven't already received your prize for this event, please contact the
  overlord.
</p>
