import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 1. 브라우저/클라이언트용 (누구나 사용 가능)
export const supabaseBrowser = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// 2. 서버/관리자용 (API Route나 Server Action에서만 호출)
export const getSupabaseAdmin = () => {
  // 브라우저에서는 이 변수가 undefined이므로 실행 시점에 에러를 던져 보안을 지킵니다.
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseServiceKey || supabaseServiceKey === 'undefined') {
    throw new Error('⚠️ SUPABASE_SERVICE_ROLE_KEY가 없습니다. 이 함수는 서버 환경에서만 실행해야 합니다.')
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}