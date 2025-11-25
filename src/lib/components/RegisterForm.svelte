<script lang="ts">

</script>

<div class="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
	<h2 class="text-2xl font-bold text-white mb-6 text-center">
		Join <span class="text-[#00ff9d]">NeoDEX</span>
	</h2>
	<form method="POST" action="?/register" class="space-y-4">
		<div>
			<label class="block text-sm text-gray-400 mb-1">Username</label>
			<input
				type="text"
				name="username"
				required
				class="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#00ff9d] focus-outline-none"
				placeholder="Create a Username"
				/>
		</div>
		<div>
			<label class="block text-sm text-gray-400 mb-1">Email</label>
			<input
			type="email"
			name="email"
			required
			class="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#00ff9d] focus-outline-none"
			placeholder="Write an E-mail"
			/>
		</div>
		<div>
			<label class="block text-sm text-gray-400 mb-1">Password</label>
			<input
			type="password"
			name="password"
			required
			class="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#00ff9d] focus-outline-none"
			placeholder="Create a Password"
			/>
		</div>
		<button
			type="submit"
			class="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-bold py-3 rounded-lg transition all">
			Create Account
		</button>
	</form>
</div>