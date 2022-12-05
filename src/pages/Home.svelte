<script lang="ts">
  import { Button } from 'svelte-materialify';

  import { SupabaseObject } from '../db';
  import type { GameElement } from '../interfaces/game-element';
  import { gameElementStore } from '../store';
  import Counter from './Counter.svelte';
  import { GameType } from '../interfaces/game-type';
  import Answer from './Answer.svelte';
  import Countdown from './TimeDependent.svelte';
  import TiltProgressBar from './TiltProgressBar.svelte';
  import GyroColor from './GyroColor.svelte';
  import PaintProgressBar from './PaintProgressBar.svelte';
  import LatLong from './LatLong.svelte';
  import Clicker from './Clicker.svelte';
  import DragProgressBar from './DragProgressBar.svelte';
  import DragPlusButton from './DragPlusButton.svelte';
  import TypeStidi from './TypeStidi.svelte';
  import SpinProgressBar from './SpinProgressBar.svelte';
  import OppositeDay from './OppositeDay.svelte';
  import MoveMan from './MoveMan.svelte';
  import Pinball from './Pinball.svelte';
  import ActualPinball from './ActualPinball.svelte';
  import Pinball2 from './Pinball2.svelte';
  import LetterMover from './LetterMover.svelte';
  import GravityPlusButton from './GravityPlusButton.svelte';
  import Candle from './Candle.svelte';
  import MovingPlusButton from './MovingPlusButton.svelte';
  import SpinningPlusButton from './SpinningPlusButton.svelte';
  import SnowballDrag from './SnowballDrag.svelte';

  async function confirm() {
    await SupabaseObject.confirmGameElementFinished($gameElementStore);
    gameElementStore.update((state) => {
      state.completed = true;
      return state;
    });
    window.location.href = '/';
  }
</script>

<!-- DONE -->
<!-- TODO maybe add more colliders?-->

<!--<ActualPinball />-->
<!--<MovingPlusButton />-->
<!--    <GravityPlusButton />-->

<!-- TODO fix text behind -->
<!--<Pinball />-->

<!--  <Pinball2 />-->
<!--{#if true}-->

{#if !$gameElementStore.attributes}
  <Counter setInputButtonsVisible="{true}" />
{:else if $gameElementStore.attributes.type === GameType.actualPinball}
  <ActualPinball />
{:else if $gameElementStore.attributes.type === GameType.pinball2}
  <Pinball2 />
{:else if $gameElementStore.attributes.type === GameType.pinball}
  <Pinball />
{:else if $gameElementStore.attributes.type === GameType.letterMover}
  <LetterMover />
{:else if $gameElementStore.attributes.type === GameType.movingMan}
  <MoveMan />
{:else if $gameElementStore.attributes.type === GameType.candle}
  <Candle />
{:else if $gameElementStore.attributes.type === GameType.gravityPlusButton}
  <GravityPlusButton />
{:else if $gameElementStore.attributes.type === GameType.movingPlus}
  <MovingPlusButton />
{:else if $gameElementStore.attributes.type === GameType.snowball}
  <SnowballDrag />
{:else if $gameElementStore.attributes.type === GameType.spinPlus}
  <SpinningPlusButton />
{:else if !$gameElementStore.attributes}
  <Counter setInputButtonsVisible="{true}" />
{:else if $gameElementStore.attributes.type === GameType.answer || $gameElementStore.attributes.type === GameType.hacker}
  <Answer />
{:else if $gameElementStore.attributes.type === GameType.timeDependent}
  <Countdown />
{:else if $gameElementStore.attributes.type === GameType.tiltProgressBar}
  <TiltProgressBar />
{:else if $gameElementStore.attributes.type === GameType.gyroColor}
  <GyroColor />
{:else if $gameElementStore.attributes.type === GameType.paintProgressBar}
  <PaintProgressBar />
{:else if $gameElementStore.attributes.type === GameType.locationDependent}
  <LatLong />
{:else if $gameElementStore.attributes.type === GameType.clicker}
  <Clicker />
{:else if $gameElementStore.attributes.type === GameType.secretMenuItem}
  <Counter setInputButtonsVisible="{false}" />
{:else if $gameElementStore.attributes.type === GameType.dragProgressBar}
  <DragProgressBar />
{:else if $gameElementStore.attributes.type === GameType.dragPlusButton}
  <DragPlusButton />
{:else if $gameElementStore.attributes.type === GameType.typeStidi}
  <TypeStidi />
{:else if $gameElementStore.attributes.type === GameType.spinProgressBar}
  <SpinProgressBar />
{:else if $gameElementStore.attributes.type === GameType.hiddenMessage}
  <Answer />
  <p class="hidden-message">Stisan is blitzan</p>
{:else if $gameElementStore.attributes.type === GameType.oppositeDay}
  <OppositeDay />
{:else if $gameElementStore.attributes.type === GameType.secretUrl}
  <Counter setInputButtonsVisible="{false}" />
{/if}

{#if $gameElementStore.currentCount >= $gameElementStore.maxCount && !($gameElementStore && $gameElementStore.attributes && $gameElementStore.attributes.type === GameType.oppositeDay)}
  <div class="approve-request-container">
    <div class="approve-request-text">
      Do you wish to submit your request for approval?
    </div>
    <Button on:click="{confirm}">Confirm</Button>
  </div>
{/if}

<style lang="scss">
  .checkbox-container {
    pointer-events: none;
    position: absolute;
    top: 15px;
    left: 25px;
  }

  .hidden-message {
    position: absolute;
    left: 20px;
    bottom: 50px;
    transform: rotateZ(90deg);
    color: white;
  }
  $main-color: #0e3c79;
  :global(.progress-container) {
    margin: 60px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    height: 60px;
    width: 200px;
    background-color: #b91f1f;
    :global(.text-of-day) {
      user-select: none;
      z-index: 10;
      color: white;
      pointer-events: none;
    }
    :global(.progress-bar) {
      top: 0;
      left: 0;
      position: absolute;
      height: 100%;
      width: 50%;
      background-color: $main-color;
      transition: 0.3s all;
    }
  }

  :global(.approve-request-container) {
    margin-top: 40px;
    :global(.approve-request-text) {
      margin-bottom: 10px;
    }
  }
</style>
