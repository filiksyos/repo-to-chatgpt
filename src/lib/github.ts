export interface ParsedGitHubUrl {
  owner: string
  repo: string
}

export function parseGitHubUrl(url: string): ParsedGitHubUrl | null {
  try {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/,
      /^([^/]+)\/([^/]+)$/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ''),
        }
      }
    }

    return null
  } catch {
    return null
  }
}

export async function fetchFromGitHub(path: string) {
  const response = await fetch(`https://api.github.com/repos/${path}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}