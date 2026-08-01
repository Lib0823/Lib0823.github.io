---
title: 'Optional 클래스'
description: 'java.util.Optional은 Java 8에서 도입된 클래스로, 값이 존재하지 않을 수 있는 상황에 사용하면 NullPointerException을 방지하고 코드를 더 안전하게 만들 수 있다.'
date: 2023-09-11
category: 'Language'
tags: ['Java', 'Optional']
draft: false
---

![Optional 클래스](./optional-1.png)

java.util.Optional은 Java 8에서 도입된 클래스로, 값이 존재하지 않을 수 있는 상황에 사용하면 NullPointerException을 방지하고 코드를 더 안전하게 만들 수 있다.

> 즉, 값이 존재하는 상태(NOT NULL)와 값이 존재하지 않는 상태(NULL)를 체크하며 에러를 발생시키지 않고 예외처리를 통해 코드의 안전성을 높인다.

### Optional 문법 사용 방법

#### **1. Optional 객체 생성 :**

**Optional.of(value)**: 만약 값이 null이라면 NullPointerException이 발생.

**Optional.ofNullable(value)**: 값이 null인 경우 빈 Optional을 반환.

```
Optional<String> optionalWithValue = Optional.of("Hello");
Optional<String> optionalWithNull = Optional.ofNullable(null);
```

#### **2. 값의 존재 여부 확인 :**

**isPresent():** 값이 존재하는지 여부를 확인.

```
Optional<String> optional = Optional.of("Hello");
boolean isPresent = optional.isPresent(); // true
```

#### **3. 값 가져오기 :**

**get():** 값이 존재한다면 해당 값을 반환. 값이 존재하지 않는 경우 <u>NoSuchElementException</u>이 발생.

```
Optional<String> optional = Optional.of("Hello");
String value = optional.get(); // "Hello"
```

#### **4. 값이 존재하지 않을 때 대체 값 사용하기 :**

**orElse(other)**: 값이 존재하지 않을 때 대체 값을 반환.

```
Optional<String> optional = Optional.ofNullable(null);
String value = optional.orElse("Default Value"); // "Default Value"
```

#### **5. 값이 존재하지 않을 때 처리 :**

**ifPresent(consumer):** 값이 존재할 때만 주어진 동작을 수행.

```
Optional<String> optional = Optional.of("Hello");
optional.ifPresent(value -> System.out.println("Value is present: " + value));
```

#### **6. 값 변환 :**

**map(function):** 값이 존재할 때 주어진 함수를 적용하고, 그 결과를 새로운 Optional로 반환.

```
Optional<String> optional = Optional.of("Hello");
Optional<Integer> lengthOptional = optional.map(String::length); // Optional[5]

// Method Chaining 응용
Optional<String> optionalString = Optional.of("hello");
        String result = optionalString
                .map(str -> str.toUpperCase()) // 소문자를 대문자로 변환
                .map(str -> str + " WORLD")     // 문자열 뒤에 " WORLD" 추가
                .map(str -> str.substring(0, 5)) // 처음 5글자만 남기기
                .orElse("Default Value");        // 값이 없을 경우 기본값 반환
        System.out.println(result); // 출력: HELLO
```

#### **7. 다른 Optional 객체와 결합 :**

**flatMap(function)**: 두 Optional 객체를 결합하고, 결과를 반환.

```
Optional<String> optional1 = Optional.of("Hello");
Optional<String> optional2 = Optional.of(" World");
Optional<String> combined = optional1.flatMap(value1 -> optional2.map(value2 -> value1 + value2)); // Optional[Hello World]
```
