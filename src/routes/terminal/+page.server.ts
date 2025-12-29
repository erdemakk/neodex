import { env } from '$env/dynamic/private';

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const historyRaw = formData.get('history');

			if (!historyRaw) {
				return { aiResponse: "Hata: Paket içeriği boş!" };
			}

			const messages = JSON.parse(historyRaw.toString());

			const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${env.SECRET_GROQ_API_KEY}`
				},
				body: JSON.stringify({
					model: "llama-3.3-70b-versatile",
					messages: messages
				})
			});

			const data = await response.json();

			if (!response.ok) {
				return { aiResponse: "API Hatası: " + (data.error?.message || response.status) };
			}

			return {
				aiResponse: data.choices[0].message.content
			};
		} catch (err) {
			return { aiResponse: "Sistem hatası oluştu!" };
		}
	}
};