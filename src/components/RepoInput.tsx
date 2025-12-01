import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Github } from 'lucide-react'

interface RepoInputProps {
  onGenerate: (url: string) => void
  loading: boolean
}

export default function RepoInput({ onGenerate, loading }: RepoInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onGenerate(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 mb-2">
          GitHub Repository URL
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="repo-url"
              type="text"
              placeholder="https://github.com/username/repository"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !url.trim()} size="lg">
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Enter a GitHub repository URL to generate documentation and ChatGPT deeplinks
        </p>
      </div>
    </form>
  )
}