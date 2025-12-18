<script lang="ts">
	let weight = $state(70);
	let height = $state(170);

	let bmi = $derived( weight / ( (height/100) * (height/100) ) );

	let status = $derived.by(() => {
		if (bmi < 18.5) return "Zayıf";
		if (bmi < 25) return "Sağlıklı";
		if (bmi < 30) return "Kilolu";
		return "Obez";
	});

	let colorClass = $derived.by(() => {
		if (bmi < 18.5) return "text-blue-400";
		if (bmi < 25) return "text-green-500";
		if (bmi < 30) return "text-orange-500";
		return "text-red-500";
	});
</script>

<div class="bg-gray-900 h-screen flex items-center justify-center font-sans text-white">

	<div class="bg-green-900 p-10 rounded-3xl shadow-2xl w-[400px] border border-gray-700 flex flex-col gap-8">

		<h1 class="text-3xl font-bold text-center text-gray-200">Sağlık Robotu 🤖</h1>

		<div>
			<label class="block text-gray-400 text-sm mb-2 font-bold">KİLO (kg)</label>

			<input type="range" min="30" max="150" bind:value={weight} class="w-full h-2 bg-gray-600 rounded-lg cursor-pointer mb-2">

			<div class="flex justify-between items-center">
				<input type="number" bind:value={weight} class="bg-gray-700 p-2 rounded w-20 font-bold border border-gray-600 text-center">
				<span class="text-gray-500 text-sm">kg</span>
			</div>
		</div>

		<div>
			<label class="block text-gray-400 text-sm mb-2 font-bold">BOY (cm)</label>

			<input type="range" min="100" max="230" bind:value={height} class="w-full h-2 bg-gray-600 rounded-lg cursor-pointer mb-2">

			<div class="flex justify-between items-center">
				<input type="number" bind:value={height} class="bg-gray-700 p-2 rounded w-20 font-bold border border-gray-600 text-center">
				<span class="text-gray-500 text-sm">cm</span>
			</div>
		</div>
		<div class="border-4 {colorClass} rounded-2xl p-6 text-center transition-all duration-500 mt-6">

			<p class="text-gray-400 text-xs uppercase tracking-widest mb-2">Vücut Kitle Endeksi</p>

			<h2 class="text-6xl font-bold mb-2 text-white">
				{bmi.toFixed(1)}
			</h2>

			<p class="text-xl font-bold uppercase tracking-wider {colorClass}">
				{status}
			</p>

		</div>
	</div>
</div>