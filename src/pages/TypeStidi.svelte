<script lang="ts">
  import ButtonGroup from '../components/ButtonGroup.svelte';
  import ProgressBar from '../components/ProgressBar.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { inputButtonsVisible } from '../store';

  const finalText = 'stidi';
  let text = '';
  let success = false;

  function logKey(e) {
    if (success) {
      return;
    }

    if (e.key === finalText[text.length]) {
      text += e.key;
    } else {
      text = '';
    }
    if (text.length === finalText.length) {
      success = true;
      inputButtonsVisible.set(true);
    }
  }
  onMount(() => {
    document.addEventListener('keydown', logKey);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', logKey);
    inputButtonsVisible.set(false);
  });
</script>

<ProgressBar />
<ButtonGroup />
