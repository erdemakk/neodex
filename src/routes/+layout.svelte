<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="min-h-screen flex flex-col bg-black text-white">
	<Header user={data.user} />

	<main class="min-h-screen flex flex-col bg-black text-white pt-28">
		<slot />
	</main>
</div>