export function generateChatGPTDeeplink(documentation: string, repoUrl: string): string {
  const prompt = `I have a GitHub repository and I'd like you to help me understand it and potentially recreate it.

Repository URL: ${repoUrl}

Here's the documentation I've generated:

${documentation}

Can you:
1. Analyze the project structure and tech stack
2. Explain what this repository does
3. Provide suggestions for improvements or similar projects
4. Help me understand how to set it up locally

Please provide detailed insights and actionable recommendations.`

  const encodedPrompt = encodeURIComponent(prompt)
  
  // ChatGPT deeplink format: https://chat.openai.com/?q=YOUR_PROMPT
  return `https://chat.openai.com/?q=${encodedPrompt}`
}