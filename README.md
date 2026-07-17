# HANOL 관리자

한올 학원 **학생 관리**와 **수업 횟수 패키지**를 하나로 운영하는 Next.js 관리자 앱입니다.

## 핵심 규칙

- 월 납부 / 월별 등록금 계산을 **사용하지 않습니다**
- 기본 수업 패키지: **4회**
- 출석 1회 = 수업 1회 자동 소모
- 4/4 소진 시 **결제 필요** + 대시보드 **등록 안내**
- 학생 상세 진행률은 항상 `■■■□ 3 / 4` 형식

## 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- 로컬 JSON 스토어 (`.data/store.json`)

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 주요 경로

| 경로 | 설명 |
|------|------|
| `/` | 대시보드 · 등록 안내 |
| `/students` | 학생 목록 (검색·필터) |
| `/students/new` | 학생 등록 + 4회 패키지 발급 |
| `/students/[id]` | 학생 상세 · 출석 · 재등록 |
| `/settings` | 데모 데이터 초기화 |

## 검증

```bash
npm test
npm run lint
npm run build
```
