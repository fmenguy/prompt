// Version temporaire SANS API (pour tester l'interface)
export async function generateEnhancedPrompt(selectedTags, subjectData) {
  // Simule un délai
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Construction basique (on améliorera avec l'API après)
  let prompt = "masterpiece, best quality, ";

  if (subjectData.species) prompt += `${subjectData.species} `;
  if (subjectData.gender) prompt += `${subjectData.gender} `;
  if (subjectData.age) prompt += `${subjectData.age}, `;

  prompt += selectedTags.join(", ");

  return prompt;
}
