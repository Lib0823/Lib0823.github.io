---
title: 'NumPy란?'
description: 'C언어로 구현된 python library이며, 고성능의 수치계산을 위해 제작되었다.'
date: 2023-08-24
category: 'Language'
tags: ['Python', 'numpy']
draft: false
---

#### **Numpy** (Numerical Python)

C언어로 구현된 python library이며, 고성능의 수치계산을 위해 제작되었다.

- **벡터 및 행렬(array)** 연산에 있어서 매우 편리한 기능 제공
- 다차원 배열 자료구조인 ndarray지원
- 데이터분석을 할 때 사용되는 pandas, matplotlib의 기반으로도 사용

![Numpy (Numerical Python)](./numpy-numerical-python-1.png)

> Numpy를 사용하기 위해서는 **import numpy as np로** import해줘야 한다.

### **#함수**

**np.array()**

- 리스트를 이용하여 numpy 생성
- Ex>

```
ar1 = np.array([1, 2, 3, 4, 5])
ar2 = np.array([[10, 20, 30], [40, 50, 60]])
```

**np.arange()**

- 값의 범위를 지정하여 numpy 생성
- Ex>

```
ar1 = np.arange(1, 11, 2)
```

**np.array().reshape()**

- 구조를 지정하여 numpy 생성
- Ex>

```
# 3행 2열 구조로 변경
ar1 = np.array([1, 2, 3, 4, 5, 6]).reshape((3, 2))
```

**np.zeros()**

- 초기값과 구조를 지정하여 numpy 생성
- Ex>

```
ar1 = np.zeros((2, 3))
```

---

**numpy 슬라이싱**

- Ex>

```
# ar2의 0행 0,1과 1행 0,1 값을 가져온다
ar1 = ar2[0:2, 0:2]
```

**numpy 사칙연산**

- Ex>

```
# ar1의 모든 인덱스에 10을 더한다
ar2 = ar1 + 10

# ar1과 ar2의 각각의 인덱스 값을 더한다
ar3 = ar1 + ar2

# ar1의 모든 인덱스에 각각 2를 곱한다.
ar1 * 2
```

**numpy 행렬곱 연산**

- 두 numpy의 열 인덱스 값 끼리 곱하고 다른 행 인덱스와 더함
- Ex>

```
# ar1, ar2의 각각의 열을 곱하고 행끼리 더한다.
ar1 = np.array([1, 2, 3])
ar2 = np.array([2, 3, 4])

np.dot(ar1, ar2) # => 20
```
