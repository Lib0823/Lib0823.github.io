# 🌐 leeinbeom.github.io Planning Document

> **Purpose**
>
> 본 GitHub Pages는 **개인 기술 블로그 + 연구 포트폴리오 + 개발자 홈페이지**를 목표로 한다.
>
> 단순한 포트폴리오 사이트가 아닌, 지속적으로 성장하는 개발 기록과 연구 기록을 함께 관리하는 공간으로 운영한다.

---

# 📌 Site Structure

```text
leeinbeom.github.io
│
├── 🏠 Home
│
├── 📝 Blog
│
└── 🔬 Research
```

---

# 🏠 Home

Home은 사이트의 첫 화면이다.

방문자가 30초 안에

- 누구인지
- 어떤 개발자인지
- 어떤 연구를 하는지

를 이해할 수 있도록 구성한다.

---

## Sections

```text
Home

├── Hero
├── About
├── Experience
├── Education
├── Tech Stack
├── Featured Repositories
├── Latest Blog Posts
├── Current Research
├── Resume
└── Portfolio
```

---

## Hero

첫 화면

포함 내용

- 이름
- 직무

예시

```
Java Backend Developer

Graduate Student

Interested in

Distributed Systems
Cloud Computing
Microservice Architecture
```

---

## About

간단한 자기소개

예시

- Java Backend Developer
- AI.SW Graduate Student
- Interested in Distributed Systems
- Passionate about scalable software architecture

---

## Experience

경력

예시

```text
Backend Developer

2023 ~ Present
```

---

## Education

학력

예시

```text
Cheongwoon University

Sogang University AI.SW Graduate School
```

---

## Tech Stack

기술 스택

Backend

- Java
- Spring Boot

Database

- PostgreSQL
- Elasticsearch

Infrastructure

- Docker
- K3s
- AWS

Monitoring

- Prometheus
- Grafana

---

## Featured Repositories

대표 Repository

예시

- msa-cascading-failure
- university-notes
- walkingmate

---

## Latest Blog Posts

최근 작성한 글

자동으로 최신 글 표시

---

## Current Research

현재 진행 중인 연구

예시

```
MSA Cascading Failure Prediction
```

Repository와 연결

---

## Resume

PDF 다운로드

---

## Portfolio

PDF 다운로드

---

# 📝 Blog

기술 블로그

```text
Blog

├── Backend
│   ├── Spring
│   ├── Flask
│   └── Library
│
├── Language
│   ├── Java
│   └── Python
│
├── Database
│   ├── PostgreSQL
│   └── Elasticsearch
│
├── Infrastructure
│   ├── Docker
│   ├── K3s
│   ├── AWS
│   └── Server
│
└── AI
```

---

## 글 작성 원칙

모든 글은 아래 구조를 따른다.

```text
Title

Overview

Background

Implementation

Result

References
```

---

# 🔬 Research

연구 소개

```text
Research

├── Research Overview
│
├── Research Projects
│
└── Publications
```

---

# Research Overview

연구 전체 소개

포함 내용

- Research Interests
- Current Research
- Research Timeline
- Research Goal

예시

```
Research Interests

Distributed Systems

Cloud Computing

Microservice Architecture

Fault Tolerance

Artificial Intelligence
```

---

# Research Projects

논문 또는 연구 프로젝트

예시

```text
Research Projects

├── Regional Tourism Analysis
│
├── MSA Cascading Failure Prediction
│
└── Future Research
```

---

## Project Structure

모든 프로젝트는 동일한 구조를 사용한다.

```text
Project

├── Overview
├── Timeline
├── Challenges
└── Outputs
```

---

### Overview

프로젝트 소개

포함 내용

- Background
- Problem Statement
- Research Objective
- Method
- Expected Contribution

---

### Timeline

연구 진행 과정

예시

```
2026.03

Topic Selection

↓

Literature Review

↓

Experiment Design

↓

Implementation

↓

Evaluation

↓

Paper Writing
```

---

### Challenges

연구하면서 해결한 문제

예시

```
Problem

↓

Cause Analysis

↓

Solution

↓

Result
```

논문에 포함되지 않는 시행착오와 기술적 의사결정을 기록한다.

---

### Outputs

최종 결과

예시

- Paper
- Presentation
- Poster
- Repository
- Demo

---

# Publications

완성된 논문 목록

예시

```text
2026

Regional Tourism Analysis

- PDF

------------------------

2027

MSA Cascading Failure Prediction

- PDF
- Slides
- Repository
```

---

# Repository Strategy

GitHub Pages는

> 소개

Repository는

> 실제 프로젝트 관리

를 담당한다.

---

## Repository List

```text
leeinbeom.github.io

university-notes

regional-tourism-analysis

msa-cascading-failure
```

---

# Repository Relationship

```text
GitHub Pages

↓

Research

↓

MSA Cascading Failure Prediction

↓

GitHub Repository
```

Repository에서는

- 코드
- 실험
- 논문
- 그림

등을 관리한다.

---

# Design Principles

## Minimal

불필요한 메뉴를 만들지 않는다.

---

## Consistency

모든 페이지는 동일한 레이아웃을 사용한다.

---

## Documentation First

코드보다 문서를 우선한다.

README만 읽어도 프로젝트를 이해할 수 있도록 작성한다.

---

## Continuous Growth

완성형 사이트가 아니라

지속적으로 성장하는 기술 아카이브를 목표로 한다.

---

# Future Expansion

향후 추가 가능한 메뉴

```text
Conference

Open Source

Books

Talks

Awards
```

현재는 추가하지 않는다.

필요할 때 확장한다.

---

# Final Site Structure

```text
leeinbeom.github.io
│
├── 🏠 Home
│   ├── Hero
│   ├── About
│   ├── Experience
│   ├── Education
│   ├── Tech Stack
│   ├── Featured Repositories
│   ├── Latest Blog Posts
│   ├── Current Research
│   ├── Resume (PDF)
│   └── Portfolio (PDF)
│
├── 📝 Blog
│   ├── Backend
│   ├── Language
│   ├── Database
│   ├── Infrastructure
│   └── AI
│
└── 🔬 Research
    ├── Research Overview
    ├── Research Projects
    │   ├── Project
    │   │   ├── Overview
    │   │   ├── Timeline
    │   │   ├── Challenges
    │   │   └── Outputs
    │   └── ...
    └── Publications
```

> **Vision**
>
> GitHub Pages를 단순한 블로그나 포트폴리오가 아닌,
> **기술 블로그 + 연구 아카이브 + 개발자 홈페이지**를 통합한 개인 기술 플랫폼으로 운영한다.