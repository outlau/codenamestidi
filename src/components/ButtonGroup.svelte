<script lang="ts">
  import { SupabaseObject } from "../db";
  import { gameElementStore, inputButtonsVisible } from "../store";
  import { Dialog } from "svelte-materialify";

  // Dialog bool
  let active = false;

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
</script>

<div class="button-group-container">
  {#if $inputButtonsVisible}
    <div class="button-container">
      <button
        class="change-button"
        disabled={$gameElementStore.currentCount <= 0}
        on:click={decrement}
      >
        -
      </button>
      <p class="button-explain-text">Revert</p>
    </div>
    <div class="button-container">
      <button
        class="change-button"
        disabled={$gameElementStore.currentCount >= $gameElementStore.maxCount}
        on:click={increment}>+</button
      >
      <p class="button-explain-text">Finish task</p>
    </div>
  {/if}
  <!--{:else if gameElement.answer}-->
  <!--  <div class="button-container" style="position:relative">-->
  <!--    <div class="checkbox-container">-->
  <!--      <svg-->
  <!--        xmlns="http://www.w3.org/2000/svg"-->
  <!--        version="1.1"-->
  <!--        width="20"-->
  <!--        height="20"-->
  <!--        viewBox="0 0 270 270"-->
  <!--      >-->
  <!--        <path-->
  <!--          d="M 30,180 90,240 240,30"-->
  <!--          style="stroke:#000; stroke-width:30; fill:none"-->
  <!--        >-->
  <!--        </path>-->
  <!--      </svg>-->
  <!--    </div>-->
  <!--    <button-->
  <!--      class="change-button"-->
  <!--      on:click="{submitAnswer}"-->
  <!--      disabled="{counter >= maxCount}"-->
  <!--    >-->
  <!--    </button>-->
  <!--    <p class="button-explain-text">Submit answer</p>-->
  <!--  </div>-->
  <!--{/if}-->

  {#if $gameElementStore.hint}
    <div class="button-container">
      <button
        style="align-items: center"
        class="change-button"
        on:click={() => {
          active = true;
        }}>?</button
      >
      <p class="button-explain-text">Get a hint</p>

      <Dialog class="pa-4" bind:active>
        {$gameElementStore.hint}
      </Dialog>
    </div>
  {/if}
</div>

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
        align-items: center;
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
