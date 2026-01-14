<script lang="ts">
	import SwapCard from '$lib/components/SwapCard.svelte';
	export let data;
</script>

<div class="min-h-[80vh]  flex items-center justify-center p-4">
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00ff9d]/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

	<SwapCard {data} />
</div>