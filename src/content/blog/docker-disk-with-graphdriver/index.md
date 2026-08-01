---
title: '컨테이너 Disk 사용량 확인하기 (with. GraphDriver)'
description: '컨테이너를 생성할 때 볼륨을 disk에 마운트 해놨다면 마운트된 경로의 disk 사용량을 du -sh 로 간단하게 해당 경로에 마운트된 컨테이너들의 용량을 확인할 수 있다.'
date: 2025-04-02
category: 'Infrastructure'
tags: ['Docker']
draft: false
---

- 컨테이너를 생성할 때 볼륨을 disk에 마운트 해놨다면 마운트된 경로의 disk 사용량을 du -sh 로 간단하게 해당 경로에 마운트된 컨테이너들의 용량을 확인할 수 있다.

(여러 컨테이너가 같은 경로에 마운트된 경우 특정 컨테이너의 disk 사용량을 확인하기 힘듬)

마운트 하지 않은 경우

- 디스크 마운트 없이 컨테이너를 실행하면, 컨테이너 내에서 생성되는 모든 데이터는 docker 호스트의 파일 시스템에 저장된다.

구체적으로, 데이터는 Docker 호스트 시스템의 그래프 드라이버에 의해 관리되는 특정 디렉터리(예: overlay2, aufs, btrfs 등)에 저장된다.

1. 그래프 드라이버란?

그래프 드라이버는 Docker의 파일 시스템 레이어를 관리하는 방식을 정의하는 도구다. 여러 종류의 그래프 드라이버가 있으며, 각 드라이버는 Docker가 파일 시스템 레이어를 어떻게 처리할지를 결정한다.

파일 시스템 레이어는 여러 계층으로 구성된 파일 시스템 구조로 컨테이너가 실행될 때 여러 레이어를 결합하여 최종 파일 시스템을 제공한다.

2. 주요 그래프 드라이버 종류

Docker는 다양한 파일 시스템 드라이버를 지원하며, 각 드라이버는 레이어를 다루는 방식이 다르다. 주로 사용되는 그래프 드라이버는 다음과 같다:

- overlay2 (가장 일반적이며 현재 대부분의 시스템에서 기본 드라이버로 사용됨)

- aufs

- btrfs

- zfs

- devicemapper

3. Overlay2 그래프 드라이버

**overlay2**는 Docker의 오버레이 파일 시스템을 기반으로 한 드라이버로, Linux에서 매우 효율적인 파일 시스템을 제공한다. overlay2는 Copy-on-Write(COW) 방식을 사용하여 효율적으로 파일 시스템을 관리한다.

### Overlay2의 작동 방식

overlay2는 읽기 전용 이미지(base image)와 쓰기 가능한 레이어(container layers)로 구성된 계층적 구조로 작동한다. 컨테이너를 생성할 때마다 새로운 레이어가 추가된다. 이 구조는 크게 LowerDir, UpperDir, MergedDir, WorkDir로 나눌 수 있다.

3-1. LowerDir (읽기 전용 레이어)

기본 이미지의 파일이 위치한 곳이다.

여러 개의 읽기 전용 레이어로 구성되며, 일반적으로 Docker 이미지가 생성될 때 이곳에 저장된다.

LowerDir에 저장된 파일들은 다른 컨테이너가 읽을 수 있으며, 읽기 전용이기 때문에 변경할 수 없다.

3-2. UpperDir (쓰기 가능한 레이어)

컨테이너에서 파일을 변경하거나 새로 생성한 내용은 UpperDir에 저장된다.

각 컨테이너마다 독립적인 UpperDir가 존재하며, 여기서 변경된 내용은 컨테이너가 종료되기 전까지 지속된다.

예를 들어, 컨테이너 내에서 파일을 수정하거나 생성할 때, 그 변경 사항은 UpperDir에 저장된다.

3-3. MergedDir (병합된 디렉터리)

**LowerDir**의 읽기 전용 파일과 **UpperDir**의 쓰기 가능한 파일이 병합된 파일 시스템을 제공한다.

실제로 컨테이너가 파일 시스템을 액세스할 때 사용되는 디렉터리다. 사용자는 여기에서 파일을 보고, 수정할 수 있다.

3-4. WorkDir (작업 디렉터리)

파일 시스템 병합을 위해 사용하는 임시 작업 디렉터리다.

파일 시스템의 변경 작업, 즉 Copy-on-Write 작업을 수행할 때 필요한 공간이다.

실제로 컨테이너의 운영 중에 사용되며, 사용자에게는 직접적으로 노출되지 않는다.

4. 정리

결론적으로 컨테이너 생성 시 disk를 마운트하지 않으면 docker 호스트의 그래프 드라이버에 의해 관리되는 특정 디렉터리에 저장된다.

overlay 기본 경로 : /var/lib/docker/overlay2

(docker 설정에 의해 변경될 수 있음)

Ex) 아래와 같은 형태로 저장되며 내부에는 lower, upper, work 등의 서브 디렉터리가 존재한다.

drwx--x--- 4 root root 4096 Jul 17 2024 00692c73d754d62515fb2aeb1742a846acaf9053188c13d9ac6368df30e249df/

drwx--x--- 4 root root 4096 Aug 10 2023 0069f404653127083081a9c36dc3f8f8de45533c5e331cd06c115bc2a71b6319/

5. 그럼 컨테이너의 용량 확인은 어떻게 가능한가?

overlay2의 하위에 있는 디렉터리들은 각각의 컨테이너에 대한 오버레이 디스크임으로 du로 해당 경로의 disk 사용량을 확인하면 된다.

※각각의 오버레이 디스크의 용량이 어떤 컨테이너의 오버레이인지 어떻게 알 수 있을까?

```
docker inspect {컨테이너ID}
```

**inspect** 명령어로 해당 컨테이너에 대한 상세 정보를 까보면 GraphDriver에 대한 정보를 확인할 수 있다.

```
"GraphDriver": {
            "Data": {
                "LowerDir": "/data/_DOCKERROOT/overlay2/b318bbb585048dcb9e33ab7df81a09f760ff4c1138a858e89770e55dc207d659-init/diff:/data/_DOCKERROOT/overlay2/1f583edf65a810dc7b45eec1e4b3f7a92b4ef39d76594b17b0210ccee83a3ec4/diff:/data/_DOCKERROOT/overlay2/25ccd76f61c4fdebe1e388a86e8f0b78323b8fd2b883d65c94fced8f31ad8be4/diff:/data/_DOCKERROOT/overlay2/a64ba99b5f17e27172cf6f940ed99aa0bee8673e9b2dcd9f76e62b7c362cb0cf/diff",
                "MergedDir": "/data/_DOCKERROOT/overlay2/b318bbb585048dcb9e33ab7df81a09f760ff4c1138a858e89770e55dc207d659/merged",
                "UpperDir": "/data/_DOCKERROOT/overlay2/b318bbb585048dcb9e33ab7df81a09f760ff4c1138a858e89770e55dc207d659/diff",
                "WorkDir": "/data/_DOCKERROOT/overlay2/b318bbb585048dcb9e33ab7df81a09f760ff4c1138a858e89770e55dc207d659/work"
            },
            "Name": "overlay2"
        }
```

여기서 레이어에 매핑된 경로를 확인하여 해당 컨테이너가 어떤 오버레이 디스크를 바라보고 있는지 알 수 있다.

이렇게 각 컨테이너의 오버레이 디스크 경로를 확인하여 disk 용량을 확인할 수 있지만 스크립트로 한번에 확인하는 것이 좋다..

[shell 스크립트]

```bash
#!/bin/bash
# Bash 스크립트 시작 선언

containers=$(docker ps -q)
# 현재 실행 중인 모든 컨테이너 ID만 추출 (quiet 모드)

for container in $containers; do
  # 각 컨테이너 ID에 대해 반복

  container_name=$(docker inspect --format '{{.Name}}' $container | sed 's/^\///')
  # 컨테이너의 이름을 가져오고, 앞에 붙은 '/'를 제거 (ex. "/my-container" → "my-container")

  upperdir=$(docker inspect --format '{{.GraphDriver.Data.UpperDir}}' $container)
  # overlay2 드라이버의 UpperDir 경로를 가져옴 (해당 컨테이너가 실제로 쓴 파일이 저장된 디렉터리)

  if [ -z "$upperdir" ]; then
    # UpperDir가 비어있는 경우 (정보가 없거나 overlay2 드라이버가 아님)
    echo "Container: $container_name($container) - No UpperDir found"
    continue
    # 해당 컨테이너는 건너뜀
  fi

  usage=$(du -sh "$upperdir" 2>/dev/null | cut -f1)
  # UpperDir 경로의 디스크 사용량을 계산 (사람이 읽기 쉬운 형식, 예: 120M)
  # 에러 출력은 무시하며, 경로 제외하고 용량만 출력

  echo "Container: $container_name($container) - $usage"
  # 컨테이너 이름, ID, 디스크 사용량 출력

done | sort -rh -k1
# 전체 결과를 디스크 사용량 기준으로 내림차순 정렬
# '-h': 단위(M, G 등)를 고려해 정렬 / '-r': 내림차순 / '-k1': 첫 번째 열 기준
```

스크립트를 실행하면 실행중인 모든 컨테이너에 대한 오버레이 디스크 용량을 한번에 확인할 수 있다.

> 중지된 컨테이너까지 확인하고 싶다면 4번째 라인의 docker ps를 docker ps -a로 변경하면 된다.

여기까지 마운트되지 않은 디스크의 실제 용량을 확인하는 방법인데 사실 도커에서는 해당 내용이 명령어로 제공된다.

```
docker ps -a --size
```

**docker ps --size** 명령어는 컨테이너의 쓰기 계층(writable layer) 즉, overlay2의 UpperDir의 크기를 보여주기 때문에 위의 쉘 스크립트와 동일한 동작을 한다고 볼 수 있으며, 이미지 레이어 전체를 포함한 Virtual size를 확인할 수 있다.

하지만 직접 스크립트를 작성하여 사용하면 필요에 따라 정렬, 필터링 등의 작업을 유연하게 처리할 수 있으며, du 명령어로 실제 디스크 사용량을 더 정확하게 확인할 수 있다.
