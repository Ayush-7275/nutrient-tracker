import Link from 'next/link'
import { ArrowRight, CheckCircle, Brain, Utensils } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white font-sans">
      
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <Utensils className="text-blue-400" /> NutriTracker<span className="text-blue-400">AI</span>
        </div>
        <div className="space-x-4">
          <Link href="/signin" className="hover:text-blue-300 transition-colors">Sign In</Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-full font-medium transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 mt-20 mb-32">
        <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Now powered by Gemini 2.5 Flash
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Your Personal AI Nutritionist.
        </h1>
        
        <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          Stop guessing what your body needs. Log your college meals and let our AI analyze your nutrient gaps instantly.
        </p>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/signup" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
            Start Tracking Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl text-left">
          <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Utensils className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Logging</h3>
            <p className="text-gray-400">Forget complex forms. Just type what you ate, and we handle the rest.</p>
          </div>
          <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
            <p className="text-gray-400">Our advanced AI scans your diet to find missing vitamins and proteins.</p>
          </div>
          <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-colors">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-green-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Actionable Tips</h3>
            <p className="text-gray-400">Get specific food recommendations to fix your energy levels.</p>
          </div>
        </div>
      </main>
    </div>
  )
}