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
  default_branch: string
}

interface FileTreeItem {
  path: string
  type: string
  sha?: string
  size?: number
}

interface TreeResponse {
  tree: FileTreeItem[]
  sha: string
  url: string
}

interface FileContent {
  content: string
  encoding: string
  size: number
  path: string
}

export async function fetchRepoStructure(owner: string, repo: string): Promise<string[]> {
  try {
    // First, fetch repository info to get the default branch
    const repoData: RepoData = await fetchFromGitHub(`${owner}/${repo}`)
    const defaultBranch = repoData.default_branch || 'main'
    
    // Try to fetch the tree structure using the default branch
    let tree: TreeResponse | null = null
    try {
      tree = await fetchFromGitHub(`${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`)
    } catch (error) {
      // If default branch fails, try common alternatives
      const fallbackBranches = ['main', 'master', 'develop', 'dev']
      let lastError = error
      
      for (const branch of fallbackBranches) {
        if (branch === defaultBranch) continue // Skip if already tried
        try {
          tree = await fetchFromGitHub(`${owner}/${repo}/git/trees/${branch}?recursive=1`)
          break
        } catch (e) {
          lastError = e
        }
      }
      
      if (!tree) {
        throw lastError
      }

    }
    
    if (!tree) {
      return ['Error: Could not fetch repository tree structure']
    }
    
    const structure: string[] = []
    
    if (tree.tree && Array.isArray(tree.tree)) {
      const items = tree.tree as FileTreeItem[]
      
      // Sort items to show directories first, then files
      const sortedItems = items.sort((a, b) => {
        if (a.type === 'tree' && b.type !== 'tree') return -1
        if (a.type !== 'tree' && b.type === 'tree') return 1
        return a.path.localeCompare(b.path)
      })
      
      // Build a hierarchical structure
      const processedPaths = new Set<string>()
      
      sortedItems.forEach((item: FileTreeItem) => {
        // Limit to first 100 items to avoid overwhelming the UI
        if (structure.length >= 100) return
        
        const parts = item.path.split('/')
        let currentPath = ''
        
        // Add parent directories if not already processed
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i]
          if (!processedPaths.has(currentPath)) {
            const depth = i
            const prefix = '  '.repeat(depth)
            structure.push(`${prefix}📁 ${parts[i]}`)
            processedPaths.add(currentPath)
          }
        }
        
        // Add the file/directory itself
        const depth = parts.length - 1
        const prefix = '  '.repeat(depth)
        const icon = item.type === 'tree' ? '📁' : '📄'
        const name = parts[parts.length - 1]
        
        if (!processedPaths.has(item.path)) {
          structure.push(`${prefix}${icon} ${name}`)
          processedPaths.add(item.path)
        }
      })
    }
    
    if (structure.length === 0) {
      return ['No files found in repository']
    }
    
    return structure
  } catch (error: any) {
    console.error('Error fetching repo structure:', error)
    const errorMessage = error?.message || 'Unknown error'
    return [`Error loading structure: ${errorMessage}`]
  }
}

async function fetchFileContent(
  owner: string,
  repo: string,
  filePath: string,
  defaultBranch: string
): Promise<string | null> {
  try {
    const fileContent: FileContent = await fetchFromGitHub(
      `${owner}/${repo}/contents/${filePath}?ref=${defaultBranch}`
    )
    
    if (fileContent.encoding === 'base64' && fileContent.content) {
      // Decode base64 content
      const decoded = atob(fileContent.content.replace(/\s/g, ''))
      return decoded
    }
    
    return null
  } catch (error) {
    console.error(`Error fetching file ${filePath}:`, error)
    return null
  }
}

export async function generateDocumentation(
  owner: string,
  repo: string,
  structure: string[]
): Promise<string> {
  try {
    const repoData: RepoData = await fetchFromGitHub(`${owner}/${repo}`)
    const defaultBranch = repoData.default_branch || 'main'
    
    // Fetch the tree to get full file paths
    let tree: TreeResponse | null = null
    try {
      tree = await fetchFromGitHub(`${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`)
    } catch (error) {
      console.error('Error fetching tree for file contents:', error)
    }
    
    // Only fetch README files to keep URL short
    const readmeFiles = ['README.md', 'readme.md', 'README.txt', 'readme.txt', 'README', 'readme']
    let readmeContent: { path: string; content: string } | null = null
    
    if (tree?.tree) {
      const items = tree.tree as FileTreeItem[]
      
      // Find the first README file
      for (const item of items) {
        if (item.type === 'blob') {
          const fileName = item.path.split('/').pop() || ''
          if (readmeFiles.includes(fileName)) {
            const content = await fetchFileContent(owner, repo, item.path, defaultBranch)
            if (content) {
              // Limit README size to 10000 characters to keep URL manageable
              const truncatedContent = content.length > 10000 
                ? content.substring(0, 10000) + '\n... (truncated)'
                : content
              readmeContent = { path: item.path, content: truncatedContent }
              break // Only fetch the first README found
            }
          }
        }
      }
    }
    
    // Build documentation
    let doc = `# ${repoData.name}

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

`

    // Add README content if found
    if (readmeContent) {
      doc += `## README

\`\`\`markdown
${readmeContent.content}
\`\`\`

`
    }
    
    doc += `## About

This documentation was automatically generated from the GitHub repository.

---

*Generated with Repo to ChatGPT*`

    return doc
  } catch (error) {
    console.error('Error generating documentation:', error)
    return 'Error generating documentation'
  }
}
