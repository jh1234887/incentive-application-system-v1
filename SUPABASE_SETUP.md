# Supabase 설정 가이드

이 가이드를 따라 Supabase 프로젝트를 완벽하게 설정하세요.

## 📋 설정 단계

### 1️⃣ 데이터베이스 테이블 생성

1. Supabase Dashboard에 로그인: https://app.supabase.com
2. 프로젝트 선택: `pvvhikvgfaqlzckpkoel`
3. 좌측 메뉴에서 **SQL Editor** 클릭
4. `supabase-setup.sql` 파일의 내용을 복사
5. SQL Editor에 붙여넣기
6. **Run** 버튼 클릭

#### 확인 방법
- **Table Editor** 메뉴에서 `applications`와 `file_attachments` 테이블이 생성되었는지 확인
- 테이블 구조가 올바른지 확인:
  - `applications`: 12개 컬럼 (id, agency_name, manager_name, ...)
  - `file_attachments`: 7개 컬럼 (id, application_id, file_category, ...)

---

### 2️⃣ Storage 버킷 생성

Storage에서 파일을 저장할 버킷 3개를 생성해야 합니다.

#### 버킷 생성 단계:

1. Supabase Dashboard에서 **Storage** 메뉴 클릭
2. **Create a new bucket** 버튼 클릭
3. 아래 3개의 버킷을 각각 생성:

**버킷 1: product-photos**
- Name: `product-photos`
- Public bucket: ✅ **체크** (공개 버킷)
- File size limit: `10 MB` (선택사항)
- Allowed MIME types: `image/*` (선택사항)

**버킷 2: store-signboards**
- Name: `store-signboards`
- Public bucket: ✅ **체크** (공개 버킷)
- File size limit: `10 MB` (선택사항)
- Allowed MIME types: `image/*` (선택사항)

**버킷 3: transaction-docs**
- Name: `transaction-docs`
- Public bucket: ✅ **체크** (공개 버킷)
- File size limit: `10 MB` (선택사항)
- Allowed MIME types: `image/*,application/pdf` (선택사항)

#### 확인 방법
- Storage 메뉴에서 3개의 버킷이 모두 표시되는지 확인
- 각 버킷 이름이 정확한지 확인 (하이픈 포함)

---

### 3️⃣ Storage 정책 설정 (옵션 - 자동 설정됨)

Public 버킷으로 생성하면 자동으로 정책이 설정됩니다. 만약 수동 설정이 필요하면:

1. Storage > Policies 탭 이동
2. 각 버킷에 대해 다음 정책 추가:

```sql
-- 모든 사용자가 파일 업로드 가능
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-photos');

-- 모든 사용자가 파일 읽기 가능
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-photos');

-- 모든 사용자가 파일 삭제 가능 (관리자용)
CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'product-photos');
```

**참고**: `store-signboards`, `transaction-docs` 버킷에도 같은 정책을 적용하되, `bucket_id` 값만 변경하세요.

---

### 4️⃣ 환경 변수 확인

`.env.local` 파일에 올바른 값이 설정되어 있는지 확인:

```env
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://pvvhikvgfaqlzckpkoel.supabase.co

# Supabase Anon Key (브라우저에서 사용)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Service Role Key (서버에서만 사용 - 절대 클라이언트 노출 금지!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### 키 확인 방법:
1. Supabase Dashboard > **Settings** > **API**
2. **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 복사
3. **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사
4. **service_role**: `SUPABASE_SERVICE_ROLE_KEY`에 복사 (Show 버튼 클릭)

---

### 5️⃣ 테스트

설정이 완료되면 아래 명령으로 애플리케이션을 실행하고 테스트하세요:

```bash
# 개발 서버 실행
pnpm dev

# 또는
npm run dev
```

#### 테스트 시나리오:

1. **신청서 작성 테스트**
   - http://localhost:3000 접속
   - 모든 필드 입력 (대리점명, 담당자명 등)
   - 파일 업로드 (사진 3종)
   - "신청 완료하기" 버튼 클릭
   - ✅ "신청 완료" 메시지 확인

2. **데이터베이스 확인**
   - Supabase Dashboard > Table Editor > `applications`
   - 방금 생성한 신청서 데이터 확인
   - `file_attachments` 테이블에서 파일 정보 확인

3. **Storage 확인**
   - Storage > 각 버킷 클릭
   - 업로드된 파일들이 표시되는지 확인
   - 파일 클릭 시 미리보기 가능

4. **관리자 페이지 테스트**
   - http://localhost:3000/admin 접속
   - 로그인: `admin` / `$init0000!`
   - 신청서 목록 확인
   - 상세보기 클릭 → 파일 미리보기 확인
   - 승인/거부 기능 테스트
   - Excel 다운로드 테스트

---

## 🔍 문제 해결

### 문제 1: "Failed to create application" 오류
**원인**: 데이터베이스 테이블이 생성되지 않음
**해결**: `supabase-setup.sql` 재실행

### 문제 2: "Failed to upload file" 오류
**원인**: Storage 버킷이 생성되지 않았거나 이름이 다름
**해결**: Storage 메뉴에서 3개 버킷 생성 및 이름 확인

### 문제 3: 파일이 업로드되지만 미리보기가 안 됨
**원인**: 버킷이 Private으로 설정됨
**해결**: 각 버킷 설정에서 "Public bucket" 활성화

### 문제 4: 환경 변수 오류
**원인**: `.env.local` 파일이 잘못되었거나 서버 재시작 필요
**해결**:
1. `.env.local` 파일의 키 값 재확인
2. 개발 서버 재시작 (`Ctrl+C` 후 `pnpm dev`)

---

## 📊 데이터 확인 쿼리

Supabase SQL Editor에서 실행 가능한 유용한 쿼리:

```sql
-- 전체 신청서 조회
SELECT
  id,
  agency_name,
  store_name,
  status,
  incentive_amount,
  created_at
FROM applications
ORDER BY created_at DESC
LIMIT 10;

-- 대리점별 통계
SELECT
  agency_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  SUM(incentive_amount) FILTER (WHERE status = 'approved') as total_amount
FROM applications
GROUP BY agency_name
ORDER BY total_count DESC;

-- 파일 첨부 현황
SELECT
  a.id,
  a.store_name,
  COUNT(f.id) as file_count,
  STRING_AGG(f.file_category, ', ') as categories
FROM applications a
LEFT JOIN file_attachments f ON f.application_id = a.id
GROUP BY a.id, a.store_name
ORDER BY a.created_at DESC;

-- 최근 7일간 신청 건수
SELECT
  DATE(created_at) as date,
  COUNT(*) as count,
  SUM(incentive_amount) FILTER (WHERE status = 'approved') as total_incentive
FROM applications
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## ✅ 체크리스트

설정 완료 후 아래 항목을 확인하세요:

- [ ] `applications` 테이블 생성 완료
- [ ] `file_attachments` 테이블 생성 완료
- [ ] `product-photos` 버킷 생성 (Public)
- [ ] `store-signboards` 버킷 생성 (Public)
- [ ] `transaction-docs` 버킷 생성 (Public)
- [ ] `.env.local` 환경 변수 설정 완료
- [ ] 신청서 작성 테스트 성공
- [ ] 파일 업로드 테스트 성공
- [ ] 관리자 페이지 접속 성공
- [ ] Excel 다운로드 테스트 성공

---

## 🚀 프로덕션 배포 시 주의사항

1. **환경 변수 보안**
   - `.env.local` 파일은 절대 Git에 커밋하지 마세요
   - 배포 플랫폼(Vercel, Netlify 등)의 환경 변수 설정 사용
   - `SUPABASE_SERVICE_ROLE_KEY`는 서버 측에만 설정

2. **RLS 정책 강화** (필요시)
   - 현재는 모든 작업 허용으로 설정됨
   - 프로덕션에서는 더 엄격한 정책 고려

3. **백업 설정**
   - Supabase Dashboard > Settings > Database > Backups
   - 자동 백업 활성화 권장

4. **모니터링**
   - Supabase Dashboard > Logs 메뉴에서 오류 확인
   - API 사용량 및 Storage 용량 모니터링
