import { Button } from '@/components/ui/button'
import { Copy, Download } from 'lucide-react'
import { toast } from 'sonner'

interface DocumentationOutputProps {
  documentation: string
}

export default function DocumentationOutput({ documentation }: DocumentationOutputProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(documentation)
      toast.success('Documentation copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'README.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Documentation downloaded!')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Generated Documentation</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-md p-4 max-h-[500px] overflow-auto">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
          {documentation}
        </pre>
      </div>
    </div>
  )
}