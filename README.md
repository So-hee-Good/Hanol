# HANOL 관리자

한올 학원용 **단일 Next.js 프로그램**입니다.  
학생 관리 · 출결 · 수납 · 수업 횟수 패키지가 같은 앱, 같은 데이터 스토어에서 동작합니다.

```bash
npm install
npm run dev
```

→ [http://localhost:3000](http://localhost:3000) 하나에서 전부 사용합니다. 별도 백엔드/DB 프로세스는 없습니다.

## 동작 규칙

- 월 납부 / 월별 등록금 계산 **없음**
- 기본 수업 패키지 **4회**
- 출석 1회 = 수업 1회 자동 소모
- 4/4 → **결제 필요** + 대시보드/수납 **등록 안내**
- 학생 상세 진행률: `■■■□ 3 / 4`

## 화면

| 경로 | 역할 |
|------|------|
| `/` | 대시보드 · 등록 안내 |
| `/students` | 학생 목록 · 검색/필터 |
| `/students/new` | 학생 등록 (+ 4회 패키지) |
| `/students/[id]` | 상세 · 출석 · 재등록 · 타임라인 |
| `/attendance` | 출결 처리 (같은 패키지 소모) |
| `/payments` | 수납 · 4회 패키지 재등록 |
| `/settings` | 데모 데이터 초기화 |

## 데이터

- 저장: `.data/store.json` (자동 생성, gitignore)
- 변경: Server Actions (`src/app/actions.ts`)
- 초기화: 설정 화면 또는 `.data/` 삭제

## 검증

```bash
npm test
npm run lint
npm run build
```
