import { fetchFromGitHub } from './github'

interface RepoData {
  name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  html_url: string
  topics: string[]
}

interface FileTreeItem {
  path: string
  type: string
}

export async function fetchRepoStructure(owner: string, repo: string): Promise<string[]> {
  try {
    const tree = await fetchFromGitHub(`${owner}/${repo}/git/trees/main?recursive=1`)
    const structure: string[] = []
    
    if (tree.tree) {
      const items = tree.tree as FileTreeItem[]
      items.slice(0, 50).forEach((item: FileTreeItem) => {
        const depth = item.path.split('/').length - 1
        const prefix = '  '.repeat(depth)
        const icon = item.type === 'tree' ? '📁' : '📄'
        structure.push(`${prefix}${icon} ${item.path.split('/').pop()}`)
      })
    }
    
    return structure
  } catch (error) {
    console.error('Error fetching repo structure:', error)
    return ['Error loading structure']
  }
}

export async function generateDocumentation(
  owner: string,
  repo: string,
  structure: string[]
): Promise<string> {
  try {
    const repoData: RepoData = await fetchFromGitHub(`${owner}/${repo}`)
    
    const doc = `# ${repoData.name}

${repoData.description || 'No description provided'}

## Repository Information

- **Owner:** ${owner}
- **Repository:** ${repo}
- **Language:** ${repoData.language || 'Not specified'}
- **Stars:** ${repoData.stargazers_count}
- **Forks:** ${repoData.forks_count}
- **Open Issues:** ${repoData.open_issues_count}
- **URL:** ${repoData.html_url}

## Topics

${repoData.topics && repoData.topics.length > 0 ? repoData.topics.map(t => `- ${t}`).join('\n') : 'No topics available'}

## Project Structure

\`\`\`
${structure.join('\n')}
\`\`\`

## About

This documentation was automatically generated from the GitHub repository.

---

*Generated with Repo to ChatGPT*`

    return doc
  } catch (error) {
    console.error('Error generating documentation:', error)
    return 'Error generating documentation'
  }
}