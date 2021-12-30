<script lang="ts">
  import { Icon } from 'svelte-materialify';
  import { mdiCheckboxMarkedCircleOutline } from '@mdi/js';

  import { SupabaseObject } from '../db';
  import { onMount } from 'svelte';
  import type { GameElement } from '../interfaces/game-element';

  let tasks: Array<GameElement> = [];
  onMount(async () => {
    tasks = await SupabaseObject.getCompletedAndApprovedGameElements();
  });
</script>

Completed tasks:

{#each tasks as task}
  <div class="task-container">
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
