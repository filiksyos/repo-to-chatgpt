import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Index from './pages/Index'

const App = () => (
  <BrowserRouter>
    <Toaster position="top-center" richColors />
    <Routes>
      <Route path="/" element={<Index />} />
    </Routes>
  </BrowserRouter>
)

export default App