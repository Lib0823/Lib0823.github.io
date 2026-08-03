---
title: '신뢰도 기반 GNN 예측을 활용한 MSA 연쇄 장애 선제 대응 아키텍처'
summary: '신뢰도 기반 GNN 예측으로 MSA 연쇄 장애에 선제 대응하는 아키텍처 연구.'
status: 'in-progress'
phase: '프로포절 준비'
period: '2026.07 ~ 2028.06'
tags: ['Distributed Systems', 'MSA', 'GNN', 'Fault Tolerance']
order: 2
repo: 'https://github.com/Lib0823/MSA_Cascading_Failure_Mitigation-Research'
---

## Overview

- **Background**: 모놀리식에서 쿠버네티스 기반 분산 아키텍처로 전환하는 과정에서, 마이크로서비스(MSA) 간 연쇄 장애(cascading failure) 위험이 커진다. 기존 오토스케일러(K8s HPA)는 사후반응적이고 서비스 간 위상(topology) 정보를 반영하지 못하며, 커넥션풀 같은 상태성 리소스 병목에서는 자원을 늘리는 대응이 오히려 역효과를 낼 수 있다.
- **Problem Statement**: 장애 확산 패턴을 사전에 예측하고, 예측의 확신 정도에 따라 조치 강도를 달리하는 아키텍처가 아직 없다.
- **Research Objective**: 서비스 호출 그래프를 GAT(Graph Attention Network)로 학습해 장애 전파 가능성을 예측하고, Deep Ensemble 기반 신뢰도에 따라 Circuit Breaker·Traffic Shedding·Scale-up·Read Redirection·Brownout 등 이질적 조치를 차등 적용하는 아키텍처를 제안한다.
- **Method**: Online Boutique 벤치마크 위에서 Locust/k6로 트래픽을, Istio/Chaos Mesh로 장애를 주입해 데이터를 수집하고, GAT + Deep Ensemble(N=5)로 서비스별 위험도와 신뢰도를 함께 예측한 뒤, 신뢰도 구간별 비용함수로 조치를 선택하는 Policy Engine을 검증한다.
- **Expected Contribution**: 위상 인지 예측·이질적 조치 선택·신뢰도 구간별 대응을 모두 갖춘 아키텍처로, 장애 전파 가능성이 높은 서비스를 선제적으로 식별해 대응 우선순위를 제시한다.

## Positioning

관련 선행연구(GRAF, FIRM, AGQ, GraphGRU)를 검토한 결과, 각 연구는 아래 세 축 중 최소 하나를 다루지 않고 있어 이 지점에서 차별점을 확보했다.

| 축 | GRAF | FIRM | AGQ | GraphGRU | 본 연구 |
| --- | --- | --- | --- | --- | --- |
| 예측 모델 | GNN (위상 반영) | SVM (위상 미반영) | STGNN + Q-learning | GAT (동적 그래프) | GAT (정적) |
| 조치 공간 | 자원 할당 | 자원 재할당 | 자원 할당 | 없음 (예측만) | 이질적 조치 5종 |
| 신뢰도 구간별 대응 | 없음 | 없음 | 없음 | 없음 | 있음 |

## Timeline

```text
2026.07          연구 시작, 주제 선정 및 문헌 조사
   ↓
2026 하반기        관련연구 비교, 모델·비용함수 설계 확정
   ↓
2027 상반기        프로포절 작성 및 심사
   ↓
2027 하반기~2028 상반기  구현 및 실험 (모델 스모크 테스트 → 데이터 파이프라인 검증 → 전체 실험)
   ↓
2028 상반기        논문 작성 및 본심사
```

## Challenges

- 로컬 하드웨어(맥북에어 16GB)로 실험이 가능한지 먼저 따져봤다. GNN 모델 자체는 그래프가 작아(11개 노드 안팎) 학습 부담이 크지 않지만, K8s 클러스터·장애주입·트래픽 생성을 동시에 돌리면 메모리가 부족할 수 있어 학습과 실험 실행을 시간적으로 분리하기로 했다.
- 벤치마크 규모(Online Boutique, 11-12개 서비스)가 연구 목적에 비해 너무 작은 건 아닌지 검토했다. 선행연구들이 실제로 GNN 입력에 사용한 그래프 규모를 원문까지 확인한 결과, GRAF·AGQ의 핵심 검증도 비슷한 자릿수(6-13개 노드)에서 이뤄졌다는 걸 확인하고 현재 규모를 유지하기로 했다.
- GNN 모델로 GCN 대신 GAT을 택한 근거를 다시 점검했다. 기존 연구들이 실제로는 어텐션 기반 차등 집계를 쓰지 않는다는 점을 원문에서 확인하고, 이를 GAT 채택 근거로 삼았다.
- 신뢰도 산출 방식(MC Dropout / Deep Ensemble / Softmax Entropy)을 비교했고, 즉각 반응이 필요한 조치와 추론 주기가 충돌하지 않도록 Deep Ensemble(N=5)로 결정했다.

## Outputs

- 연구계획서(프로포절) 초안, 관련연구 비교표: 작성 중
- 의사결정·문헌 조사 기록: 지속 갱신
- Paper, 실험 코드, 실험 데이터: 프로포절 심사 이후 순차적으로 진행 예정
- Repository: [MSA_Cascading_Failure_Mitigation-Research](https://github.com/Lib0823/MSA_Cascading_Failure_Mitigation-Research)
