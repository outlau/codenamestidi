<script lang="ts">
  import { gameElementStore } from '../store';
</script>

<div class="progress-container">
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
  <div
    class="progress-bar"
    style="width: {(100 * $gameElementStore.currentCount) /
      $gameElementStore.maxCount}%"
  ></div>
</div>
