<script>
    import symbols from '../../bundler/main.json'	
	import Symbol from './Symbol'
    import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

    function clickSymbol(symbol) {
        dispatch('clickSymbol', symbol)
    }
</script>

<div class="symbol-list">
    {#each symbols as symbol}
        <Symbol symbol={symbol} size={80} on:click={() => clickSymbol(symbol)} />
    {/each}
</div>

<style>
.symbol-list {
	display: grid;
	grid-template-columns: 80px 80px 80px;
	grid-gap: 10px;
	justify-content: center;
}
</style>
