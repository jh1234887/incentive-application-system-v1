import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 환경 변수 검증
if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL is not set. Using in-memory store for local development.')
}

if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Using in-memory store for local development.')
}

if (!supabaseServiceKey || supabaseServiceKey === 'undefined') {
  console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is not set. Database operations will fail.')
}

// Client for browser usage (with anon key)
export const supabaseBrowser = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Client for server/API routes (with service role key - full access)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
