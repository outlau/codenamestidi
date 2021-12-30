<script lang="ts">
  import { TextField } from 'svelte-materialify';
  import { gameElementStore, inputButtonsVisible } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import ProgressBar from '../components/ProgressBar.svelte';
  import ButtonGroup from '../components/ButtonGroup.svelte';

  let value = '';
  let answerError = false;
  let answerMsg = '';
  const correctAnswerMsg = 'Correct!';
  const incorrectAnswerMsg = 'Incorrect!';

  onMount(() => {
    inputButtonsVisible.set(false);
    if ($gameElementStore.currentCount === $gameElementStore.maxCount) {
      inputButtonsVisible.set(true);
      value = $gameElementStore.attributes.answer;
      answerMsg = correctAnswerMsg;
    }
  });

  onDestroy(() => {
    inputButtonsVisible.set(false);
  })

  function input() {
    if (value.toLowerCase().trim() === $gameElementStore.attributes.answer) {
      inputButtonsVisible.set(true);
      answerMsg = correctAnswerMsg;
      return;
    }
    inputButtonsVisible.set(false);
    answerMsg = incorrectAnswerMsg;
  }
</script>

<ProgressBar />
<div class="answer-container">
  <TextField
    bind:value
    disabled="{value === $gameElementStore.attributes.answer &&
      $gameElementStore.currentCount >= $gameElementStore.maxCount}"
    on:input="{input}"
    messages="{answerMsg}"
    outlined
  >
    Input your answer here
  </TextField>
</div>
<ButtonGroup />
