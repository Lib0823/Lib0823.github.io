# leeinbeom.github.io

Java 백엔드 개발과 대학원 연구를 기록하는 개인 사이트. Astro 기반 정적 사이트로, `main` 브랜치에
푸시하면 GitHub Actions가 자동으로 빌드해 GitHub Pages에 배포한다.

## 구조

```text
src/
├── content/
│   ├── blog/           # 기술 블로그 글 (마크다운)
│   ├── research/       # 연구 프로젝트 (마크다운)
│   └── publications/   # 발표 논문 (마크다운)
├── content.config.ts    # 위 세 컬렉션의 frontmatter 스키마
├── layouts/
│   └── BaseLayout.astro
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   └── ThemeToggle.astro
├── data/profile.ts                     # Home의 경력·학력·기술스택·대표 저장소 (코드 아님, 데이터만)
├── lib/taxonomy.ts                     # slugify, 페이지당 글 수(PAGE_SIZE)
├── pages/
│   ├── index.astro                     # Home
│   ├── 404.astro                       # 커스텀 404
│   ├── rss.xml.js                      # 블로그 RSS 피드
│   ├── blog/
│   │   ├── [...page].astro             # Blog 목록 (전체, 페이지네이션)
│   │   ├── [...slug].astro             # Blog 상세
│   │   ├── category/[category]/[...page].astro  # 카테고리별 목록
│   │   └── tag/[tag]/[...page].astro             # 태그별 목록
│   └── research/
│       ├── index.astro                 # Research Overview
│       ├── projects/index.astro        # Research Projects 목록
│       ├── projects/[...slug].astro    # Research Project 상세
│       └── publications.astro          # Publications
└── styles/global.css                   # 디자인 토큰 · 전역 스타일
```

### Blog 목록 · 필터 · 페이지네이션

카테고리·태그 필터는 클라이언트 JS가 아니라 실제 정적 라우트다. 글이 30개, 100개로 늘어나도
각 카테고리/태그 페이지가 독립적으로 페이지네이션되고, URL만으로 공유·검색엔진 노출이 된다.

- `/blog/`, `/blog/2/`, ... — 전체 글 (최신순, `PAGE_SIZE`개씩)
- `/blog/category/<slug>/`, `/blog/category/<slug>/2/`, ... — 카테고리별
- `/blog/tag/<slug>/`, `/blog/tag/<slug>/2/`, ... — 태그별

`PAGE_SIZE`(기본 9)는 `src/lib/taxonomy.ts`에서 조정한다. 카테고리/태그 pill과 페이지네이션
UI는 각각 `src/components/BlogFilterNav.astro`, `src/components/Pagination.astro`에 있다.

## 콘텐츠 작성

### Blog

`src/content/blog/<slug>/index.md`로 폴더 하나당 글 하나를 추가한다 (폴더명이 곧 URL slug).

```text
src/content/blog/jpa-n-plus-one-fetch-join/
├── index.md
├── cover.png
└── query-plan.png
```

```yaml
---
title: '글 제목'
description: '목록/OG에 노출될 한 줄 요약'
date: 2026-01-01
category: 'Backend' # Backend | Language | Database | Infrastructure | AI
tags: ['Spring']
draft: false
---
## Overview
## Background
## Implementation
## Result
## References
```

Tistory 글을 옮길 때는 `Title / Overview / Background / Implementation / Result / References`
구조를 유지한다 (`template.md` 참고).

**이미지**: 글의 스크린샷 등은 같은 폴더에 넣고 `index.md`에서 상대 경로(`./cover.png`)로
참조한다. 폴더 단위로 분리되어 있어 글마다 이미지 파일명이 겹칠 걱정이 없고, Astro가 상대 경로
이미지는 자동으로 최적화·lazy loading을 적용한다 (절대 경로 `/images/...`로 넣으면 최적화 없이
원본 그대로 나간다).

### Research Projects

`src/content/research/<slug>/index.md`로 추가한다 (Blog와 동일하게 폴더 단위). `status`는
`in-progress` / `completed` / `planned` 중 하나이며, `order`가 작을수록 먼저 노출된다. 본문은
`## Overview`, `## Timeline`, `## Challenges`, `## Outputs` 섹션으로 구성한다.

### Publications

`src/content/publications/<slug>/index.md`로 추가한다. `pdf` / `slides` / `repo` 필드는 선택
값이며, 값이 없으면 해당 링크 대신 "준비 중" 배지가 노출된다.

## Resume / Portfolio

Home 하단의 Resume·Portfolio 버튼은 `/resume.pdf`, `/portfolio.pdf`를 가리킨다. 실제 PDF 파일을
`public/resume.pdf`, `public/portfolio.pdf`로 추가하면 된다.

## 로컬 개발

| Command           | 설명                        |
| ----------------- | --------------------------- |
| `npm run dev`     | 개발 서버 (`localhost:4321`) |
| `npm run build`   | `./dist`로 정적 빌드         |
| `npm run preview` | 빌드 결과 로컬 미리보기      |

## 배포

`main` 브랜치 푸시 시 `.github/workflows/deploy.yml`이 빌드 후 GitHub Pages에 배포한다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 설정해야 한다.
