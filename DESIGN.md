# Bloom & Bond — Design System

Cherry Blossom Edition

## Brand

- **Name:** Bloom & Bond
- **Tone:** 따뜻하고 비판단적. "당신은 이런 사람"이 아니라 "이런 반응이 올라올 수 있어요"
- **Language:** 한국어 (ko-KR)
- **Favicon:** 🌸 SVG emoji

## Colors

CSS 커스텀 프로퍼티 (`src/index.css`)로 정의, JS에서는 `src/lib/theme.js` 객체로 참조.

### Background Gradient

| Token        | Value   | Usage                    |
| ------------ | ------- | ------------------------ |
| `--bg-top`   | #fef3f9 | 페이지 그라데이션 상단   |
| `--bg-mid`   | #f8e5f0 | 페이지 그라데이션 중간   |
| `--bg-bottom` | #f3dce8 | 페이지 그라데이션 하단  |

배경에 `blossom.webp` 이미지를 `cover`로 깔고, 위에 반투명 그라데이션을 overlay.

### Text

| Token         | Value   | Usage              |
| ------------- | ------- | ------------------ |
| `--text`      | #26131f | 기본 텍스트        |
| `--text-soft` | #6c445a | 보조 텍스트, 설명  |
| `--text-tint` | #d24f95 | 강조 레이블, 섹션 마커 |

### Primary

| Token              | Value   | Usage                |
| ------------------ | ------- | -------------------- |
| `--primary`        | #ff82be | 기본 프라이머리      |
| `--primary-strong` | #ff62af | CTA 버튼, 강조      |
| `--primary-contrast` | #2f1022 | 프라이머리 위 텍스트 |
| `--primary-edge`   | #eb4a9d | 프라이머리 보더      |

### Secondary & Panel

| Token              | Value   | Usage                     |
| ------------------ | ------- | ------------------------- |
| `--secondary`      | #ffd7ea | Hero, 큰 섹션 배경        |
| `--secondary-strong` | #ffc2df | 프로그레스바 그라데이션 끝 |
| `--panel`          | #fff4fa | 카드 기본 배경            |
| `--panel-strong`   | #fff9fd | 입력 필드, 프로그레스바 트랙 |
| `--panel-soft`     | #ffedf6 | 연습가이드 예시 배경      |
| `--panel-deep`     | #ffe5f1 | 카드 주 배경              |
| `--panel-highlight` | #ffd6e8 | 선택된 항목, 강조 배경    |
| `--line`           | #efbfd8 | 보더, 구분선              |

## Typography

- **Primary:** Jua (Google Fonts, display)
- **Fallback:** Pretendard, sans-serif
- **Title class:** `.font-title` — Jua + `letter-spacing: -0.03em`
- **Weights:** 400(본문), 600(버튼), 700(강조), 900(대제목)
- **Button default:** `font-weight: 600`

## Spacing

| Context       | Mobile  | Desktop (sm:) |
| ------------- | ------- | ------------- |
| 섹션 간 갭    | gap-3   | gap-6         |
| 카드 내부     | px-4 py-3~5 | px-5~8 py-4~6 |
| 페이지 패딩   | px-4 pt-3 pb-3 | px-6 pt-8 pb-8 |

## Border Radius

현재 7종 사용 중. 통일 권장 스케일:

| Scale | 값          | 용도                              |
| ----- | ----------- | --------------------------------- |
| sm    | rounded-[20px] | 버튼, 질문 카드, 작은 요소       |
| md    | rounded-[28px] | 일반 카드, 중간 섹션             |
| lg    | rounded-[36px] | Hero, 대형 섹션 (sm: 이상)       |

## Components

### PrimaryActionButton

- `min-height: 44px` (터치 타겟 기준)
- `rounded-[20px]`
- 배경: `--primary-strong`, disabled 시 `--panel-highlight` + `opacity: 0.55`
- 텍스트: `--primary-contrast`
- 보더: `--primary-edge`
- 화살표 `→` 아이콘 포함

### Shell (레이아웃)

- `max-width: 1400px`, 중앙 정렬
- XL에서 3-column grid: `180px / content(max ~960px) / 180px`
- 푸터: "Bloom & Bond by hoosa" + 의견 보내기 링크

### Card Pattern

- `Card.Header`: 레이블(uppercase, text-tint) → 타이틀(font-title, bold) → 설명(text-soft)
- 배경: `--panel-deep`
- 보더: `--line`
- 내부 아이템 배경: `--panel-highlight`

### ResultMeter

- 프로그레스바 with 라벨 + 값
- 트랙: `--panel-strong`
- 필: `--primary-strong`
- `h-2.5` 바 높이

### Modal

- 포커스 트랩 + ESC 닫기 + `role="dialog"` + `aria-modal`
- 열림 시 첫 focusable 요소에 자동 포커스
- 닫힘 시 트리거 요소에 포커스 복원
- backdrop: `rgba(0,0,0,0.7)`

## Interaction Patterns

- **선택 표시:** `box-shadow: inset 0 0 0 2px var(--primary-strong)`
- **Toast:** HeroUI `Toast.Provider`, bottom 배치
- **스크롤:** 모바일 `scrollIntoView`, 데스크톱 `scrollTo({ top: 0 })`
- **브리지 전환:** MBTI→애착 스텝 전환 시 브리지 화면 (animate-reveal)
- **결과 공개:** 1.8초 딜레이 + 페이드인 (탭 시 스킵 가능)

## Responsive Breakpoints

| Viewport | Breakpoint | 특징 |
| -------- | ---------- | ---- |
| Mobile   | < 640px    | 기본 디자인, sticky 진행바/footer |
| Desktop  | ≥ 640px    | `sm:` 프리픽스, 여유로운 패딩 |
| XL       | ≥ 1280px   | `xl:` 3-column 그리드 |

## Accessibility

- RadioGroup: `aria-label` 바인딩
- 모달: 포커스 트랩, ESC 닫기, `aria-modal`, 포커스 복원
- 장식 요소: `aria-hidden="true"`
- PrimaryActionButton: `aria-disabled` + `disabled` 속성
- 최소 터치 타겟: 44px (`min-h-[44px]`)
