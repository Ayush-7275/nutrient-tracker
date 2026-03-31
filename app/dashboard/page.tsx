'use client'
import { useState, useEffect } from 'react'
import { addMeal, getMeals, getNutrientAnalysis, deleteMeal, logout } from '../actions'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, LogOut, Utensils, Sparkles, Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const categories = ['morning', 'afternoon', 'night', 'other']

// ── Translation map ──────────────────────────────────────────────
const t: Record<string, { en: string; hi: string }> = {
  appName:       { en: 'NutriTracker',               hi: 'न्यूट्री ट्रैकर' },
  signOut:       { en: 'Sign Out',                   hi: 'साइन आउट' },
  noFood:        { en: 'No food logged',             hi: 'कोई खाना दर्ज नहीं' },
  addItem:       { en: 'Add Item',                   hi: 'आइटम जोड़ें' },
  analyzing:     { en: 'Analyzing your diet...',     hi: 'आपका आहार विश्लेषण हो रहा है...' },
  generateBtn:   { en: 'Generate Nutrient Analysis', hi: 'पोषण विश्लेषण करें' },
  aiTitle:       { en: 'AI Nutritionist Feedback',   hi: 'AI पोषण विशेषज्ञ की राय' },
  morning:       { en: 'Morning',                    hi: 'सुबह' },
  afternoon:     { en: 'Afternoon',                  hi: 'दोपहर' },
  night:         { en: 'Night',                      hi: 'रात' },
  other:         { en: 'Other',                      hi: 'अन्य' },
  promptPrefix:  { en: 'What did you eat for',       hi: 'आपने क्या खाया' },
  deleteConfirm: { en: 'Delete this meal?',          hi: 'क्या आप यह भोजन हटाना चाहते हैं?' },
  loggedOut:     { en: 'Logged out successfully',    hi: 'सफलतापूर्वक लॉग आउट हुए' },
  foodAdded:     { en: 'Food added!',                hi: 'खाना जोड़ा गया!' },
  addingFood:    { en: 'Adding food...',             hi: 'खाना जोड़ा जा रहा है...' },
  failedAdd:     { en: 'Failed to add food',         hi: 'खाना जोड़ने में विफल' },
  mealDeleted:   { en: 'Meal deleted',               hi: 'भोजन हटाया गया' },
  analysisOk:    { en: 'Analysis complete!',         hi: 'विश्लेषण पूर्ण!' },
}

type Lang = 'en' | 'hi'
// ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter()
  const [meals, setMeals] = useState<any[]>([])
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [lang, setLang] = useState<Lang>('en')          // ← language state

  // Helper: pick the right string
  const tx = (key: string) => t[key]?.[lang] ?? key

  useEffect(() => {
    refreshMeals()
  }, [])

  const refreshMeals = async () => {
    setLoading(true)
    const data = await getMeals()
    setMeals(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await logout()
    toast.success(tx('loggedOut'))
    router.push('/signin')
  }

  const handleAdd = async (category: string) => {
    const catLabel = tx(category)
    const food = prompt(`${tx('promptPrefix')} ${catLabel}?`)
    if (!food) return

    toast.promise(
      addMeal(category, food).then(() => refreshMeals()),
      {
        loading: tx('addingFood'),
        success: tx('foodAdded'),
        error:   tx('failedAdd'),
      }
    )
  }

  const handleDelete = async (id: number) => {
    if (!confirm(tx('deleteConfirm'))) return
    await deleteMeal(id)
    setMeals(meals.filter(m => m.id !== id))
    toast.success(tx('mealDeleted'))
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    // Tell Gemini which language to reply in
    const result = await getNutrientAnalysis(meals, lang)
    setAnalysis(result || 'Could not analyze.')
    setAnalyzing(false)
    toast.success(tx('analysisOk'))
  }

  const today = new Date().toLocaleDateString(
    lang === 'hi' ? 'hi-IN' : 'en-US',
    { weekday: 'long', month: 'long', day: 'numeric' }
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Toaster position="bottom-right" />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Utensils className="w-6 h-6" /> {tx('appName')}
            </h1>
            <p className="text-sm text-gray-500">{today}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* ── Language Toggle Button ── */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm transition-colors"
              title="Toggle language / भाषा बदलें"
            >
              {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" /> {tx('signOut')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Meal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {categories.map((cat) => (
            <div key={cat} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h2 className="text-lg font-bold capitalize text-blue-800">{tx(cat)}</h2>
              </div>

              <div className="p-4 flex-1 space-y-3 min-h-[200px]">
                {meals.filter(m => m.category === cat).length === 0 && (
                  <p className="text-gray-400 text-sm italic text-center py-4">{tx('noFood')}</p>
                )}

                {meals.filter(m => m.category === cat).map(m => (
                  <div key={m.id} className="group flex justify-between items-start bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 p-3 rounded-lg transition-all shadow-sm">
                    <span className="text-sm text-gray-700 leading-tight">{m.content}</span>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleAdd(cat)}
                className="w-full py-3 bg-gray-50 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-medium transition-colors border-t border-gray-100 flex justify-center items-center gap-2"
              >
                <Plus className="w-4 h-4" /> {tx('addItem')}
              </button>
            </div>
          ))}
        </div>

        {/* AI Section */}
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || meals.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl text-lg font-bold hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
          >
            {analyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {tx('analyzing')}</>
            ) : (
              <><Sparkles className="w-5 h-5" /> {tx('generateBtn')}</>
            )}
          </button>

          {analysis && (
            <div className="mt-8 bg-white border border-purple-100 rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-purple-900">{tx('aiTitle')}</h3>
              </div>
              <div className="p-8 prose prose-purple max-w-none">
                <p className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
                  {analysis}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}