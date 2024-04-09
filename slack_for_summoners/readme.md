# slack_for_summoners

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)

## Introduction
이 프로젝트는 게임, 서머너즈워:크로니클에 대한 Slack 알림 프로젝트입니다.

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
    cd style/slack_for_summoners
    ```
3. **npm 패키지 업데이트하기:**
    ```bash
    npm update
    ```
4. **애플리케이션 실행하기:**
    ```bash
    npm start
    ```

5. **설정파일 값을 채우기:**
    ```bash
    SID=google sheet key
    GID=google sheet id
    GOOGLEAPI_KEY=google api key
    SLACK_TOKEN=slack token
    ```

## Usage
이 프로젝트는 2가지의 기능을 제공합니다.

1) 공식 홈페이지에서 공지사항을 크롤링하여 공지가 새로이 등록되면 슬랙에 알림을 줍니다.
2) 
3) 구글 시트에 key, value를 등록해놓고 slack commands에 api로 연결을 해놓고 
   key를 요청 받으면 등록해놓은 value를 알려줍니다. 예/데미지 공식은?


