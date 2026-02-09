# 🚀 빠른 시작 가이드

이 가이드는 프로젝트를 빠르게 실행하기 위한 최소 단계를 안내합니다.

## ⚡ 5분 안에 실행하기

### 1단계: Supabase 데이터베이스 설정 (2분)

1. https://app.supabase.com 접속 및 로그인
2. 프로젝트 선택: `pvvhikvgfaqlzckpkoel`
3. 좌측 **SQL Editor** 클릭
4. `supabase-setup.sql` 파일 내용 복사 → 붙여넣기 → **Run** 클릭
5. ✅ "Success. No rows returned" 메시지 확인

### 2단계: Storage 버킷 생성 (2분)

1. 좌측 **Storage** 클릭
2. **Create a new bucket** 버튼 클릭
3. 아래 3개 버킷을 생성 (각각 Public으로 설정):

   ```
   버킷 1: product-photos (Public ✅)
   버킷 2: store-signboards (Public ✅)
   버킷 3: transaction-docs (Public ✅)
   ```

### 3단계: 연결 테스트 (1분)

```bash
# Supabase 연결 확인
pnpm test:supabase
# 또는
npm run test:supabase
```

**기대 결과:**
```
✅ 모든 테스트 완료!
```

만약 에러가 발생하면:
- `.env.local` 파일의 Supabase URL과 키 확인
- 테이블이 생성되었는지 확인
- 버킷이 모두 생성되었는지 확인

### 4단계: 개발 서버 실행

```bash
pnpm dev
# 또는
npm run dev
```

브라우저에서 http://localhost:3000 열기

---

## 📝 첫 신청서 작성하기

1. **메인 페이지** (http://localhost:3000)
   - 모든 필드 입력
   - 사진 3종 업로드 (제품 진열, 마트 간판, 거래명세서)
   - "신청 완료하기" 클릭
   - ✅ "신청 완료" 메시지 확인

2. **Supabase에서 확인**
   - Dashboard > Table Editor > `applications`
   - 방금 생성한 데이터 확인

3. **관리자 페이지** (http://localhost:3000/admin)
   - 아이디: `admin`
   - 비밀번호: `$init0000!`
   - 신청서 목록 확인
   - 상세보기 클릭 → 사진 확인
   - 승인/거부 테스트

---

## 🔧 문제 해결

### "Failed to create application" 오류
→ `supabase-setup.sql`을 다시 실행하세요.

### "Failed to upload file" 오류
→ Storage 버킷 3개가 모두 생성되었는지 확인하세요.

### 환경 변수 오류
→ `.env.local` 파일을 확인하고 개발 서버를 재시작하세요.

---

## 📚 더 자세한 내용

- **전체 설정 가이드**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **프로젝트 구조**: [README.md](./README.md)

---

## ✅ 확인 체크리스트

설정이 완료되면 아래를 모두 확인하세요:

- [ ] Supabase 테이블 2개 생성됨 (applications, file_attachments)
- [ ] Storage 버킷 3개 생성됨 (모두 Public)
- [ ] `pnpm test:supabase` 테스트 통과
- [ ] 신청서 작성 성공
- [ ] 파일 업로드 성공
- [ ] 관리자 페이지 로그인 성공
- [ ] 사진 미리보기 작동
- [ ] Excel 다운로드 작동

---

🎉 **모두 완료되었나요? 축하합니다!**

이제 프로젝트를 자유롭게 커스터마이징하세요.
