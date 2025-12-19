<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="min-h-screen flex flex-col bg-black text-white">
	<Header />
	<main class="min-h-screen flex flex-col bg-black text-white pt-28">
		<slot />
	</main>
</div>