---
title: 'Stream에 대해 알아보자'
description: 'Stream은 Iterator와 비슷한 역할을 하는 반복자이지만, 람다식으로 요소 처리 코드를 제공하는 점과, 내부 반복자를 사용하므로 병렬처리가 쉽다는 점, 중간처리와 최종 처리 작업을 수행하는 점에서 많은...'
date: 2023-08-20
category: 'Language'
tags: ['Java', 'STREAM', 'Lambda']
draft: false
---

![Stream에 대해 알아보자](./stream-1.png)

## 스트림(Stream)이란?

Stream은 Iterator와 비슷한 역할을 하는 반복자이지만, 람다식으로 요소 처리 코드를 제공하는 점과, 내부 반복자를 사용하므로 병렬처리가 쉽다는 점, 중간처리와 최종 처리 작업을 수행하는 점에서 많은 차이를 가지고 있다.

> **기존 루프문 처리의 문제점**

기존 Java에서 컬렉션 데이터를 처리할때는 for, foreach 루프문을 사용하면서 컬렉션 내의 요소들을 하나씩 다루었다.

간단한 처리나 컬렉션의 크기가 작으면 큰 문제가 아니지만 복잡한 처리가 필요하거나 컬렉션의 크기가 커지면 루프문의 사용은 성능저하를 일으킨다.

> **스트림의 등장**

스트림은 Java8에서 추가된 기능으로 컬렉션 데이터를 선언형으로 쉽게 처리할 수 있다.

복잡한 루프문을 사용하지 않아도 되며 루프문을 중첩해서 사용해야 되는 최악의 경우도 없으며, 스트림은 병렬처리(Multi thread)를 별도의 멀티스레드 구현없이도 쉽게 구현할 수 있다.

### Stream 사용 예제

Stream [ X ]

```
// 빨간색 사과 필터링
List<Apple> redApples = new ArrayList<>();
for (Apple apple : appleList) {
    if (apple.getColor().equals("RED")) {
        redApples.add(apple);
    }
}

// 무게 순서대로 정렬
redApples.sort(Comparator.comparing(Apple::getWeight));

// 사과 고유번호 출력
List<Integer> redHeavyAppleUid = new ArrayList<>();
for (Apple apple : redApples)
    redHeavyAppleUid.add(apple.getUidNum());
```

Stream [ O ]

```
List<Integer> redHeavyAppleUid = appleList.stream()
        .filter(apple -> apple.getColor().equals("RED"))        // 빨간색 사과 필터링
        .sorted(Comparator.comparing(Apple::getWeight))         // 무게 순서대로 정렬
        .map(Apple::getUidNum).collect(Collectors.toList());    // 사과 고유번호 출력
```

---

### Intermediate Operations (중간 연산)

- filter(predicate): 조건에 맞는 요소를 선택합니다.

```
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
List<Integer> evenNumbers = numbers.stream()
                                  .filter(n -> n % 2 == 0)
                                  .collect(Collectors.toList());
// 결과: [2, 4, 6, 8, 10]
```

- map(function): 요소들을 변환합니다.

```
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
List<Integer> nameLengths = names.stream()
                                 .map(String::length)
                                 .collect(Collectors.toList());
// 결과: [5, 3, 7]
```

- sorted(): 요소들을 기본 정렬 순서에 따라 정렬합니다.

```
List<Integer> numbers = Arrays.asList(5, 3, 8, 1, 2);
List<Integer> sortedNumbers = numbers.stream()
                                     .sorted()
                                     .collect(Collectors.toList());
// 결과: [1, 2, 3, 5, 8]
```

- distinct(): 중복된 요소를 제거합니다.

```
List<Integer> numbers = Arrays.asList(1, 2, 3, 2, 4, 3, 5);
List<Integer> distinctNumbers = numbers.stream()
                                       .distinct()
                                       .collect(Collectors.toList());
// 결과: [1, 2, 3, 4, 5]
```

- limit(n): 처음부터 n개의 요소로 제한합니다.

```
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> limitedNumbers = numbers.stream()
                                      .limit(3)
                                      .collect(Collectors.toList());
// 결과: [1, 2, 3]
```

- skip(n): 처음 n개의 요소를 건너뛴 후 남은 요소들로 구성합니다.

```
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> skippedNumbers = numbers.stream()
                                      .skip(2)
                                      .collect(Collectors.toList());
// 결과: [3, 4, 5]
```

### Terminal Operations (최종 연산)

- forEach(consumer): 각 요소를 소비하면서 작업을 수행합니다. - print

```
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.stream()
     .forEach(System.out::println);
// 출력: Alice
//       Bob
//       Charlie
```

- collect(collector): 요소들을 수집하여 결과를 반환합니다. - list

```
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
List<String> collectedNames = names.stream()
                                  .collect(Collectors.toList());
// 결과: ["Alice", "Bob", "Charlie"]
```

---

> **Stream을 사용할 때 <u>직렬</u>로 처리할 것인지 <u>병렬</u>로 처리할 것인지 지정할 수 있다!**
> 다만, 병렬 처리는 멀티스레딩으로 동작하므로 스레드 간 동기화 문제를 방지하기 위해 안전한 자료구조 및 작업을 선택하고, 명시적인 동기화가 필요한 경우에는 적절한 방법으로 처리해야 한다.

```
// 직렬 처리 (Serial Processing)
myList.stream().forEach(element -> {
    // processing logic ~
});

// 병렬 처리 (Parallel Processing) 
myList.parallelStream().forEach(element -> {
    // processing logic ~
});
```
