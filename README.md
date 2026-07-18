# HANOL Manager — Sprint 1

현재 버전은 별도 데이터베이스 없이 브라우저 `localStorage`에 저장되는 실행 가능한 MVP입니다.

구현 기능:
- 대시보드
- 학생 등록/수정/삭제
- 학생 검색 및 상태 필터
- 출결 입력
- 출석 시 4회권 자동 차감
- 4회 완료 시 `등록 안내 필요` 자동 전환
- 수납 완료 처리 후 새 4회권 자동 시작
- 조건별 문자 대상 선택
- 문자 템플릿 미리보기
- 문자 발송 이력 저장(실제 SMS API 연동 전 단계)

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 폴더 구조

- `app/` — 대시보드, 학생, 출결, 수납, 문자 페이지
- `components/` — 공통 UI (사이드바, 폼, 상태 배지)
- `lib/` — 타입, localStorage, 출결/수납 로직, SMS 템플릿

## 비즈니스 규칙

1. 신규 학생은 `packageSize=4`, `usedCount=0`, `paymentStatus=normal` 로 등록됩니다.
2. **출석·보강** 기록 시 `usedCount`가 1 증가합니다. (결석은 미차감)
3. `usedCount >= packageSize` 이면 `paymentStatus`가 **due**(등록 안내 필요)로 바뀝니다.
4. **수납 완료** 처리 시 `usedCount=0`, `paymentStatus=normal`, `lastPaymentAt` 갱신으로 새 4회권이 시작됩니다.
5. 문자 발송은 API 연동 전 단계로, 대상·문구·이력을 localStorage에 저장합니다.

## 데이터

첫 방문 시 샘플 학생이 자동으로 채워집니다. 대시보드의 **샘플 데이터 초기화**로 다시 시작할 수 있습니다.
