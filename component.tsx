import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, SearchIcon, ExternalLinkIcon, CodeIcon, ShieldCheckIcon, BookOpenIcon, MenuIcon } from 'lucide-react'
import * as THREE from 'three'

export default function Component() {
  const [query, setQuery] = useState('')
  const [operator, setOperator] = useState('')
  const [operatorValue, setOperatorValue] = useState('')
  const [generatedQuery, setGeneratedQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)

      const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
      const material = new THREE.MeshBasicMaterial({ color: 0x0066cc, wireframe: true })
      const torus = new THREE.Mesh(geometry, material)
      scene.add(torus)

      camera.position.z = 30

      const animate = () => {
        requestAnimationFrame(animate)
        torus.rotation.x += 0.01
        torus.rotation.y += 0.005
        renderer.render(scene, camera)
      }

      animate()

      const handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let searchQuery = query
    if (operator && operatorValue) {
      searchQuery = `${operator}${operatorValue} ${query}`
    }
    setGeneratedQuery(searchQuery)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10">
        <header className="bg-blue-900 bg-opacity-80 shadow-lg sticky top-0">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="text-xl md:text-2xl font-bold">SearchMaster</div>
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                  <MenuIcon className="h-6 w-6" />
                </button>
              </div>
              <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:space-x-6 absolute md:relative top-full left-0 right-0 bg-blue-900 bg-opacity-80 md:bg-transparent p-4 md:p-0`}>
                <a href="#playground" className="block py-2 md:py-0 hover:text-blue-300 transition duration-150 ease-in-out" onClick={() => setIsMenuOpen(false)}>Playground</a>
                <a href="#operators" className="block py-2 md:py-0 hover:text-blue-300 transition duration-150 ease-in-out" onClick={() => setIsMenuOpen(false)}>Operators</a>
                <a href="#tips" className="block py-2 md:py-0 hover:text-blue-300 transition duration-150 ease-in-out" onClick={() => setIsMenuOpen(false)}>Tips</a>
                <a href="#ethics" className="block py-2 md:py-0 hover:text-blue-300 transition duration-150 ease-in-out" onClick={() => setIsMenuOpen(false)}>Ethics</a>
              </div>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8 md:py-12">
          <section className="mb-12 md:mb-16 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Advanced Search Operator Guide</h1>
            <p className="text-lg md:text-xl text-blue-300">Master the art of refined searching with our interactive guide.</p>
          </section>

          <section id="playground" className="mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 flex items-center">
              <SearchIcon className="mr-2" />
              Search Operator Playground
            </h2>
            <div className="bg-blue-900 bg-opacity-80 rounded-lg shadow-xl p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="query" className="block text-sm font-medium mb-1">Search Query</label>
                  <input
                    type="text"
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your search query"
                  />
                </div>
                <div>
                  <label htmlFor="operator" className="block text-sm font-medium mb-1">Search Operator</label>
                  <select
                    id="operator"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">None</option>
                    <option value="site:">site:</option>
                    <option value="filetype:">filetype:</option>
                    <option value="intitle:">intitle:</option>
                    <option value="inurl:">inurl:</option>
                    <option value="related:">related:</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="operatorValue" className="block text-sm font-medium mb-1">Operator Value</label>
                  <input
                    type="text"
                    id="operatorValue"
                    value={operatorValue}
                    onChange={(e) => setOperatorValue(e.target.value)}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter operator value"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  Generate Search Query
                </button>
              </form>
              {generatedQuery && (
                <div className="mt-6 p-4 bg-blue-800 bg-opacity-80 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Generated Search Query:</h3>
                  <code className="block bg-blue-700 px-3 py-2 rounded text-sm mb-4 overflow-x-auto">{generatedQuery}</code>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(generatedQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
                  >
                    Perform Search
                    <ExternalLinkIcon className="ml-2 h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </section>

          <section id="operators" className="mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 flex items-center">
              <CodeIcon className="mr-2" />
              Popular Search Operators
            </h2>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {[
                { operator: 'site:', description: 'Limit results to a specific website' },
                { operator: 'filetype:', description: 'Find specific file types' },
                { operator: 'intitle:', description: 'Search for pages with specific words in the title' },
                { operator: 'inurl:', description: 'Find pages with specific words in the URL' },
                { operator: 'related:', description: 'Find sites related to a given domain' },
              ].map((item, index) => (
                <div key={index} className="bg-blue-900 bg-opacity-80 rounded-lg p-4 shadow-md">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{item.operator}</h3>
                  <p className="text-blue-300">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="tips" className="mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 flex items-center">
              <BookOpenIcon className="mr-2" />
              Search Tips
            </h2>
            <div className="bg-blue-900 bg-opacity-80 rounded-lg shadow-xl p-4 md:p-6">
              <ul className="space-y-4">
                {[
                  'Use quotation marks for exact phrase matching',
                  'Use OR to search for either of two terms',
                  'Use a minus sign to exclude words from your search',
                  'Use asterisks as wildcards in your search terms',
                  'Combine operators for more powerful searches',
                ].map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronDownIcon className="h-6 w-6 mr-2 text-blue-300 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="ethics" className="mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 flex items-center">
              <ShieldCheckIcon className="mr-2" />
              Ethical Considerations
            </h2>
            <div className="bg-blue-900 bg-opacity-80 rounded-lg shadow-xl p-4 md:p-6">
              <p className="mb-4">While search operators are powerful tools for finding information, it's important to use them responsibly and ethically. Here are some guidelines to keep in mind:</p>
              <ul className="space-y-2 list-disc list-inside text-blue-300">
                <li>Respect website terms of service and robots.txt files</li>
                <li>Avoid accessing or distributing sensitive or private information</li>
                <li>Use search operators for legitimate research and learning purposes only</li>
                <li>Be mindful of copyright and intellectual property rights</li>
                <li>When in doubt, seek permission before accessing or using information</li>
              </ul>
            </div>
          </section>
        </main>

        <footer className="bg-blue-900 bg-opacity-80 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h3 className="text-xl md:text-2xl font-semibold">SearchMaster</h3>
                <p className="mt-2 text-blue-300">Empowering your search experience</p>
              </div>
              <div className="mb-6 md:mb-0">
                <h4 className="text-lg font-semibold mb-2 text-center md:text-left">Quick Links</h4>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a href="#playground" className="text-blue-300 hover:text-white transition duration-150 ease-in-out">Playground</a>
                  <a href="#operators" className="text-blue-300 hover:text-white transition duration-150 ease-in-out">Operators</a>
                  <a href="#tips" className="text-blue-300 hover:text-white transition duration-150 ease-in-out">Tips</a>
                  <a href="#ethics" className="text-blue-300 hover:text-white transition duration-150 ease-in-out">Ethics</a>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-blue-300">&copy; 2024 SearchMaster. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
