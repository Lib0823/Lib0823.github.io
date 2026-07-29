---
title: 'final은 어떻게 동작하나..'
description: 'final에 대해 자세히 알아보자..'
date: 2025-07-25
category: 'Language'
tags: ['Java']
draft: false
---

final에 대해 자세히 알아보자..

final은 어디에 사용하는지에 따라 다른 기능을 하기 때문에 잘 사용하면 여러 이점을 얻을 수 있다.

### 기능

클래스 - 상속 금지

메서드 - 오버라이딩 금지

변수 - 값(참조) 변경 금지

### 이점

1. **불변성 보장 (Immutability)**

```
final String s = "hello";
// s = "world"; // ❌ 불가능 (참조 변경 금지)
// 내부 String은 불변 객체라 내용 변경 불가
```

final 변수 + 불변 객체 → 값 변경 불가 → 데이터 안정성↑

2. **코드 안정성 (Code Stability)**

```java
public final class Utils {
    public final void helper() {
        // 서브클래스에서 변경 불가
    }
}

// class MyUtils extends Utils {} // ❌ 상속 불가
```

final 클래스/메서드 → 상속/오버라이딩 제한 → 의도치 않은 변경 방지

**3. 컴파일 타임 상수 (Compile-time Constant)**

```java
public class Config {
    public static final int MAX_COUNT = 100; // 상수 표현식으로 초기화
}

public class Test {
    public void method() {
        int y = Config.MAX_COUNT + 20; // 컴파일 시 120으로 치환됨
    }
}
```

`static final`로 선언하고 리터럴/상수 표현식으로 초기화한 값은 컴파일 타임에 사용하는 곳마다 값 자체로 치환(inline)된다. 다만 이건 메서드 안의 지역 변수에 `final`을 붙인다고 생기는 효과는 아니고, `static final` 필드에만 적용되는 얘기다. 지역 변수의 `final`은 "재할당을 막는다"는 것 자체가 목적이지, 그것만으로 실행 속도가 빨라지진 않는다 (JIT은 `final` 여부와 상관없이 실제 사용 패턴을 보고 알아서 최적화한다).

변수(객체) 선언 시 final을 사용하면 참조 변수에 대한 변경을 제한하는 것이기 때문에 참조하는 객체를 변경하는건 불가능하지만 객체 내부의 값을 변경하는건 가능하다.

**불변 객체**(String, Integer) : 내부적으로 private final로 선언되기 때문에 값을 변경하려면 무조건 새 객체를 할당해야하기 때문에 변경 불가.

```
final String str = "hello";
// str = "world";         // ❌ 참조 변경 불가
String upper = str.toUpperCase(); // ✅ 새 객체 생성 (str은 그대로)
```

**가변 객체**(Map, List) : 내부 필드가 final이 아니고, put(), remove() 같은 수정 메서드가 존재하기 때문에 객체를 새로 생성하지 않고 내부 값을 변경 가능.

```
final Map<String, String> map = new HashMap<>();
map.put("key", "value"); // ✅ 내부 값 변경 가능
// map = new TreeMap<>(); // ❌ 참조 변경 불가
```

**기본 타입**(int, double) : 애초에 참조 개념이 없어 실제 값이 변수에 저장되기 때문에 값 자체를 변경 불가.

```
final int num = 100;
// num = 200; // ❌ 값 변경 불가
```

### effectively final

`final` 키워드를 직접 안 붙여도, 선언 이후 값이 한 번도 재할당되지 않은 지역 변수는 "effectively final"로 취급된다.

람다나 익명 클래스 안에서 바깥(enclosing scope)의 지역 변수를 참조하려면 이 조건을 만족해야 한다.

```java
int base = 10; // 재할당 없음 -> effectively final
Runnable r = () -> System.out.println(base); // 참조 가능

int count = 0;
// count++; 같은 재할당이 하나라도 있으면
// 람다 안에서 count를 참조하는 순간 컴파일 에러
```

왜 이런 제약이 있냐면, 람다/익명 클래스는 내부적으로 바깥 변수를 "값 복사"해서 캡처하기 때문이다. 캡처 이후 원본 변수가 바뀌어도 람다 쪽은 그걸 알 방법이 없어서, 애초에 값이 안 바뀌는 변수만 캡처를 허용하는 것이다.
