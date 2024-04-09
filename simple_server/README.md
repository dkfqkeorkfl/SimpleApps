# TestCode

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [API Specifications](#api-specifications)

## Introduction
이 코드는 매니저가 학교를 만들고 학생이 이를 구독하는 간단한 Backend 구현을 
작성한 코드로 이 코드를 통하여 개발자의 코드 스타일을 볼 수 있습니다.

이 코드는 간단하게 구현했으므로 DB연결을 직접적으로 하지 않으며 CSV를 가지고 DB를 표현하였으며 
Client는 최대한 간단하게 만들기 위하여 JWT말고 별도로 캐싱하는 데이터가 거의 없습니다.

실제 서비스를 위한 코드를 구현하기 위하여 다음을 추가로 구현할 수 있습니다:
- TLS 적용
- DDoS 공격 방지를 위한 방화벽
- RDB 및 NoSQL을 사용한 캐시 서버
- DB의 소실을 막기 위한 백업DB
- DB Injection을 막기 위한 SQLi적용
- 이상 징후를 감지하기 위한 로깅 DB
- 실시간 업데이트 알림을 위한 WebSocket
- 업무 분담을 위한 Router wrap
- 그 외: 마이크로서비스, CDN, 각종 보안 및 개발 속도 향상을 위한 라이브러리

## Installation
로컬 머신에서 프로젝트를 실행하기 위한 설치 방법입니다.

### Prerequisites
시스템에 [Node.js](https://nodejs.org/)가 설치되어 있어야 합니다.

### Setup
1. **레포지토리 클론하기:**
    ```bash
    git clone https://github.com/dkfqkeorkfl/style.git
    ```
2. **프로젝트 디렉토리로 이동하기:**
    ```bash
    cd style/simple_server
    ```
3. **npm 패키지 업데이트하기:**
    ```bash
    npm update
    ```
4. **애플리케이션 실행하기:**
    ```bash
    npm start
    ```

## Usage

이 애플리케이션은 사용자가 시스템과 상호작용할 수 있는 다양한 명령어를 제공합니다. 아래는 프로그램 내에서 각각의 사용 가능한 명령어를 사용하는 방법에 대한 가이드입니다.

### Available Commands:

1. **sign up**: 새로운 사용자를 시스템에 등록합니다.
2. **login**: 기존 사용자 계정으로 시스템에 로그인합니다.

#### Manager-Specific Commands
(이 명령어들은 관리자 역할을 가진 사용자만 사용할 수 있습니다.)
1. **create school**: 새로운 학교를 생성합니다.
2. **create post**: 학교에 새로운 공지나 업데이트를 게시합니다.
3. **update post**: 기존의 게시물이나 공지를 수정합니다.
   
#### Student-Specific Commands
(이 명령어들은 학생 역할을 가진 사용자만 사용할 수 있습니다.)
1. **subscribe**: 특정 학교의 업데이트를 구독합니다.
2. **unsubscribe**: 학교 업데이트 구독을 취소합니다.
3. **Check post**: 구독한 학교의 업데이트를 확인합니다.
4. **view post-all**: 구독한 모든 학교의 게시물을 확인합니다.

### Process Flow:

1. **사용자 등록 및 로그인**:
    - 시스템을 사용하기 위해서는 `sign up` 명령어를 사용하여 새로운 사용자 계정을 만들어야 합니다. 필요한 데이터로 `account`, `password`, `is_student`, `nick` 등을 입력하라는 프롬프트가 나타납니다.
    - 등록 후 `login` 명령어와 `account` 및 `password`를 사용하여 시스템에 로그인합니다.

2. **관리자 및 학생 메뉴**:
    - **관리자**로 로그인한 경우, `3`에서 `5`까지의 명령어를 사용하여 학교 및 게시물을 생성, 업데이트 및 관리할 수 있습니다.
    - **학생** 계정으로 로그인한 경우, `6`에서 `9`까지의 명령어를 사용하여 학교를 구독하거나 구독을 취소하고, 게시물을 확인하거나 모든 게시물을 볼 수 있습니다.

3. **데이터 입력**:
    - 명령어를 선택한 후, 프로그램은 선택한 작업에 필요한 데이터를 입력하라는 요청을 합니다. 예를 들어, 게시물을 생성하는 경우 학교 ID, 제목, 게시물 내용 등의 세부 정보가 필요합니다.

4. **응답**:
    - 선택한 명령어에 대한 데이터 입력을 완료하면, 시스템은 요청을 처리하고 작업의 성공 여부와 관련 데이터 또는 오류 메시지를 포함한 응답을 제공합니다.

이 가이드를 통해 시스템의 기능을 효과적으로 탐색하는 데 도움이 되길 바랍니다. 각 명령어의 구체적인 사용 예시는 [API 명세](#api-specifications) 섹션에서 확인할 수 있습니다.

## API Specifications
애플리케이션에서 제공하는 각 API 엔드포인트에 대한 명세입니다.

### [Signup API](#signup-api)
- **Method:** `POST`
- **Path:** `/signup`
- **Parameters:**
  - `account`: 사용자 ID
  - `password`: 계정 비밀번호
  - `is_student`: 학생(`true`), 관리자(`false`). 관리자는 학교와 포스트를 생성할 수 있으며 학생은 구독할 수 있습니다.
  - `nick`: 닉네임
- **Error Codes:**
  - `400`: 이미 존재하는 ID

### [Login API](#login-api)
- **Method:** `POST`
- **Path:** `/login`
- **Parameters:**
  - `account`: 사용자 ID
  - `password`: 계정 비밀번호
- **Error Codes:**
  - `400`: 사용자를 찾을 수 없습니다.
  - `403`: 비밀번호가 틀렸습니다.

---
 
### [School List API](#school-list-api)
- **Method:** `GET`
- **Path:** `/school`
- **Description:** 현재 개설되어 있는 모든 학교의 목록을 받아옵니다.

### [Create School API](#create-school-api)
- **Method:** `POST`
- **Path:** `/school/own`
- **Parameters:**
  - `name`: 학교 이름
  - `local`: 학교 지역
- **Error Codes:**
  - `403`: 권한이 없습니다.
  - `400`: 이미 존재하는 학교입니다.

### [Update Own School API](#update-own-school-api)
- **Method:** `PUT`
- **Path:** `/school/own`
- **Parameters:**
  - `school`: 학교 ID
  - `disable`: 학교 비활성화 여부 (기본값: `false`)
- **Error Codes:**
  - `403`: 권한이 없습니다.

### [Get Own Schools API](#get-own-school-api)
- **Method:** `GET`
- **Path:** `/school/own`
- **Description:** 매니저가 소유한 학교의 목록을 가져옵니다.
- **Error Codes:**
  - `403`: 권한이 없습니다.

### [Create Post API](#create-post-api)
- **Method:** `POST`
- **Path:** `/school/own/post`
- **Parameters:**
  - `school`: 학교 ID
  - `title`: 게시글 제목
  - `contents`: 게시글 내용
- **Error Codes:**
  - `403`: 권한이 없습니다.
  - `404`: 해당 학교가 존재하지 않습니다.

### [Get Own Post API](#get-own-post-api)
- **Method:** `GET`
- **Path:** `/school/own/post`
- **Description:** 매니저가 생성한 게시글의 ID를 가져옵니다.
- **Error Codes:**
  - `403`: 권한이 없습니다.

### [Update Own Post API](#update-own-post-api)
- **Method:** `PUT`
- **Path:** `/school/own/post`
- **Parameters:**
  - `post`: 게시글 ID
  - `title`: 수정할 게시글 제목
  - `contents`: 수정할 게시글 내용
  - `disable`: 게시글 삭제 여부 (기본값: `false`)
- **Error Codes:**
  - `403`: 권한이 없습니다.
  - `404`: 해당 게시글이 존재하지 않습니다.

---

### [Subscribe API](#subscribe-api)
- **Method:** `POST`
- **Path:** `/student/subscribe`
- **Parameters:**
  - `school`: 학교 ID
- **Error Codes:**
  - `403`: 권한이 없습니다.
  - `404`: 해당 학교가 존재하지 않습니다.

### [Unsubscribe API](#unsubscribe-api)
- **Method:** `PUT`
- **Path:** `/student/unsubscribe`
- **Parameters:**
  - `school`: 학교 ID
- **Error Codes:**
  - `403`: 권한이 없습니다.
  - `404`: 해당 학교가 존재하지 않습니다.

### [Subscription List API](#subscription-list-api)
- **Method:** `GET`
- **Path:** `/student/subscribe`
- **Description:** 학생이 구독 중인 학교의 목록을 가져옵니다.
- **Error Codes:**
  - `403`: 권한이 없습니다.

### [Get Posts API](#get-posts-api)
- **Method:** `GET`
- **Path:** `/student/post`
- **Parameters:**
  - `school`: 학교 ID
- **Description:** 학생이 구독 중인 학교의 게시글을 가져옵니다.
- **Error Codes:**
  - `403`: 권한이 없습니다.
  - `404`: 해당 학교가 존재하지 않습니다.
