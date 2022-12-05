<script lang="ts">
  import ProgressBar from '../components/ProgressBar.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { gameElementStore, inputButtonsVisible } from '../store';
  import { SupabaseObject } from '../db';
  import { Button } from 'svelte-materialify';

  onMount(() => {
    // inputButtonsVisible.set(setInputButtonsVisible);
  });

  onDestroy(() => {
    inputButtonsVisible.set(false);
  });

  function increment() {
    if ($gameElementStore.currentCount < $gameElementStore.maxCount) {
      $gameElementStore.currentCount++;
      SupabaseObject.setGameElementCount($gameElementStore);
    }
  }

  function decrement() {
    if ($gameElementStore.currentCount > 0) {
      $gameElementStore.currentCount--;
      SupabaseObject.setGameElementCount($gameElementStore);
    }
  }

  async function confirm() {
    await SupabaseObject.confirmGameElementFinished($gameElementStore);
    gameElementStore.update((state) => {
      state.completed = true;
      return state;
    });
    window.location.href = '/';
  }
</script>

<ProgressBar />

<div class="button-group-container">
  <div class="button-container">
    <button
      class="change-button"
      disabled="{$gameElementStore.currentCount <= 0}"
      on:click="{decrement}"
    >
      -
    </button>
    <p class="button-explain-text">Revert</p>
  </div>
  <div class="button-container">
    <button
      class="change-button"
      disabled="{$gameElementStore.currentCount >= $gameElementStore.maxCount}"
      on:click="{increment}">+</button
    >
    <p class="button-explain-text">Finish task</p>
  </div>
</div>

{#if $gameElementStore.currentCount <= 0}
  <div class="approve-request-container">
    <div class="approve-request-text">
      Do you wish to withdraw your request for refusal?
    </div>
    <Button on:click="{confirm}">deny</Button>
  </div>
{/if}

<style lang="scss">
  // TODO
  $main-color: #0e3c79;
  .button-group-container {
    margin-top: 15px;

    display: flex;
    justify-content: space-between;

    .button-container {
      .button-explain-text {
        margin-top: 10px;
        font-size: 12px;
        font-style: italic;
        user-select: none;
      }
      .explain-dialog {
        padding: 16px;
      }
      .change-button {
        display: flex;
        justify-content: center;
        box-shadow: 0.5px 1px 4px 1px transparentize($main-color, 0.8);
        border: 0;
        background: unset;
        border-radius: 50%;
        color: $main-color;
        width: 50px;
        height: 50px;
        font-size: 30px;
        margin: 0 10px;
        transition: 0.3s all;

        &:disabled {
          background: #ccc;
          color: transparentize($main-color, 0.8);
          cursor: not-allowed !important;
        }

        &:hover {
          background: #f3f3f3;
          cursor: pointer;
        }
      }
    }
  }
</style>
