---
title: 'Query Method. 쿼리 메서드'
description: 'Query Methods는 Spring Data JPA에서 제공하는 기능으로 DB에서 데이터를 조회(select), 저장(insert), 수정(update), 삭제(delete) 등의 작업을 쉽게 수행할 수 있다.'
date: 2023-09-25
category: 'Backend'
tags: ['Spring', 'JPA', 'query methods']
draft: false
---

> Query Methods는 Spring Data JPA에서 제공하는 기능으로 DB에서 데이터를 조회(select), 저장(insert), 수정(update), 삭제(delete) 등의 작업을 쉽게 수행할 수 있다.

QueryMethods는 메서드의 이름 자체로 쿼리를 생성하는 방식으로, 메서드 이름을 통해 JPA는 쿼리를 자동으로 생성하고 실행한다.

이를 통해 개발자는 복잡한 JPQL, QueryDSL 등과 같은 쿼리를 작성하지 않고도 간단한 메서드로 DB조작이 가능하다.

<u>*보통 데이터를 조회하는 용도로 사용된다. (delete, save 메서드 지원)*</u>

## **데이터 조회하기**

**메서드 이름 작성 규칙**

- 메서드 이름은 "find", "read", "get"으로 시작해야 한다.
- "By" 다음에 엔터티의 속성 이름이 위치해야 한다.
- 조건을 추가할 경우 "And", "Or"를 사용하여 조건을 연결한다.

***find[By]<찾을 컬럼명>[And<조건 컬럼명>]...***

```
// firstName 속성이 일치하는 엔터티를 찾습니다.
findByFirstName(String firstName)

// lastName과 firstName이 모두 일치하는 엔터티를 찾습니다.
findByLastNameAndFirstName(String lastName, String firstName)

// age가 특정 값보다 큰 엔터티를 찾습니다.
findByAgeGreaterThan(int age)
```

**반환 타입**

- List<T>: 여러 개의 결과를 반환한다.
- Optional<T>: 하나의 결과를 반환하며, 결과가 없을 경우 null이 아니라 Optional.empty()를 반환한다.
- T: 하나의 결과를 반환하며, 결과가 없을 경우 null을 반환한다.

**Example >**

**Entity**

```java
@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private int age;

    // Getters, setters, constructors, 등...
}
```

**Repository**

```java
public interface PersonRepository extends JpaRepository<Person, Long> {
    List<Person> findByFirstName(String firstName);
    List<Person> findByLastNameAndAgeGreaterThan(String lastName, int age);
    Optional<Person> findFirstByAgeOrderByLastNameDesc(int age);
}
```

**Service**

```java
@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;

    public List<Person> findPeopleByFirstName(String firstName) {
        return personRepository.findByFirstName(firstName);
    }

    public List<Person> findPeopleByLastNameAndAgeGreaterThan(String lastName, int age) {
        return personRepository.findByLastNameAndAgeGreaterThan(lastName, age);
    }

    public Optional<Person> findOldestPerson(int age) {
        return personRepository.findFirstByAgeOrderByLastNameDesc(age);
    }
}
```

*Query Methods에서 사용 가능한 키워드..!*

| Keyword | Sample | JPQL snippet |
| --- | --- | --- |
| Distinct | findDistinctByLastnameAndFirstname | select distinct …​ where x.lastname = ?1 and x.firstname = ?2 |
| And | findByLastnameAndFirstname | … where x.lastname = ?1 and x.firstname = ?2 |
| Or | findByLastnameOrFirstname | … where x.lastname = ?1 or x.firstname = ?2 |
| Is, Equals | findByFirstname,findByFirstnameIs,findByFirstnameEquals | … where x.firstname = ?1 |
| Between | findByStartDateBetween | … where x.startDate between ?1 and ?2 |
| LessThan | findByAgeLessThan | … where x.age < ?1 |
| LessThanEqual | findByAgeLessThanEqual | … where x.age <= ?1 |
| GreaterThan | findByAgeGreaterThan | … where x.age > ?1 |
| GreaterThanEqual | findByAgeGreaterThanEqual | … where x.age >= ?1 |
| After | findByStartDateAfter | … where x.startDate > ?1 |
| Before | findByStartDateBefore | … where x.startDate < ?1 |
| IsNull, Null | findByAge(Is)Null | … where x.age is null |
| IsNotNull, NotNull | findByAge(Is)NotNull | … where x.age not null |
| Like | findByFirstnameLike | … where x.firstname like ?1 |
| NotLike | findByFirstnameNotLike | … where x.firstname not like ?1 |
| StartingWith | findByFirstnameStartingWith | … where x.firstname like ?1 (parameter bound with appended %) |
| EndingWith | findByFirstnameEndingWith | … where x.firstname like ?1 (parameter bound with prepended %) |
| Containing | findByFirstnameContaining | … where x.firstname like ?1 (parameter bound wrapped in %) |
| OrderBy | findByAgeOrderByLastnameDesc | … where x.age = ?1 order by x.lastname desc |
| Not | findByLastnameNot | … where x.lastname <> ?1 |
| In | findByAgeIn(Collection<Age> ages) | … where x.age in ?1 |
| NotIn | findByAgeNotIn(Collection<Age> ages) | … where x.age not in ?1 |
| True | findByActiveTrue() | … where x.active = true |
| False | findByActiveFalse() | … where x.active = false |
| IgnoreCase | findByFirstnameIgnoreCase | … where UPPER(x.firstname) = UPPER(?1) |

### **데이터 저장하기**

<u>Query Methods를 사용하여 데이터를 삽입(insert)하는 것은 지원되지 않는다.</u>

그렇기 때문에 JPA에서는 삽입, 수정 작업을 위해 **save()** 메서드를 제공한다.

```java
@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;

    public void savePerson(Person person) {
        personRepository.save(person);
    }
}
```

### **데이터 삭제하기**

<u>Query Methods를 사용하여 데이터를 삭제하는 것은 잘 사용하지 않지만 가능하다.</u>

**deleteBy** 또는 **removeBy** 접두어를 사용하여 메서드명을 작성할 수 있다.

```java
public interface PersonRepository extends JpaRepository<Person, Long> {

    void deleteByLastName(String lastName);
}
```

reference.

[https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.query-creation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.query-creation)
