import { FileTree, Folder } from 'lucide-react'

interface FolderTreeProps {
  structure: string[]
}

export default function FolderTree({ structure }: FolderTreeProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileTree className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Folder Structure</h2>
      </div>
      <div className="bg-gray-50 rounded-md p-4 max-h-[500px] overflow-auto">
        <pre className="text-sm text-gray-800 font-mono">
          {structure.length > 0 ? (
            structure.map((line, index) => (
              <div key={index} className="flex items-center gap-1">
                {line.includes('/') && <Folder className="h-3 w-3 text-blue-500 inline" />}
                <span>{line}</span>
              </div>
            ))
          ) : (
            <span className="text-gray-400">No structure available</span>
          )}
        </pre>
      </div>
    </div>
  )
}