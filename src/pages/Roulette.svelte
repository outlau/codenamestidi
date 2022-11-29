<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { gameElementStore, inputButtonsVisible } from '../store';
  import ButtonGroup from '../components/ButtonGroup.svelte';

  onMount(() => {
    inputButtonsVisible.set(false);
  });


  onDestroy(() => {
    inputButtonsVisible.set(false);
  });
</script>

<div class="progress-container">
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
  <div
    class="progress-bar"
    style="width: 100%; background-color: {color}"
  ></div>
</div>

<ButtonGroup />

<style lang="scss">
  // TODO
  $main-color: #0e3c79;

</style>
