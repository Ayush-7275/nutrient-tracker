'use client'
import { useState, useEffect } from 'react'
import { addMeal, getMeals, getNutrientAnalysis, deleteMeal, logout } from '../actions'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, LogOut, Utensils, Sparkles, Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const categories = ['morning', 'afternoon', 'night', 'other']

export default function Dashboard() {
  const router = useRouter()
  const [meals, setMeals] = useState<any[]>([])
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

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
    toast.success('Logged out successfully')
    router.push('/signin')
  }

  const handleAdd = async (category: string) => {
    const food = prompt(`What did you eat for ${category}?`)
    if (!food) return
    
    // Optimistic update (feels faster)
    toast.promise(
      addMeal(category, food).then(() => refreshMeals()),
      {
        loading: 'Adding food...',
        success: 'Food added!',
        error: 'Failed to add food',
      }
    )
  }

  const handleDelete = async (id: number) => {
    if(!confirm("Delete this meal?")) return
    
    await deleteMeal(id)
    setMeals(meals.filter(m => m.id !== id)) // Remove immediately from UI
    toast.success('Meal deleted')
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    const result = await getNutrientAnalysis(meals)
    setAnalysis(result || "Could not analyze.")
    setAnalyzing(false)
    toast.success('Analysis complete!')
  }

  // Get today's date formatted
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Toaster position="bottom-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Utensils className="w-6 h-6" /> NutriTracker
            </h1>
            <p className="text-sm text-gray-500">{today}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Meal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {categories.map((cat) => (
            <div key={cat} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h2 className="text-lg font-bold capitalize text-blue-800">{cat}</h2>
              </div>
              
              <div className="p-4 flex-1 space-y-3 min-h-[200px]">
                {meals.filter(m => m.category === cat).length === 0 && (
                  <p className="text-gray-400 text-sm italic text-center py-4">No food logged</p>
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
                <Plus className="w-4 h-4" /> Add Item
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
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your diet...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate Nutrient Analysis</>
            )}
          </button>

          {analysis && (
            <div className="mt-8 bg-white border border-purple-100 rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-purple-900">AI Nutritionist Feedback</h3>
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