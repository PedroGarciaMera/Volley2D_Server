<script>
    import { View } from './stores.js';

    import Name from './Views/Name.svelte';
    import Loading from './Views/Loading.svelte';
    import Game from './Views/Game2.svelte';


</script>

{#if $View=="Name"}
    <Name/>
{:else if $View=="Loading"}
    <Loading/>
{:else if $View=="Game"}
    <Game/>
{:else}
    404 VIEW NOT FOUND
{/if}