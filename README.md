# HANOL 관리자

한올 학원 운영을 위한 Next.js 관리자 애플리케이션입니다.

## 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다. 기본 진입 경로는 `/students` 입니다.

## 학생 관리 모듈

- `/students` — 학생 목록, 검색·필터, 등록 진입
- `/students/[id]` — 학생 상세 (정보, 수업권, Quick Actions, 타임라인)

구성 요소는 `src/components/students` 에 위치합니다.
