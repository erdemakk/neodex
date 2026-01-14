<script lang="ts">
	import LoginForm from '$lib/components/LoginForm.svelte';

	export let form;
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-black">
	<LoginForm {form} />
</div>