'use server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!); // Use Google Client
const secret = new TextEncoder().encode(process.env.JWT_SECRET)

// --- AUTH HELPERS ---
async function getSession() {
  const token = (await cookies()).get('token')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: number }
  } catch (e) { return null }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = await bcrypt.hash(formData.get('password') as string, 10)
  
  try {
    await prisma.user.create({ data: { email, password } })
    return { success: true }
  } catch (e) { return { error: "User already exists" } }
}

export async function signin(formData: FormData) {
  const email = formData.get('email') as string
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user || !(await bcrypt.compare(formData.get('password') as string, user.password))) {
    return { error: "Invalid credentials" }
  }

  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
  
  ;(await cookies()).set('token', token, { httpOnly: true })
  return { success: true }
}

// --- APP LOGIC ---
export async function addMeal(category: string, food: string) {
  const session = await getSession()
  if (!session) return
  await prisma.meal.create({
    data: { content: food, category, userId: session.userId }
  })
}

export async function getMeals() {
  const session = await getSession()
  if (!session) return []
  // Get meals only for today
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  return await prisma.meal.findMany({
    where: { userId: session.userId, createdAt: { gte: startOfDay } }
  })
}

export async function getNutrientAnalysis(meals: any[]) {
  // USE THIS EXACT STRING:
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Based on these meals eaten today, what nutrients is the user lacking? 
    Be concise (max 3 sentences).
    Meals: ${JSON.stringify(meals)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "AI analysis failed. Please try again.";
  }
}

export async function logout() {
  (await cookies()).delete('token')
  return { success: true }
}

export async function deleteMeal(id: number) {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }
  
  await prisma.meal.deleteMany({
    where: { id, userId: session.userId } // Ensure user owns the meal
  })
  return { success: true }
}