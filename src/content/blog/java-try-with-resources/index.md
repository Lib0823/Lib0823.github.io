---
title: '자원 관리 (try-with-resources)'
description: 'Try문으로 자원 관리하기'
date: 2024-08-26
category: 'Language'
tags: ['Java']
draft: false
---

> Try문으로 자원 관리하기

![https://rakeshvardan.com](./try-with-resources-1.png)

1. 기본 try-catch

예외(Exception)를 처리하기 위한 기본 구조이다.

```
try {
    // 예외가 발생할 가능성이 있는 코드
} catch (예외타입 e) {
    // 예외 발생 시 실행할 코드
} finally {
    // (선택적) 예외 발생 여부와 관계없이 항상 실행됨
}
```

2. try-catch vs try-with-resources

기본 try-catch문은 finally에서 자원이 존재하는지 여부를 체크하고 닫아줘야 하지만 try-with-resources문에서는 AutoCloseable 인터페이스를 구현한 객체를 자동으로 닫아준다.

Java7 부터 사용 가능

```java
try (FileInputStream fis = new FileInputStream("data.txt");
     BufferedReader br = new BufferedReader(new InputStreamReader(fis))) {
    System.out.println(br.readLine());
} catch (IOException e) {
    e.printStackTrace();
}
```

- `try()` 괄호 안에 선언한 자원은 try 블록이 끝나는 시점에 **선언한 순서의 역순**으로 자동 close된다.
- 여러 개를 세미콜론(`;`)으로 구분해서 선언할 수 있고, 각 자원은 `AutoCloseable`(또는 그 하위인 `Closeable`)을 구현하고 있어야 한다.

3. 내부적으로 어떻게 처리되는지

try-with-resources는 컴파일 시점에 사실 `try-finally` 구조로 변환된다. 위 코드는 대략 이런 형태로 컴파일된다고 보면 된다.

```java
FileInputStream fis = new FileInputStream("data.txt");
try {
    BufferedReader br = new BufferedReader(new InputStreamReader(fis));
    try {
        System.out.println(br.readLine());
    } finally {
        br.close();
    }
} finally {
    fis.close();
}
```

여기서 눈여겨볼 부분은 **예외가 겹치는 경우**다. try 블록에서 예외가 발생했는데, 그 뒤 자동으로 호출되는 `close()`에서도 예외가 발생하면 어떻게 될까?

- try-with-resources는 원래 발생한 예외(primary exception)를 그대로 던지고, close()에서 발생한 예외는 그 안에 **suppressed exception**으로 붙여서 함께 전달한다.
- 두 예외 정보를 다 보고 싶다면 `e.getSuppressed()`로 확인할 수 있다.

```java
try (AutoCloseable r = () -> { throw new RuntimeException("close 실패"); }) {
    throw new RuntimeException("본문 실패");
} catch (Exception e) {
    System.out.println(e.getMessage());              // 본문 실패
    System.out.println(e.getSuppressed()[0].getMessage()); // close 실패
}
```

4. 직접 close()하는 것과 비교

try-with-resources 없이 직접 자원을 닫으려면 finally 블록에서 null 체크까지 해줘야 한다.

```java
FileInputStream fis = null;
try {
    fis = new FileInputStream("data.txt");
    // 작업 수행
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            e.printStackTrace(); // 여기서 예외가 나면 본문의 예외를 덮어써버릴 수 있음
        }
    }
}
```

이 방식의 가장 큰 문제는, `finally`의 `close()`에서 예외가 나면 본문에서 발생한 원래 예외가 묻혀버리거나(catch로 잡히지 못하고) 덮어써질 수 있다는 것이다. try-with-resources는 이 문제를 suppressed exception으로 해결해서, 자원 정리 코드를 직접 짤 때보다 예외 처리가 훨씬 안전하고 코드도 짧아진다.
