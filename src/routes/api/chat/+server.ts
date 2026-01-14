import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST = async ({ request }) => {
	try {
		const { messages } = await request.json();

		const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${env.SECRET_GROQ_API_KEY}`
			},
			body: JSON.stringify({
				model: 'llama-3.3-70b-versatile',
				messages: messages
			})
		});

		const data = await response.json();
		return json(data);
	} catch (error) {
		return json({ error: 'SERVER_ERROR' }, { status: 500 });
	}
};
