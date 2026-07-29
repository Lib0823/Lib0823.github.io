---
title: 'File로 간단하게 DB Table 백업하기'
description: '개발하다 데이터를 잠깐 백업해야 하는데 pgdump..등 사용하기 귀찮을 때 간단하게 백업하는 방법'
date: 2024-10-22
category: 'Database'
tags: ['PostgreSQL', 'Copy']
draft: false
---

> 개발하다 데이터를 잠깐 백업해야 하는데 pg\_dump..등 사용하기 귀찮을 때 간단하게 백업하는 방법

![File로 간단하게 DB Table 백업하기](./file-db-table-1.jpg)

### 1. 테이블 데이터 백업하기 (Backup)

PostgreSQL에서 COPY + TO 명령어를 사용하여 테이블 데이터를 파일로 백업할 수 있다.

```sql
#COPY {schema.table} TO '{backup_path}' DELIMITER ',' CSV HEADER

COPY test.user TO '/path/to/backup/user.csv' DELIMITER ',' CSV HEADER;
```

### 2. 백업 데이터 복구 (Restore)

백업된 CSV 파일을 다시 테이블로 복구하려면 COPY + FROM 명령어를 사용하여 데이터를 복구할 수 있다.

```sql
# COPY {schema.table} FROM '{file_path}' DELIMITER ',' CSV HEADER;

COPY test.user FROM '/path/to/backup/user.csv' DELIMITER ',' CSV HEADER;
```

#### 명령어 설명

**COPY**

- 테이블의 데이터를 파일로 내보내거나, 파일의 데이터를 가져올 때 사용

**TO**

- 테이블 데이터를 내보낼 파일의 경로와 파일명 지정

**FROM**

- 데이터를 가져올 파일의 경로와 파일명 지정

**DELIMITER**

- 파일에 데이터가 저장될 때의 구분자 지정

**CSV**

- 데이터를 CSV 형식의 파일로 내보낸다 (가져온다)

**HEADER**

- 파일의 첫번째 줄에 테이블의 열 이름을 포함시키는 옵션

**백업 시 주의 사항**

> PostgreSQL에서 파일을 읽거나 쓰려면, COPY 명령어는 서버가 접근할 수 있는 경로에만 파일을 저장하거나 읽을 수 있다. 즉, COPY가 정상적으로 실행되지 않는다면 해당 경로의 사용자 권한 확인이 필요하다.

*- 끝 -*
