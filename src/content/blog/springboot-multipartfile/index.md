---
title: 'MultipartFile 업로드/다운로드 하기'
description: 'SpringBoot에서 MultipartFile 저장하고, 다운로드 받기'
date: 2023-09-05
category: 'Backend'
tags: ['Spring', 'File', 'MultipartFile', 'spring boot']
draft: false
---

*SpringBoot에서 MultipartFile 저장하고, 다운로드 받기*

## **# File Upload**

#### <u>**Controller**</u>

1. controller에서 요청을 받을 때 MultipartHttpServletRequest 타입으로 request를 받아야 한다.

2. 파일과 같이 request body를 받아야 한다면 String타입으로 받은 후 Gson객체를 이용해 형변환 해야한다.

3. front에서 api요청 시 보낸 파일의 변수명으로 파일을 꺼내온다. > request.getFile("???")

```java
@RequestMapping(value = "/registerPrivacyResult", method = RequestMethod.POST)
    public BaseResult registerPrivacyResult(MultipartHttpServletRequest request, @RequestBody String params){
        BaseResult result;
        // Gson 객체를 이용하여 params를 json(Dto)타입으로 변환
        Gson gson = new Gson();
        // file이 null인지 확인 필요
        MultipartFile file = request.getFile("file");
        
        result = ~~Service.saveFile(file);
        return result;
    }
```

#### <u>**Service**</u>

4. file에서 파일명, 확장자, 암호화(저장될)파일명을 추출하고, 정상적인지 체크한다.

5. 파일을 저장할 경로를 Path에 세팅(ex. /test/fileupload) 한 후 해당 경로로 파일 저장 > .transferTo()

6. 마지막으로 다운로드를 위해 저장한 파일의 파일명, 암호화 파일명, 파일 경로를 DB에 저장한다.

```java
public PrivacyFile saveFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("업로드된 파일이 비어 있습니다.");
        }

        try {
            PrivacyFile privacyFile = new PrivacyFile();

            // 고유한 파일 이름 생성 (UUID 사용)
            String originalFileName = file.getOriginalFilename(); // 원본 파일명
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")); // 확장자 추출
            String savedFileName = UUID.randomUUID().toString() + fileExtension; // 암호화 파일명

            log.debug("file name: {}", originalFileName);
            int nameLen = originalFileName.length();
            if (nameLen > 100) {
                throw new RuntimeException("업로드 파일 이름이 너무 깁니다. 최대 사이즈 : 100");
            }

            if (!originalFileName.contains(".")) {
                throw new RuntimeException("허용되지 않는 파일 타입 입니다.");
            }

            // 파일 확장자 종류 체크
            String extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1, nameLen).toLowerCase();
            log.debug("file ext: {}", extension);
            String[] uploadAllowExts = uploadAllowExt.split(",");
            boolean isPass = false;
            for (String ext : uploadAllowExts) {
                if (ext.equals(extension)) {
                    isPass = true;
                    break;
                }
            }
            if (!isPass) {
                throw new RuntimeException("허용되지 않는 파일 타입 입니다");
            }

            // 파일 저장 경로 설정
            Path directoryPath = Paths.get(uploadPath);
            if (Files.notExists(directoryPath, LinkOption.NOFOLLOW_LINKS)) {
                Files.createDirectories(directoryPath);
            }
            Path filePath = Paths.get(directoryPath.toString(), savedFileName);

            // 파일 저장
            //Files.createFile(filePath);
            Files.createDirectories(filePath.getParent());
            file.transferTo(filePath.toFile());

            privacyFile.setRealFilename(originalFileName); // 파일명
            privacyFile.setEncryptedFilename(savedFileName); // 암호화 파일명
            privacyFile.setFilePath(uploadPath); // 파일 경로

            return privacyFile;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
        }
    }
```

## **# File Download**

#### <u>**Controller**</u>

1. 다운로드할 파일의 id를 파라미터로 받아온다.

4. ContentDisposition 타입의 객체를 생성하고 타입과 파일명을 설정한다.

5. ResponseEntity객체에 contentType, header, body를 각각 세팅하여 리턴해주면 끝.

```java
@RequestMapping(value = "/fileDown", method = RequestMethod.GET)
    public ResponseEntity<Resource> fileDown(@RequestParam String fileId){

		// fileId로 DB에 저장된 파일명, 암호화파일명, 저장경로 조회
        PrivacyFile file = ~~~Service.downloadFile(fileId);
        String savedPath = file.getFilePath();
        String savedName = file.getEncryptedFilename();
        
        // file resource 추출
        Resource resource = ~~Service.getResrouceAsFile(savedPath, savedName);

        String realFilename = file.getRealFilename();
        ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename(realFilename, StandardCharsets.UTF_8).build();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .cacheControl(CacheControl.noCache())
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(resource);
    }
```

#### <u>**Service**</u>

2. downloadFile) 다운받을 file의 파일명, 저장된파일명, 저장경로를 DB에서 fileId로 조회한다.

3. getResrouceAsFile) path와 filename을 합쳐 filePath를 만들어 FileInputStream()으로 resource를 생성한다.

```java
// 파일정보 DB 조회
public PrivacyFile downloadFile(String fileId) {

		PrivacyFile file = ~~Mapper.selectFileName(fileId);

        // 파일 다운로드
        try {
            Path filePath = Paths.get(file.getFilePath(), file.getEncryptedFilename());
            Resource resource = new org.springframework.core.io.FileSystemResource(filePath.toFile());
            file.setResource(resource);
            return file;

        } catch (Exception e) {
            throw new RuntimeException("파일 다운로드 중 오류가 발생했습니다.", e);
        }
    }
    
    
    // 파일 리소스 추출
    public Resource getResrouceAsFile(String path, String name){
        Path filePath = Paths.get(path, name);
        InputStreamResource resource;
        try {
            resource = new InputStreamResource(new FileInputStream(filePath.toFile()));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e.toString());
        }
        return resource;
    }
```
