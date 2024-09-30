import axios from 'axios';

const geminiApiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { start, destination } = req.body;

    try {
      const recommendations = await getTravelRecommendations(start, destination);
      res.status(200).json({ recommendations });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ error: 'Error generating travel recommendations.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getTravelRecommendations = async (start, destination) => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
  const prompt = `I want to travel from ${start} to ${destination}. Please suggest the best mode of transport, distance, and top 5 places to visit at the destination. Also, include any travel tips.`;

  const data = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const recommendation = response.data.candidates[0].content.parts[0].text;
    return recommendation;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Could not generate travel recommendations.');
  }
};
