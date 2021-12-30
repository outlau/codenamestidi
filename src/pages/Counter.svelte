<script lang="ts">
  import ButtonGroup from '../components/ButtonGroup.svelte';
  import ProgressBar from '../components/ProgressBar.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { inputButtonsVisible } from '../store';

  export let setInputButtonsVisible;
  onMount(() => {
    inputButtonsVisible.set(setInputButtonsVisible);
  });


  onDestroy(() => {
    inputButtonsVisible.set(false);
  })

</script>

<ProgressBar />
<ButtonGroup />
