<script lang="ts">
  import { Button, Icon } from 'svelte-materialify';
  import { mdiCheckboxMarkedCircleOutline } from '@mdi/js';

  import { SupabaseObject } from '../db';
  import { onDestroy, onMount } from 'svelte';
  import type { GameElement } from '../interfaces/game-element';

  let interval;

  let tasks: Array<GameElement> = [];
  onMount(async () => {
    tasks = await SupabaseObject.getGameElementsWaitingForApproval();
    interval = setInterval(async () => {
      tasks = await SupabaseObject.getGameElementsWaitingForApproval();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
  async function approve(gameElement: GameElement) {
    await SupabaseObject.approveGameElement(gameElement);
    tasks = await SupabaseObject.getGameElementsWaitingForApproval();
  }

  function reset() {
    SupabaseObject.resetGame();
  }
</script>

Completed tasks:

<Button on:click="{reset}">Reset everything</Button>
{#each tasks as task}
  <div on:click="{() => approve(task)}" class="task-container">
    <b>{task.textOfDay}</b> <br /> <i>{task.timeCompleted.toLocaleString()}</i>

    <div class="icon-container">
      <Icon path="{mdiCheckboxMarkedCircleOutline}" class="green-text" />
    </div>
  </div>
{/each}

<style lang="scss">
  .task-container {
    position: relative;
    border-radius: 10px;
    text-align: left;
    box-shadow: 0 0 1px 1px #0e3c79;
    width: 100%;
    padding: 10px 16px;
    margin-top: 20px;

    .icon-container {
      position: absolute;
      right: 10px;
      top: 20px;
    }
  }
</style>
