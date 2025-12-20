<script lang="ts">
	// --- SENARYO ---
	// Laboratuvarda 10 kişi tadım yaptı.
	// Puanlar toplandı, ortalaması alındı ve elimize aşağıdaki sonuçlar ulaştı.
	// Biz sadece bu sonuçları ekrana basıyoruz.

	// Kriter Listesi (Satırlarımız)
	const criteriaList = [
		{ id: 'doku', label: 'Doku' },
		{ id: 'kirilganlik', label: 'Kırılganlık' },
		{ id: 'tat', label: 'Tat' },
		{ id: 'aroma', label: 'Aroma' },
		{ id: 'genelKabul', label: 'Genel Kabul' }
	];

	// Numuneler ve Hesaplanan Ortalamaları (Sütunlarımız)
	// score: O kriterden aldığı ortalama puan (5 üzerinden)
	const results = {
		'Numune 1': { doku: 4.2, kirilganlik: 4.5, tat: 3.8, aroma: 4.0, genelKabul: 4.1 },
		'Numune 2': { doku: 3.5, kirilganlik: 3.0, tat: 4.8, aroma: 4.7, genelKabul: 4.2 },
		'Numune 3': { doku: 2.1, kirilganlik: 2.5, tat: 2.0, aroma: 1.8, genelKabul: 2.0 }
	};

	// Numune isimlerini bir listeye alalım ki döngü kurabilelim
	const sampleNames = ['Numune 1', 'Numune 2', 'Numune 3'];

	// Toplam Puan Hesaplama Fonksiyonu (Basit Matematik)
	function calculateTotal(sampleName: string) {
		const scores = results[sampleName as keyof typeof results];
		// Object.values: Bir objenin içindeki sadece sayıları alır (4.2, 4.5 vb.)
		// reduce: Bu sayıları tek tek toplar.
		const total = Object.values(scores).reduce((a, b) => a + b, 0);
		return total.toFixed(1); // Virgülden sonra 1 basamak göster (Örn: 20.5)
	}
</script>

<div class="min-h-screen bg-gray-100 py-10 flex justify-center items-start font-sans print:bg-white print:p-0">

	<div class="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-lg p-10 relative flex flex-col gap-6 print:shadow-none print:w-full">

		<header class="border-b-4 border-black pb-4 mb-4 flex justify-between items-end">
			<div>
				<h1 class="text-3xl font-bold text-black uppercase tracking-widest">SONUÇ RAPORU</h1>
				<p class="text-sm text-gray-600 mt-1">Duyusal Analiz Laboratuvarı</p>
			</div>
			<div class="text-right">
				<p class="font-bold text-lg">Rapor No: <span class="font-normal">2025-001</span></p>
				<p class="font-bold text-lg">Tarih: <span class="font-normal">20.12.2025</span></p>
			</div>
		</header>

		<div class="border border-black p-4 bg-gray-50 print:bg-white">
			<h3 class="font-bold text-black border-b border-black mb-2 pb-1 uppercase text-sm">Analiz Özeti</h3>
			<div class="grid grid-cols-2 gap-4 text-sm">
				<p><strong>Ürün Grubu:</strong> Kraker Numuneleri</p>
				<p><strong>Panelist Sayısı:</strong> 12 Kişi</p>
				<p><strong>Yöntem:</strong> 5'li Hedonik Skala</p>
				<p><strong>Sıcaklık:</strong> 22°C (Oda Koşulları)</p>
			</div>
		</div>

		<div class="mt-4">
			<h3 class="font-bold text-black mb-2 uppercase text-lg">Detaylı Puan Tablosu (Ortalamalar)</h3>

			<table class="w-full border-collapse border border-black text-sm">
				<thead>
				<tr class="bg-black text-white print:bg-gray-300 print:text-black">
					<th class="p-3 border border-black text-left w-1/4">Kriter</th>
					{#each sampleNames as name}
						<th class="p-3 border border-black text-center w-1/4">{name}</th>
					{/each}
				</tr>
				</thead>
				<tbody>
				{#each criteriaList as criteria}
					<tr>
						<td class="p-3 border border-black font-bold bg-gray-50 print:bg-transparent">
							{criteria.label}
						</td>

						{#each sampleNames as name}
							<td class="p-3 border border-black align-middle">
								<div class="flex flex-col gap-1">
                    <span class="font-bold text-lg text-center block">
                      {results[name][criteria.id]}
                    </span>

									<div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-400 print:border-black">
										<div
											class="h-full bg-black print:bg-black"
											style="width: {results[name][criteria.id] * 20}%">
										</div>
									</div>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
				</tbody>

				<tfoot>
				<tr class="bg-gray-100 font-bold border-t-2 border-black print:bg-gray-200">
					<td class="p-4 border border-black text-right uppercase">Genel Toplam</td>
					{#each sampleNames as name}
						<td class="p-4 border border-black text-center text-xl">
							{calculateTotal(name)}
						</td>
					{/each}
				</tr>
				</tfoot>
			</table>
		</div>

		<div class="mt-auto border-2 border-black p-6">
			<h3 class="font-bold text-black border-b border-black mb-4 pb-1 uppercase">Nihai Değerlendirme ve Karar</h3>

			<div class="text-sm leading-7">
				<p>Yapılan duyusal analiz sonucunda;</p>
				<p class="mt-2">
					<strong>Numune 2</strong>, özellikle <em>Tat</em> ve <em>Aroma</em> parametrelerinde en yüksek puanları alarak panelistler tarafından en beğenilen ürün olmuştur.
				</p>
				<p class="mt-2">
					<strong>Numune 1</strong>, doku bakımından tatmin edici bulunsa da genel kabul puanı ikincil sırada kalmıştır.
				</p>
				<p class="mt-2">
					<strong>Numune 3</strong>, tüm parametrelerde ortalamanın altında kalarak geliştirilmesi gerektiği sonucuna varılmıştır.
				</p>
			</div>
		</div>

		<div class="mt-8 flex justify-between text-center pb-10">
			<div class="w-1/3">
				<p class="font-bold mb-8">Analizi Yapan</p>
				<div class="border-t border-black w-2/3 mx-auto"></div>
				<p class="text-xs mt-1">İmza</p>
			</div>
			<div class="w-1/3">
				<p class="font-bold mb-8">Laboratuvar Sorumlusu</p>
				<div class="border-t border-black w-2/3 mx-auto"></div>
				<p class="text-xs mt-1">İmza</p>
			</div>
		</div>

	</div>
</div>