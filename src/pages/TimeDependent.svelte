<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { gameElementStore, inputButtonsVisible } from '../store';
  import ProgressBar from '../components/ProgressBar.svelte';
  import ButtonGroup from '../components/ButtonGroup.svelte';

  let interval;
  onMount(() => {
    inputButtonsVisible.set(false);
    interval = setInterval(() => {
      const curMinutes = new Date().getMinutes();
      // @ts-ignore
      const timeDependentMinutes = Number($gameElementStore.attributes.time);
      if (curMinutes === timeDependentMinutes) {
        inputButtonsVisible.set(true);
        return;
      }
      inputButtonsVisible.set(false);
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
    inputButtonsVisible.set(false);
  });
</script>

<ProgressBar />
<ButtonGroup />
