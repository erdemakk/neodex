<script lang="ts">
	export let form: { message?: string } | null = null;
</script>

<div class="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">

	<h2 class="text-2xl font-bold text-white mb-6 text-center">
		Welcome <span class="text-[#00ff9d]">Back</span>
	</h2>

	<form method="POST" action="?/login" class="space-y-4">

		<div>
			<label for="username" class="block text-sm text-gray-400 mb-1">Username</label>
			<input
				id="username"
				type="text"
				name="username"
				required
				class="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#00ff9d] focus:outline-none transition-colors"
				placeholder="your username"
			/>
		</div>

		<div>
			<label for="password" class="block text-sm text-gray-400 mb-1">Password</label>
			<input
				id="password"
				type="password"
				name="password"
				required
				class="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#00ff9d] focus:outline-none transition-colors"
				placeholder="••••••••"
			/>
		</div>

		{#if form?.message}
			<div class="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
				{form.message}
			</div>
		{/if}

		<button
			type="submit"
			class="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]">
			Login
		</button>

	</form>

	<p class="text-center text-gray-500 text-sm mt-4">
		Don't have an account? <a href="/register" class="text-[#00ff9d] hover:underline">Register</a>
	</p>

</div>