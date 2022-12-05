<script lang="ts">
  import { Button } from 'svelte-materialify';
  import { SupabaseObject } from '../db';
  import { gameElementStore } from '../store';
  import { navigate } from 'svelte-navigator';

  async function increment() {
    $gameElementStore.currentCount++;
    await SupabaseObject.setGameElementCount($gameElementStore);
    await SupabaseObject.confirmGameElementFinished($gameElementStore);
    gameElementStore.update((state) => {
      state.completed = true;
      return state;
    });
    window.location.href = '/';
  }
</script>

You found the confirm button Congrats!
<div class="approve-request-container">
  <div class="approve-request-text">
    Do you wish to submit your request for approval?
  </div>
  <Button on:click="{increment}">Confirm</Button>
</div>

<style lang="scss">
</style>
