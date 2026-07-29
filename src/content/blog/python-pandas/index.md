---
title: 'Pandas란?'
description: 'pandas는 쉽고 직관적인 관계형 or 분류된 데이터로 작업 할 수 있도록 설계된 빠르고 유연하며 표현력이 풍부한 데이터 구조를 제공하는 python library이다.'
date: 2023-08-24
category: 'Language'
tags: ['Python']
draft: false
---

### **pandas**

pandas는 쉽고 직관적인 관계형 or 분류된 데이터로 작업 할 수 있도록 설계된 빠르고 유연하며 표현력이 풍부한 데이터 구조를 제공하는 python library이다.

- 데이터 분석에서 자주 사용하는 테이블 형태를 다룰 수 있는 라이브러리
- 1차원 자료구조→ **Series**, 2차원 자료구조→ **DataFrame**을 지원

![pandas](./pandas-1.png)

## **pandas-Series**

> pandas를 사용하기 위해서는 **import pandas as pd**를 통해 import한다.

### # Series 자료형

- 리스트를 원소로 생성하는 1차원 자료구조
- Series의 원소 인덱스는 0부터 시작하는 정수를 기본 사용

**Series 생성**

- pd.Series()
- ex>

```python
data1 = [10, 20, 30, 40, 50]
data2 = ['1반', '2반', '3반', '4반', '5반']
sr1 = pd.Series(data1)
sr2 = pd.Series(data2)
```

**값을 이용하여 Series 생성**

- ex>

```python
sr3 = pd.Series([101, 102, 103, 104, 105])
sr4 = pd.Series(['월', '화', '수', '목', '금'])
```

**인덱스를 지정하여 Series 생성**

- ex>

```python
sr5 = pd.Series(data1, index=[1000, 1001, 1002, 1003, 1004])
sr6 = pd.Series(data1, index=data2)
```

**Series 인덱싱**

- ex>

```python
sr6['3반']
sr6[2]
sr6[-1]
```

**Series 슬라이싱**

- ex>

```python
sr6[0:3]
```

**Series 인덱스**

- ex>

```python
sr6.index
```

**Series 값**

- ex>

```python
sr6.values
```

**Series 연산**

- 연산할 두 Series원소의 자료형이 같아야 함
- 숫자면 더하고, 문자열이면 연결시킨다.
- ex>

```python
sr1 + sr3
sr2 + sr4
```

## **pandas-DataFrame**

> pandas를 사용하기 위해서는 **import pandas as pd**를 통해 import한다.

### # DataFrame 자료형

- 행과 열이 있는 테이블 형태의 2차원 자료구조

**딕셔너리를 이용하여 DataFrame 생성**

- pd.DataFrame()
- ex>

```python
data_dic = { 'year' : [2018, 2019, 2020], 'sales' : [350, 480, 1099] }
df1 = pd.DataFrame(data_dic)
```

**리스트를 이용하여 DataFrame 생성**

- ex>

```python
df2 = pd.DataFrame([[89.2, 92.5, 90.8], [92.5, 89.9, 95.2]], index=['중간고사', '기말고사'], columns=data2[0:3])
```

**DataFrame 열 이름 설정**

- ex>

```python
df2.columns = ['국어', '영어', '수학']
```

**DataFrame 조회**

- ex>

```python
# 위부터 2개 행 조회
df2.head(2)
# 아래부터 2개 행 조회
df2.tail(2)
# 컬럼 조회
df2['국어']
```

**CSV 파일로 저장**

- to_csv
- ex>

```python
df2.to_csv('C:/Users/inbeom/my_python/score.csv', header=False)
```

**CSV 파일을 DataFrame으로 불러오기**

- read_csv
- ex>

```python
df3 = pd.read_csv('C:/Users/inbeom/my_python/score.csv', encoding='utf-8', index_col=0, engine='python')
```
