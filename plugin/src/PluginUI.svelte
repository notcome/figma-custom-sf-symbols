<script>

	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from 'figma-plugin-ds-svelte';

	//import some Svelte Figma UI components
	import { Button, Input, Label, SelectMenu } from 'figma-plugin-ds-svelte';
	import SymbolList from './SymbolList'

	//menu items, this is an array of objects to populate to our select menus
	let menuItems = [
        { 'value': 'rectangle', 'label': 'Rectangle', 'group': null, 'selected': false },
        { 'value': 'triangle', 'label': 'Triangle ', 'group': null, 'selected': false },
        { 'value': 'circle', 'label': 'Circle', 'group': null, 'selected': false }
	];

	var disabled = true;
	var selectedShape;
	var count = 5;

	//this is a reactive variable that will return false when a value is selected from
	//the select menu, its value is bound to the primary buttons disabled prop
	$: disabled = selectedShape === null;

	function createShapes() {
		parent.postMessage({ pluginMessage: { 
			'type': 'create-shapes', 
			'count': count,
			'shape': selectedShape.value
		} }, '*');
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { 'type': 'cancel' } }, '*')
	}


	if (!window.onFigmaMessage) {
		window.onFigmaMessage = 3
	}
</script>


<div class="wrapper p-xxsmall">

	<!-- <Label>Shape</Label>
	<SelectMenu bind:menuItems={menuItems} bind:value={selectedShape} class="mb-xxsmall"/>
	
	<Label>Count</Label>
	<Input iconText="#" bind:value={count} class="mb-xxsmall"/>

	<div class="flex p-xxsmall mb-xsmall">
	<Button on:click={cancel} variant="secondary" class="mr-xsmall">Cancel</Button>
	<Button on:click={createShapes} bind:disabled={disabled}>Create shapes</Button>
	</div> -->

	<SymbolList />

</div>


<style>
/* Add additional global or scoped styles here */

</style>