router.post('/generate-prompt', authenticateApiKey, async (req, res) => {
  try {
    const { selectedTags, subjectData, systemPrompt } = req.body;

    // Utiliser le nouveau prompt système si fourni
    const finalSystemPrompt = systemPrompt || getDefaultSystemPrompt();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `${finalSystemPrompt}\n\nUser request:\nTags: ${selectedTags.join(', ')}\nSubject: ${JSON.stringify(subjectData)}\n\nGenerate professional Stable Diffusion prompt:`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      }
    );

    // ... reste du code
  }
});

function getDefaultSystemPrompt() {
  return `Basic fallback prompt generator...`; // Version simplifiée
}
