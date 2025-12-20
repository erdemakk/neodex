<script lang="ts">
	// Sadece listelerimiz kaldı. Çünkü HTML döngüsü için bunlara ihtiyacımız var.
	// Hesaplama değişkenlerini sildik.

	const criteriaList = [
		{ label: 'Doku (Kıtır–Yumuşak)' },
		{ label: 'Kırılganlık' },
		{ label: 'Tat' },
		{ label: 'Aroma' },
		{ label: 'Genel Duyusal Kabul' }
	];

	const sampleNames = ['Numune 1', 'Numune 2', 'Numune 3'];
	const scoreOptions = [1, 2, 3, 4, 5];
</script>

<div class="min-h-screen bg-gray-200 py-10 flex justify-center items-start font-sans print:bg-white print:p-0">

	<div class="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-8 relative flex flex-col gap-4 print:shadow-none print:w-full">

		<header class="text-center border-b-2 border-black pb-3 mb-4">
			<h1 class="text-2xl font-bold text-black uppercase tracking-wide">Kraker Numuneleri Duyusal Değerlendirme Formu</h1>
		</header>

		<div class="flex flex-col sm:flex-row justify-between items-end gap-6 text-sm text-black px-1 mb-4">
			<div class="flex items-center gap-2 w-full sm:w-1/2">
				<span class="font-bold whitespace-nowrap text-base">Değerlendirici No:</span>
				<div class="flex-1 border-b border-black h-6"></div>
			</div>
			<div class="flex items-center gap-2 w-full sm:w-auto">
				<span class="font-bold text-base">Tarih:</span>
				<div class="border-b border-black h-6 w-40"></div>
			</div>
		</div>

		<div class="border border-black p-2 rounded text-xs text-black">
			<p><strong>Yönerge:</strong> Aşağıdaki kraker numunelerini verilen kriterlere göre <strong>1–5</strong> arası puanlayınız. (1 = Çok kötü, 5 = Çok iyi)</p>
		</div>

		<div class="overflow-x-auto mt-1">
			<table class="w-full border-collapse border border-black table-fixed">
				<thead>
				<tr class="bg-gray-100 print:bg-gray-100">
					<th class="py-3 border border-black text-center w-1/5 font-bold text-black text-sm align-middle">Kriter</th>
					{#each sampleNames as sampleName}
						<th class="py-3 border border-black text-center w-[26%] font-bold text-black text-sm align-middle">{sampleName}</th>
					{/each}
				</tr>
				</thead>
				<tbody>
				{#each criteriaList as criteria}
					<tr>
						<td class="py-4 px-2 border border-black font-bold text-black align-middle text-center text-sm">
							{criteria.label}
						</td>

						{#each sampleNames as _}
							<td class="py-4 px-1 border border-black align-middle text-center">
								<div class="flex flex-row flex-nowrap gap-1 justify-center items-center">
									{#each scoreOptions as s}
										<div class="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-black rounded font-bold text-xs text-black bg-white">
											{s}
										</div>
									{/each}
								</div>
							</td>
						{/each}
					</tr>
				{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-2">
			<label class="block font-bold text-black mb-2 uppercase text-xs">Genel Görüş / Yorum:</label>
			<div class="w-full h-40 border border-black bg-[linear-gradient(transparent_1.4rem,#000_1.4rem)] bg-[length:100%_1.5rem] leading-[1.5rem]"></div>
		</div>

		<footer class="mt-auto pt-4 border-t border-black text-[10px] text-black italic">
			Not: Bu değerlendirme 5’li hedonik skala kullanılarak yapılmıştır.
		</footer>

	</div>
</div>
asss