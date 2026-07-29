---
title: 'Native Query. 네이티브 쿼리'
description: 'NativeQuery는 JPA의 EntityManager를 통해 직접 SQL을 작성하고 실행할 수 있게 해주며, 이를 사용하여 JPA의 영속성 컨텍스트를 우회하여 직접 데이터베이스와 상호 작용할 수 있다.'
date: 2023-09-25
category: 'Backend'
tags: ['Spring', 'JPA', 'native query']
draft: false
---

![Native Query. 네이티브 쿼리](./native-query-1.png)

> NativeQuery는 JPA의 EntityManager를 통해 직접 SQL을 작성하고 실행할 수 있게 해주며, *이를 사용하여 JPA의 영속성 컨텍스트를 우회하여 직접 데이터베이스와 상호 작용할 수 있다.*

**장점:**

- 복잡한 쿼리를 사용해야 할 때 JPQL로는 표현하기 어려운 경우에 유용하다.
- 특정 DBMS의 기능을 사용해야 할 때 필요하다.

*보통 JPQL을 사용하고 이러한 특정 상황에서만 NativeQuery를 사용하는 것이 좋다.*

**특징:**

- **반환 타입** : 조회 결과의 컬럼이 Entity와 매핑되면 Entity로 받을 수 있고, 그렇지 않으면 Dto나 기본 자료형으로 받아야 한다.
- **Named Parameter 사용** : [:param] 형식으로 네임드 파라미터를 사용하여 바인딩 할 수 있다.
- **Entity 매핑** : Entity를 사용하지 않기 때문에 수동으로 결과를 매핑해야 한다.
- **페이징 및 정렬** : 페이징 및 정렬을 하려면 별도로 처리해야 한다.
- **SQL Injection 주의** : parameter가 직접적으로 query에 입력되기 때문에 적절한 처리 필요.

### *사용 방법*

### **@Query 어노테이션**

JPA 인터페이스에 Query 어노테이션 사용하여 NativeQuery 구현 방법.

```java
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "SELECT * FROM products WHERE price >= :minPrice", nativeQuery = true)
    List<Product> findProductsAboveMinPrice(@Param("minPrice") Double minPrice);
}
```

### **createNativeQuery 메서드**

EntityManager를 사용하여 NativeQuery를 실행하는 방법.

```java
@Repository
public class ProductRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Product> findProductsAboveMinPrice(Double minPrice) {
        Query query = entityManager.createNativeQuery("SELECT * FROM products WHERE price >= :minPrice", Product.class);
        query.setParameter("minPrice", minPrice);

        return query.getResultList();
    }
}
```

### **NamedNativeQuery 작성**

Entity 클래스에 미리 NativeQuery를 작성해 두는 방법.

```java
@Entity
@NamedNativeQueries({
    @NamedNativeQuery(
        name = "Product.findAboveMinPrice",
        query = "SELECT * FROM products WHERE price >= :minPrice",
        resultClass = Product.class
    )
})
@Table(name = "products")
public class Product {
    // ... (다른 필드와 메서드들)
}
```

*Repository 인터페이스에서 정의해둔 NamedQuery사용.*
