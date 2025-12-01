import { useState } from 'react'
import { toast } from 'sonner'
import RepoInput from '@/components/RepoInput'
import DocumentationOutput from '@/components/DocumentationOutput'
import FolderTree from '@/components/FolderTree'
import DeeplinkGenerator from '@/components/DeeplinkGenerator'
import { parseGitHubUrl } from '@/lib/github'
import { fetchRepoStructure, generateDocumentation } from '@/lib/documentation'
import { Loader2 } from 'lucide-react'

export default function Index() {
  const [loading, setLoading] = useState(false)
  const [documentation, setDocumentation] = useState('')
  const [folderStructure, setFolderStructure] = useState<string[]>([])
  const [repoUrl, setRepoUrl] = useState('')

  const handleGenerate = async (url: string) => {
    setLoading(true)
    setRepoUrl(url)
    
    try {
      const parsed = parseGitHubUrl(url)
      if (!parsed) {
        toast.error('Invalid GitHub URL')
        setLoading(false)
        return
      }

      const { owner, repo } = parsed
      const structure = await fetchRepoStructure(owner, repo)
      setFolderStructure(structure)
      
      const docs = await generateDocumentation(owner, repo, structure)
      setDocumentation(docs)
      
      toast.success('Documentation generated successfully!')
    } catch (error) {
      toast.error('Failed to generate documentation')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Repo to ChatGPT
          </h1>
          <p className="text-gray-600 text-lg">
            Transform GitHub repositories into documentation and ChatGPT deeplinks
          </p>
        </header>

        <div className="mb-8">
          <RepoInput onGenerate={handleGenerate} loading={loading} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Analyzing repository...</span>
          </div>
        )}

        {!loading && documentation && (
          <div className="space-y-6">
            <DeeplinkGenerator documentation={documentation} repoUrl={repoUrl} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FolderTree structure={folderStructure} />
              <DocumentationOutput documentation={documentation} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}