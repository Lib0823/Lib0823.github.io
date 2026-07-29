---
title: 'Quartz 스케줄러'
description: 'Quartz는 Java로 작성된 오픈소스 스케줄링 라이브러리이다.'
date: 2023-09-24
category: 'Language'
tags: ['Java', 'Quartz']
draft: false
---

> Quartz는 Java로 작성된 오픈소스 스케줄링 라이브러리이다.

![Quartz 스케줄러](./quartz-1.jpg)

Quartz를 사용하여 Java 애플리케이션에서 작업을 예약하고 관리할 수 있으며, 복잡한 작업 예약 및 스케줄링을 간편하게 처리할 수 있도록 도와준다.

*라이브러리 추가.*

```xml
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.2</version> <!-- 최신 버전을 확인하여 업데이트 가능 -->
</dependency>
```

#### 구조

**Job**

- 실행할 작업을 나타내는 인터페이스로 execute 메서드를 구현하여 작업 내용을 정의한다.

**JobDetail**

- Job을 실행하기 위한 상세 정보를 가진 객체로, Job 클래스와 그룹명, JobData 등을 포함한다.

**Scheduler**

- 작업의 실행과 관리를 담당하는 핵심 컴포넌트로, JobDetail과 Trigger를 관리하여 작업을 스케줄링한다.

**Trigger**

- Job을 실행하는 시점을 정의하며, 특정 시간, 주기적으로 또는 특정 이벤트 발생 시점에 작업을 실행한다.

**JobData**

- Job에게 데이터를 전달하기 위한 객체로, JobDetail이나 Trigger에 설정하여 Job내에서 활용할 수 있다.

**JobListener**

- Job의 실행 전/후 등의 이벤트를 감지하고 처리하기 위한 리스너로, Job 실행 상태에 따라 추가 동작을 수행할 수 있다.

*Example >*

> Job 클래스 생성 (할일)

```java
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class MyJob implements Job {
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        // JobDataMap에서 데이터를 가져온다.
        JobDataMap dataMap = context.getJobDetail().getJobDataMap();
        
        // 데이터 사용
        String param1 = dataMap.getString("param1");
        int param2 = dataMap.getInt("param2");
        
        System.out.println("param1: " + param1);
        System.out.println("param2: " + param2);
    }
}
```

> Trigger, Scheduler 세팅 (실행 주기)

```java
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;

public class Main {
    public static void main(String[] args) throws SchedulerException {
        Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();

        JobDetail jobDetail = JobBuilder.newJob(MyJob.class)
        .withIdentity("myJob", "group1")
        .usingJobData("param1", "value1") // 데이터 전달
        .usingJobData("param2", 123)      // 다른 타입의 데이터도 가능
        .build();

        Trigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("myTrigger", "group1")
        .withSchedule(CronScheduleBuilder.cronSchedule("0 0 12 ? * WED")) // 매주 수요일 12시에 실행
        .build();

        scheduler.scheduleJob(jobDetail, trigger);

        scheduler.start();
    }
}
```

> Listener 등록 (추가 작업)

```java
public class MyJobListener implements JobListener {
    @Override
    public String getName() {
        return "myJobListener";
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
        System.out.println("작업이 실행되기 전");
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
        System.out.println("작업이 실행되지 않음");
    }

    @Override
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
        System.out.println("작업이 실행된 후");
    }
}
```

<u>스케줄러 동적 제어</u>

```
# 작업 일시 중지
scheduler.pauseJob(JobKey.jobKey("myJob", "group1"));

# 작업 재개 
scheduler.resumeJob(JobKey.jobKey("myJob", "group1"));

# 작업 삭제
scheduler.deleteJob(JobKey.jobKey("myJob", "group1"));

# 스케줄러 종료
scheduler.shutdown();
```
