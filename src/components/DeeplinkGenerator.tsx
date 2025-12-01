import { Button } from '@/components/ui/button'
import { Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { generateChatGPTDeeplink } from '@/lib/deeplink'

interface DeeplinkGeneratorProps {
  documentation: string
  repoUrl: string
}

export default function DeeplinkGenerator({ documentation, repoUrl }: DeeplinkGeneratorProps) {
  const deeplink = generateChatGPTDeeplink(documentation, repoUrl)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(deeplink)
      toast.success('ChatGPT deeplink copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy deeplink')
    }
  }

  const handleOpen = () => {
    window.open(deeplink, '_blank')
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-green-600" />
            ChatGPT Deeplink
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Click to open ChatGPT with this repository documentation pre-loaded
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            Copy Link
          </Button>
          <Button size="sm" onClick={handleOpen} className="bg-green-600 hover:bg-green-700">
            <ExternalLink className="h-4 w-4 mr-1" />
            Open ChatGPT
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-md p-3 border border-green-200">
        <code className="text-xs text-gray-600 break-all">
          {deeplink}
        </code>
      </div>
    </div>
  )
}