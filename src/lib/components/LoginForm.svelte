<script lang="ts">
	export let form: { message?: string } | null = null;
</script>

<div class="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
	<h2 class="text-2xl font-bold text-white mb-6 text-center">
		Tekrar <span class="text-[#00ff9d]">Hoşgeldin</span>
	</h2>
	<form method="POST" action="?/login" class="space-y-4">

		<div>
			<label for="email" class="block text-sm font-bold text-gray-400 mb-2">Email</label>
			<input
				id="email"
				type="email"
				name="email"
				required
				class="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#00ff9d] focus:outline-none transition-colors"
				placeholder="ornek@site.com"
			/>
		</div>

		<div>
			<label for="password" class="block text-sm font-bold text-gray-400 mb-2">Şifre</label>
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

		<button type="submit" class="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]">
			Giriş Yap
		</button>

	</form>

	<p class="text-center text-gray-500 text-sm mt-4">
		Hesabın yok mu? <a href="/register" class="text-[#00ff9d] hover:underline">Kayıt Ol</a>
	</p>
</div>