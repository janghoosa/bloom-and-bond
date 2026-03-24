# TODOS

## Active

### 6. Framer Motion 질문 카드 전환 애니메이션
- `AnimatePresence` slide+fade로 1문제씩 넘기는 UX
- 1문제씩 UX 완료 후 + 스레드 반응 확인 후 진행
- Priority: P2 / Effort: S (CC ~15분)
- Depends on: 1문제씩 UX 완료

## Completed

### 1. ~~Hero 아래 간단 공유 CTA 추가~~ ✅
- `QuickShareBar` 컴포넌트 추가 (`ResultPage.jsx`)
- ResultHero 바로 아래에 "카드 만들기 / 링크 복사" 버튼 배치

### 2. ~~result 빈 상태 전용 안내 페이지~~ ✅
- `EmptyResultPage` 컴포넌트 추가 (`common.jsx`)
- 잘못된 감정코드로 접속 시 "이 결과를 볼 수 없어요" + "나도 검사해보기" CTA 표시

### 3. ~~모달 접근성 전체 수정~~ ✅
- 공통 `Modal` 컴포넌트 추출 (`common.jsx`)
- 포커스 트랩 + ESC 닫기 + `role="dialog"` + `aria-modal` + 포커스 복원
- ResultPage, ComparePage 모달을 Modal 컴포넌트로 교체

### 4. ~~DESIGN.md 생성~~ ✅
- 색상/폰트/간격/라운드니스/컴포넌트/인터랙션/반응형/접근성 문서화
- border-radius 3종 통일 스케일 권장

### 5. ~~MBTI→애착 전환 브리지 + 결과 공개 연출~~ ✅
- `BridgeScreen` + `RevealScreen` 컴포넌트 추가
- CSS @keyframes 애니메이션 (reveal-fade-in, reveal-title-in)
