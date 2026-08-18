# Project 섹션 추가 — 설계 문서

날짜: 2026-08-19

## 배경 / 목적

현재 사이트 내비게이션은 Home / Blog / Research 세 축이다. Blog는 기술 학습 기록, Research는
대학원 학술 연구(`src/content/research`)를 다루며, 개인 사이드 프로젝트는 Home의
`featuredRepos`(`src/data/profile.ts`)에 GitHub 링크로만 노출되어 있고 깊이 있는 소개가 없다.

주요 개인 프로젝트(특히 FinanceManage_Agent-Project)는 각 레포 안에 이미 트러블슈팅 문서를
작성해두었지만, 사이트 방문자가 그 내용을 볼 방법이 없다. 이 문서는 새 **Project** 섹션을 추가해
레포의 트러블슈팅 콘텐츠를 사이트에 이식하는 설계를 정리한다.

## 범위

- 신설: `project` 콘텐츠 콜렉션, `/project` 목록·상세 페이지, 상단 내비게이션 `Project` 항목
- 콘텐츠 2건을 지금 함께 스캐폴딩:
  - **FinanceManage_Agent-Project** — Overview + 트러블슈팅 3건 전체 이식 (핵심 우선순위)
  - **Claude_Context_Kit-Plugin** — Overview만 우선 작성, 트러블슈팅은 "작성 예정"으로 비워둠
    (레포에 아직 트러블슈팅 소스 문서가 없음)
- Home의 `featuredRepos` 중 위 두 항목의 링크를 GitHub 외부 링크 → `/project/<slug>/` 내부 링크로 변경

### 비범위 (Out of scope)

- MSA_Cascading_Failure_Mitigation-Research는 이미 Research 섹션에 있으므로 Project에 중복 추가하지 않는다.
- Claude_Context_Kit-Plugin의 트러블슈팅 콘텐츠 작성 (소스 문서가 레포에 없어 후속 작업으로 남김).
- 레포 쪽 트러블슈팅 원본 문서의 수정 (사이트는 이식본을 별도로 가짐 — 원본은 그대로 source of truth 역할 유지하되, 이번 결정으로 사이트와 레포 두 곳의 사본을 각각 유지보수한다는 트레이드오프를 감수한다).

## 콘텐츠 콜렉션 설계

`src/content.config.ts`에 Research와 동일한 패턴으로 `project` 콜렉션을 추가한다.

```ts
const project = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/project' }),
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      period: z.string(),
      stack: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      repo: z.string().url().optional(),
      order: z.number().default(0),
    }),
});
```

Research의 `status`(in-progress/completed/planned)는 사이드 프로젝트 성격과 맞지 않아 제외했고,
대신 기술스택을 목록 카드에 바로 보여줄 `stack` 필드를 추가했다.

폴더 구조 (Blog·Research와 동일하게 폴더당 글 하나):

```text
src/content/project/
├── finance-manage-agent/index.md
└── claude-context-kit/index.md
```

## 페이지 설계

Research projects 패턴을 그대로 재사용한다.

- `src/pages/project/index.astro` — 카드 목록 (title, summary, stack, tags), `order` 오름차순 정렬
  (`src/pages/research/projects/index.astro` 참고)
- `src/pages/project/[...slug].astro` — 상세 페이지, 마크다운 본문 렌더 (`src/pages/research/projects/[...slug].astro` 참고)

## 내비게이션

`src/components/Header.astro`의 `navItems`에 순서대로 추가:

```
Home / Blog / Research / Project
```

## 콘텐츠별 상세 매핑

### FinanceManage_Agent-Project (`order: 1`)

원본: `/Users/inbeom/IdeaProjects/FinanceManage_Agent-Project/`

- Frontmatter
  - `title`: 'FinanceManage_Agent — AI 주식 자동매매 시스템'
  - `summary`: `profile.ts`의 기존 문구 재사용
  - `period`: `'2026.01 ~ 진행 중'` (첫 커밋 2026.01, 최신 커밋 2026.08 기준)
  - `stack`: README·CLAUDE.md 기준 (Spring Boot, FastAPI, Vue 3, PostgreSQL/TimescaleDB, Kafka, Redis 등)
  - `repo`: `https://github.com/Lib0823/FinanceManage_Agent-Project`
  - `order`: 1
- `## Overview` — 루트 `README.md`의 "왜 만들었나(Motivation)" · "시스템 한눈에 보기" ·
  "분석 프로세스" 섹션을 요약 재구성. Quick Start·Roadmap 섹션은 포트폴리오 성격상 제외한다.
- `## Troubleshooting` — `_docs/Troubleshooting/`의 3개 문서를 순서대로 이식:
  1. `1.timescaledb-migration.md` → `### 1. 시계열 데이터 TimescaleDB 마이그레이션`
  2. `2.messagequeue-kafka-adoption.md` → `### 2. 매매 실행 신뢰성 개선: Kafka 메시지 큐 도입`
  3. `3.redis-ratelimit-cache-adoption.md` → `### 3. 외부 API 의존성 격리: Redis 기반 Rate Limit·캐싱 도입`

  각 항목은 원문의 흐름(문제 → 대안 검토 → 핵심 구현 → 검증/결과 → 향후 과제)을 그대로 유지한다.
  원문의 `##` 헤딩은 사이트에서 `####`로 한 단계 낮춰 상세 페이지의 헤딩 위계(`##
  Troubleshooting` > `### N. ...` > `#### 문제` 등)를 맞춘다. 내용은 요약이 아니라 거의 그대로
  이식하고(선택된 "전체 재작성/이식" 방식), 파일 경로 표기 등 레포 내부 전용 표현만 사이트 톤에
  맞게 다듬는다.

### Claude_Context_Kit-Plugin (`order: 2`)

원본: `/Users/inbeom/VSCode/Claude_Context_Kit/Claude_Context_Kit-Plugin/`

- Frontmatter
  - `title`: 'Claude Context Kit — DevKit Marketplace'
  - `summary`: `profile.ts`의 기존 문구 재사용
  - `period`: `'2026.07 ~ 진행 중'`
  - `stack`: README 기준
  - `repo`: `https://github.com/Lib0823/Claude_Context_Kit-Plugin`
  - `order`: 2
- `## Overview` — 루트 `README.md` 기준 (Knowledge Graph, Agent Team Harness 등 개발 컨텍스트를
  통합 구축하는 Claude Code 플러그인)
- `## Troubleshooting` — 트러블슈팅 소스 문서가 아직 레포에 없으므로, Research의 `phase` 배지
  패턴을 재사용해 "작성 예정" 안내만 노출한다 (예: 목록 카드에는 노출하지 않고 상세 페이지 본문에만
  플레이스홀더 문구).

## Home 페이지 변경

`src/data/profile.ts`의 `featuredRepos` 배열에서 아래 두 항목의 `href`를 GitHub 외부 링크에서
사이트 내부 링크로 변경한다.

| name | 기존 href | 변경 href |
| --- | --- | --- |
| FinanceManage_Agent-Project | `https://github.com/Lib0823/FinanceManage_Agent-Project` | `/project/finance-manage-agent/` |
| Claude_Context_Kit-Plugin | `https://github.com/Lib0823/Claude_Context_Kit-Plugin` | `/project/claude-context-kit/` |

GitHub 원본 링크는 각 프로젝트 상세 페이지 안에서 (Research의 `repo` 필드와 동일한 패턴으로) 노출한다.
`MSA_Cascading_Failure_Mitigation-Research` 항목은 변경하지 않는다 (이미 `/research/projects/...`로
연결할 수 있으나 이번 작업 범위 밖).

## 테스트/검증 계획

- `npm run build`로 신규 콜렉션 스키마·라우트가 정상 빌드되는지 확인
- `npm run dev`로 `/project`, `/project/finance-manage-agent/`, `/project/claude-context-kit/` 및
  Home 페이지 링크를 브라우저에서 직접 확인 (Research 페이지와 톤/레이아웃 일관성 육안 검토)
- 라이트/다크 테마 모두에서 배지·카드 스타일 확인
