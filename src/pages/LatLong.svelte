<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { inputButtonsVisible } from '../store';
  import ProgressBar from '../components/ProgressBar.svelte';
  import ButtonGroup from '../components/ButtonGroup.svelte';
  import { between } from '../lib/helpers';

  let lat = 0;
  let long = 0;
  let message = '';

  // 55.711205, 12.496190

  let geo;

  onMount(() => {
    inputButtonsVisible.set(false);
    geo = navigator.geolocation.watchPosition(
      (success) => {
        lat = success.coords.latitude;
        long = success.coords.longitude;
        const latBetween = between(lat, 55.71102, 55.711386);
        const longBetween = between(long, 12.495874, 12.496526);
        console.log(success);
        if (latBetween && longBetween) {
          inputButtonsVisible.set(true);
          return;
        }
        inputButtonsVisible.set(false);
      },
      (error) => {
        message = error.message;
      }
    );
  });

  onDestroy(() => {
    navigator.geolocation.clearWatch(geo);
    inputButtonsVisible.set(false);
  });

  // 55.711205, 12.496190

  // Y          X
  // UP
  // 55.711386, 12.496186

  // DOWN
  // 55.711020, 12.496205

  // RIGHT
  // 55.711201, 12.496526

  // LEFT
  // 55.711218, 12.495874
</script>

{lat}
<br />
{long}
<br />

<ProgressBar />

<ButtonGroup />

<style lang="scss">
</style>
