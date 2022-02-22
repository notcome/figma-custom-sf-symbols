<script>
    import symbols from '../../bundler/main.json'	
	import Symbol from './Symbol'
</script>

<div class="symbol-list">
    {#each symbols as symbol}
        <Symbol symbol={symbol} size={60} />
    {/each}
</div>

<style>
.symbol-list {
	display: grid;
	grid-template-columns: 60px 60px 60px;
	grid-gap: 10px;
	justify-content: center;
}
</style>
