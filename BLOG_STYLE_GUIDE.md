# Blog Style Guide (Tistory → 사이트 마이그레이션 양식)

Tistory 백업(`_temp/_blog/`)에 있는 글들을 이 사이트로 옮길 때 따르는 규칙이다. 원문의 스타일이
글마다 다르기 때문에(짧은 개념 정리 / 누적되는 에러노트 / 긴 튜토리얼), 모든 글을 억지로 하나의
5단 구조(Overview/Background/...)에 끼워 맞추지 않는다. 대신 **frontmatter는 통일하고, 본문은
원문 구조를 최대한 유지하면서 포맷만 정리**한다.

## Frontmatter

```yaml
---
title: '원문 제목 그대로 (카테고리 접두어 [SpringMVC] 등은 제거)'
description: '목록/OG에 노출될 1~2문장 요약. 원문에 없으면 새로 작성.'
date: 2023-08-19 # Tistory 원본 발행일 그대로 유지 (마이그레이션 날짜 아님)
category: 'Backend' # Backend | Language | Database | Infrastructure | AI
tags: ['Spring'] # 아래 매핑 표 기준
draft: false
---
```

## 본문 구조

1. **리드 문단 (선택)** — 글을 1~2문장으로 요약. 원문에 인용구(blockquote) 형태 인트로가 있으면
   그대로 쓰고, 없으면 새로 짧게 작성한다.
2. **본문** — 원문의 heading 구조(H2/H3/H4), 목록, 표, 코드블록, 이미지, 인용구를 최대한 그대로
   유지한다. 다음 Tistory 전용 요소만 정리한다:
   - 깨진 이모지 문자 `?` 제거 (예: "? JPA란?" → "JPA란?"). 문장 끝의 진짜 물음표는 그대로 둔다.
   - 이미지는 글과 같은 폴더에 상대경로로 둔다 (`./cover.png`).
   - 코드블록은 가능하면 언어 힌트를 붙인다.
   - 표는 GFM 표로 변환한다.
   - Tistory 특유의 잔여 문구(`&nbsp;`만 있는 빈 문단, "Continue to Update.." 등)는 제거한다.
3. **References (선택)** — 원문에 참고 링크가 있으면 그대로 옮긴다. 없으면 만들어내지 않는다.

## 글 유형별 처리

- **개념 정리형** (예: "JPA란?", "Flask란?"): 리드 문단만 보완하고 원문의 bullet·정의 구조는
  그대로 유지한다. 짧다고 억지로 내용을 늘리지 않는다.
- **에러노트형** (누적되는 문제/원인/해결 기록): `### 문제 상황` / `발생 원인` / `해결 방법` 반복
  구조를 그대로 유지한다. "누적 기록"이라는 원문 성격은 유지하되 Tistory 문구만 정리한다.
- **튜토리얼/딥다이브형** (긴 글, 표·코드블록·마무리 문단이 있는 글): 원문의 절 구성, 표,
  코드블록, 마무리 문단, References를 그대로 유지한다.

## 카테고리 · 태그 매핑

| Tistory 카테고리 | 사이트 category | 사이트 tag |
| ----------------- | ---------------- | ---------- |
| SpringFramework (하위 전체) | Backend | Spring |
| Flask | Backend | Flask |
| Java | Language | Java |
| Python | Language | Python |
| PostgreSQL | Database | PostgreSQL |
| Elasticsearch | Database | Elasticsearch |
| Docker | Infrastructure | Docker |
| AWS (EC2/RDS) | Infrastructure | AWS |
| Nginx / Tomcat / Heroku | Infrastructure | Server |
| AI | AI | AI |

위 표에 없는 Tistory 카테고리(OS, DevTools, CS, Framework & Library, Database 중 PostgreSQL·
Elasticsearch 외, Web 중 Flask 외, Language 중 Java·Python 외, 개인/컨퍼런스/대학원 등)는
옮기지 않는다.

## 처리하지 않는 것

- 원문에 없는 성과/결과를 지어내지 않는다.
- 원문에 없는 참고 링크를 지어내지 않는다.
- 사이트의 blog 카테고리 enum(`src/content.config.ts`)은 수정하지 않는다.
