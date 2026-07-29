---
title: '신뢰도 기반 GNN 예측을 활용한 MSA 연쇄 장애 선제 대응 아키텍처'
summary: '신뢰도 기반 GNN 예측으로 MSA 연쇄 장애에 선제 대응하는 아키텍처 연구.'
status: 'in-progress'
period: '2026.03 ~'
tags: ['Distributed Systems', 'MSA', 'GNN', 'Fault Tolerance']
order: 2
---

## Overview

- **Background**: 마이크로서비스 환경에서는 단일 서비스 장애가 연쇄적으로 전체 시스템 장애로 확산되는 경우가 많다.
- **Problem Statement**: 장애 확산 패턴을 사전에 예측할 수 있는 정량적 모델이 부족하다.
- **Research Objective**: 서비스 간 호출 그래프에 신뢰도(Trust) 가중치를 부여하고, GNN으로 cascading failure 가능성을 예측해 선제적으로 대응하는 아키텍처를 제안한다.
- **Method**: 서비스 메시/모니터링 데이터 수집, 신뢰도 기반 장애 전파 그래프 모델링, GNN 예측 모델 학습 및 검증.
- **Expected Contribution**: 장애 전파 가능성이 높은 서비스를 사전에 식별해 장애 대응 우선순위를 제시.

## Timeline

```text
2026.03  주제 선정
   ↓
2026.04  문헌 조사
   ↓
2026.06  실험 설계
   ↓
2026.09  구현
   ↓
2026.11  평가
   ↓
2027.01  논문 작성
```

## Challenges

논문에 포함되지 않은 시행착오와 기술적 의사결정을 기록한다. (진행하며 업데이트 예정)

## Outputs

- Paper (진행 중)
- Repository
