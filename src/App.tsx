import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Lottie Inspector
        </h1>
        <p className="text-gray-600 mb-6">
          React + Vite + Tailwind CSS
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        <p className="text-gray-500 mt-4 text-sm">
          Edit src/App.jsx to get started
        </p>
      </div>
    </div>
  )
}

export default App
