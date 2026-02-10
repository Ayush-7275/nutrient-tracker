'use client'
import { signin } from '../actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function Signin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    const res = await signin(formData)
    setLoading(false)
    
    if (res?.success) {
      toast.success('Welcome back!')
      router.push('/dashboard')
    } else {
      toast.error(res?.error || "Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Toaster position="bottom-center" />
      
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Enter your details to access your dashboard</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="student@college.edu" 
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              required 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Sign In <LogIn className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  )
}