'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Brain, Utensils } from 'lucide-react'

type Lang = 'en' | 'hi'

const t = {
  tagline:     { en: 'Now powered by Gemini 2.5 Flash', hi: 'अब Gemini 2.5 Flash द्वारा संचालित' },
  heading:     { en: 'Your Personal AI Nutritionist.',  hi: 'आपका व्यक्तिगत AI पोषण विशेषज्ञ.' },
  subheading:  { en: 'Stop guessing what your body needs. Log your college meals and let our AI analyze your nutrient gaps instantly.',
                 hi: 'अनुमान लगाना बंद करें। अपने भोजन को लॉग करें और हमारा AI आपकी पोषण कमियों का तुरंत विश्लेषण करेगा।' },
  cta:         { en: 'Start Tracking Free',             hi: 'मुफ्त में शुरू करें' },
  signIn:      { en: 'Sign In',                         hi: 'साइन इन' },
  getStarted:  { en: 'Get Started',                     hi: 'शुरू करें' },
  f1title:     { en: 'Easy Logging',                    hi: 'आसान लॉगिंग' },
  f1desc:      { en: 'Forget complex forms. Just type what you ate, and we handle the rest.',
                 hi: 'जटिल फॉर्म भूल जाएं। बस टाइप करें क्या खाया, बाकी हम संभालेंगे।' },
  f2title:     { en: 'AI Analysis',                     hi: 'AI विश्लेषण' },
  f2desc:      { en: 'Our advanced AI scans your diet to find missing vitamins and proteins.',
                 hi: 'हमारा AI आपके आहार को स्कैन करके विटामिन और प्रोटीन की कमी खोजता है।' },
  f3title:     { en: 'Actionable Tips',                 hi: 'उपयोगी सुझाव' },
  f3desc:      { en: 'Get specific food recommendations to fix your energy levels.',
                 hi: 'अपनी ऊर्जा बढ़ाने के लिए विशेष खाद्य सुझाव पाएं।' },
}

export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
  const tx = (key: string) => t[key as keyof typeof t]?.[lang] ?? key

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white font-sans">

      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <Utensils className="text-blue-400" /> NutriTracker<span className="text-blue-400">AI</span>
        </div>

        <div className="flex items-center gap-3">
          {/* ── Language Toggle Button ── */}
          <button
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-600 bg-gray-800/60 hover:bg-gray-700/80 text-gray-200 font-medium text-sm transition-all"
            title="Toggle language / भाषा बदलें"
          >
            {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </button>

          <Link href="/signin" className="hover:text-blue-300 transition-colors">
            {tx('signIn')}
          </Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-full font-medium transition-all">
            {tx('getStarted')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 mt-20 mb-32">
        <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          {tx('tagline')}
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          {tx('heading')}
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          {tx('subheading')}
        </p>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/signup" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
            {tx('cta')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl text-left">
          <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Utensils className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">{tx('f1title')}</h3>
            <p className="text-gray-400">{tx('f1desc')}</p>
          </div>
          <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">{tx('f2title')}</h3>
            <p className="text-gray-400">{tx('f2desc')}</p>
          </div>
          <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-colors">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-green-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">{tx('f3title')}</h3>
            <p className="text-gray-400">{tx('f3desc')}</p>
          </div>
        </div>
      </main>
    </div>
  )
}