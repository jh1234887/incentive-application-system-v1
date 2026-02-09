#!/usr/bin/env node
/**
 * Supabase 연결 테스트 스크립트
 *
 * 사용법:
 * node test-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// .env.local 로드
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Supabase 연결 테스트 시작...\n')

// 1. 환경 변수 확인
console.log('1️⃣ 환경 변수 확인:')
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ 설정됨' : '❌ 없음'}`)
console.log(`   SUPABASE_KEY: ${supabaseKey ? '✅ 설정됨' : '❌ 없음'}\n`)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.')
  console.log('\n📝 해결 방법:')
  console.log('   1. .env.local 파일이 존재하는지 확인')
  console.log('   2. NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY가 설정되었는지 확인')
  console.log('   3. Supabase Dashboard에서 올바른 값을 복사했는지 확인\n')
  process.exit(1)
}

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 2. 데이터베이스 연결 테스트
console.log('2️⃣ 데이터베이스 연결 테스트:')
try {
  const { data, error } = await supabase
    .from('applications')
    .select('count')
    .limit(1)

  if (error) {
    console.error('   ❌ 연결 실패:', error.message)
    console.log('\n📝 해결 방법:')
    console.log('   1. Supabase Dashboard에서 SQL Editor 열기')
    console.log('   2. supabase-setup.sql 파일 실행')
    console.log('   3. applications 테이블이 생성되었는지 확인\n')
    process.exit(1)
  }

  console.log('   ✅ 데이터베이스 연결 성공\n')
} catch (err) {
  console.error('   ❌ 연결 오류:', err.message, '\n')
  process.exit(1)
}

// 3. 테이블 구조 확인
console.log('3️⃣ 테이블 구조 확인:')
try {
  const { data: apps, error: appsError } = await supabase
    .from('applications')
    .select('*')
    .limit(1)

  const { data: files, error: filesError } = await supabase
    .from('file_attachments')
    .select('*')
    .limit(1)

  if (appsError) {
    console.error('   ❌ applications 테이블 조회 실패:', appsError.message)
  } else {
    console.log('   ✅ applications 테이블 존재')
  }

  if (filesError) {
    console.error('   ❌ file_attachments 테이블 조회 실패:', filesError.message)
  } else {
    console.log('   ✅ file_attachments 테이블 존재')
  }

  console.log()
} catch (err) {
  console.error('   ❌ 테이블 조회 오류:', err.message, '\n')
}

// 4. Storage 버킷 확인
console.log('4️⃣ Storage 버킷 확인:')
try {
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets()

  if (bucketsError) {
    console.error('   ❌ Storage 조회 실패:', bucketsError.message)
  } else {
    const requiredBuckets = ['product-photos', 'store-signboards', 'transaction-docs']
    const existingBucketNames = buckets.map(b => b.name)

    requiredBuckets.forEach(bucketName => {
      if (existingBucketNames.includes(bucketName)) {
        const bucket = buckets.find(b => b.name === bucketName)
        console.log(`   ✅ ${bucketName} (${bucket.public ? 'Public' : 'Private'})`)
      } else {
        console.log(`   ❌ ${bucketName} (없음)`)
      }
    })

    console.log()

    const missingBuckets = requiredBuckets.filter(b => !existingBucketNames.includes(b))
    if (missingBuckets.length > 0) {
      console.log('📝 생성 필요한 버킷:')
      missingBuckets.forEach(name => {
        console.log(`   - ${name}`)
      })
      console.log('\n   Supabase Dashboard > Storage에서 버킷을 생성하세요.\n')
    }
  }
} catch (err) {
  console.error('   ❌ Storage 조회 오류:', err.message, '\n')
}

// 5. 데이터 통계 (있을 경우)
console.log('5️⃣ 데이터 통계:')
try {
  const { count: totalCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })

  const { count: pendingCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: approvedCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  console.log(`   전체 신청서: ${totalCount}건`)
  console.log(`   대기 중: ${pendingCount}건`)
  console.log(`   승인: ${approvedCount}건\n`)
} catch (err) {
  console.error('   ❌ 통계 조회 오류:', err.message, '\n')
}

console.log('✅ 모든 테스트 완료!\n')
console.log('🚀 다음 단계:')
console.log('   1. pnpm dev (또는 npm run dev)로 개발 서버 실행')
console.log('   2. http://localhost:3000에서 신청서 작성 테스트')
console.log('   3. http://localhost:3000/admin에서 관리자 페이지 확인\n')
