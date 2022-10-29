<script>
    import { View, Name } from '../stores.js';

    function join(){ $View="Game"; }
</script>

<svelte:window on:keyup={(e) => { if(e.key=='Enter') join(); }}/>

<div class="bg" style="background-image:url('/imgs/BG.png');">
    <div class="center" style="width:100%;height:150%;">
        <input style="margin:1%;" type="text" pattern="[A-Za-z]" bind:value={$Name} placeholder="Nickname" maxlength="10"/>
        <button style="margin:1%;" on:click={join} disabled={$Name==""}>JOIN</button>
    </div>
</div>


<style>
    .bg {
        width: 100%; height: 100%;
        background-repeat: no-repeat;
        background-size:100% 100%;
    }
    .center { display: flex; justify-content: center; align-items: center; }
</style>