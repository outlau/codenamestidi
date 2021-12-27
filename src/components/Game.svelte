<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, Dialog, MaterialApp, TextField } from 'svelte-materialify';

  import { SupabaseObject } from '../db';
  import type { GameElement } from '../game-element';
  import { completed, gyroCompleted } from '../store';
  import Gyro from './Gyro.svelte';
  import LatLong from './LatLong.svelte';
  import PaintSpinner from './PaintSpinner.svelte';

  export let gameElement: GameElement;

  let active = false;
  let maxCount = 1;
  let counter = 0;

  let value = '';
  let answerError = false;
  let answerMsg = '';
  const correctAnswerMsg = 'Correct!';

  let atCorrectRange = false;

  onMount(() => {
    maxCount = gameElement.maxCount;
    counter = gameElement.currentCount;
    if (counter === maxCount) {
      value = gameElement.answer;
      answerMsg = correctAnswerMsg;
    }
    console.log(gameElement);
    if (gameElement.timeDependentTime) {
      setInterval(() => {
        const curMinutes = new Date().getMinutes();
        const timeDependentMinutes = Number(
          gameElement.timeDependentTime.split(':')[1]
        );
        atCorrectRange = curMinutes === timeDependentMinutes;
        console.log(curMinutes);
        console.log(timeDependentMinutes);
        console.log(typeof curMinutes);
        console.log(typeof timeDependentMinutes);
      }, 1000);
    }
  });

  function increment() {
    if (counter < maxCount) {
      counter++;
      SupabaseObject.setGameElementCount(gameElement.id, counter);
    }
  }

  function decrement() {
    if (counter > 0) {
      counter--;
      SupabaseObject.setGameElementCount(gameElement.id, counter);
    }
  }

  function confirm() {
    SupabaseObject.confirmGameElementFinished(gameElement.id);
    completed.set(true);
  }

  function submitAnswer() {
    if (value !== gameElement.answer) {
      answerError = true;
      answerMsg = 'Incorrect answer';
      return;
    }
    increment();
    answerMsg = correctAnswerMsg;
  }
</script>

{#if gameElement.gyro}
  <!--  <Gyro gameElement="{gameElement}" counter="{counter}" maxCount="{maxCount}" />-->
  <!--  <LatLong-->
  <!--    gameElement="{gameElement}"-->
  <!--    counter="{counter}"-->
  <!--    maxCount="{maxCount}"-->
  <!--  />-->
  <PaintSpinner
    gameElement="{gameElement}"
    counter="{counter}"
    maxCount="{maxCount}"
  />
{:else}
  <div class="progress-container">
    <div class="text-of-day">
      {gameElement.textOfDay}<br />
      {counter}/{maxCount}
    </div>
    <div
      class="progress-bar"
      style="width: {(100 * counter) / maxCount}%"
    ></div>
  </div>
{/if}
{#if gameElement.answer}
  <div class="answer-container">
    <TextField
      bind:value
      error="{answerError}"
      disabled="{value === gameElement.answer && counter >= maxCount}"
      on:input="{() => {
        answerError = false;
        answerMsg = '';
      }}"
      messages="{answerMsg}"
      outlined
    >
      Input your answer here
    </TextField>
    {value === gameElement.answer && counter >= maxCount}
  </div>
{/if}
<div class="button-group-container">
  {#if !gameElement.answer && (!gameElement.timeDependentTime || (gameElement.timeDependentTime && atCorrectRange)) && (!gameElement.gyro || (gameElement.gyro && $gyroCompleted))}
    <div class="button-container">
      <button
        class="change-button"
        disabled="{counter <= 0}"
        on:click="{decrement}"
      >
        -
      </button>
      <p class="button-explain-text">Revert</p>
    </div>
    <div class="button-container">
      <button
        class="change-button"
        disabled="{counter >= maxCount}"
        on:click="{increment}">+</button
      >
      <p class="button-explain-text">Finish task</p>
    </div>
  {:else if gameElement.answer}
    <div class="button-container" style="position:relative">
      <div class="checkbox-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="20"
          height="20"
          viewBox="0 0 270 270"
        >
          <path
            d="M 30,180 90,240 240,30"
            style="stroke:#000; stroke-width:30; fill:none"
          >
          </path>
        </svg>
      </div>
      <button
        class="change-button"
        on:click="{submitAnswer}"
        disabled="{counter >= maxCount}"
      >
      </button>
      <p class="button-explain-text">Submit answer</p>
    </div>
  {/if}

  {#if gameElement.hint}
    <div class="button-container">
      <button
        style="align-items: center"
        class="change-button"
        on:click="{() => {
          active = true;
        }}">?</button
      >
      <p class="button-explain-text">Get a hint</p>

      <Dialog class="pa-4" bind:active>
        {gameElement.hint}
      </Dialog>
    </div>
  {/if}
</div>
{#if counter >= maxCount}
  <div class="approve-request-container">
    <div class="approve-request-text">
      Do you wish to submit your request for approval?
    </div>
    <Button on:click="{confirm}">Confirm</Button>
  </div>
{/if}

<style lang="scss">
  $main-color: #0e3c79;

  .text-of-day {
    z-index: 10;
    color: white;
    pointer-events: none;
  }

  .checkbox-container {
    pointer-events: none;
    position: absolute;
    top: 15px;
    left: 25px;
  }

  .progress-container {
    margin: 60px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    height: 60px;
    width: 200px;
    background-color: #b91f1f;
    .progress-bar {
      top: 0;
      left: 0;
      position: absolute;
      height: 100%;
      width: 50%;
      background-color: $main-color;
      transition: 0.3s all;
    }
  }

  .answer-container {
  }

  .button-group-container {
    margin-top: 15px;

    display: flex;
    justify-content: space-between;

    .button-container {
      .button-explain-text {
        margin-top: 10px;
        font-size: 12px;
        font-style: italic;
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

  .approve-request-container {
    margin-top: 40px;
    .approve-request-text {
      margin-bottom: 10px;
    }
  }
</style>
