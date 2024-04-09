# slack_for_summoners

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)

## Introduction
This project is a Slack notification project for the game, Summoners War: Chronicles.

## Installation
Installation method to run the project on your local machine.

### Prerequisites
You must have [Node.js](https://nodejs.org/) installed on your system.

### Setup
1. **Clone the repository:**
    ```bash
    git clone https://github.com/dkfqkeorkfl/style.git
    ```
2. **Go to project directory:**
    ```bash
    cd style/slack_for_summoners
    ```
3. **Updating npm packages:**
    ```bash
    npm update
    ```
4. **Running the application:**
    ```bash
    npm start
    ```

5. **Create a `.env` file with the following configuration values:**
    Create a file named `.env` in the root directory of the project and fill it with the following key-value pairs:
    ```plaintext
    SID=google sheet key
    GID=google sheet id
    GOOGLEAPI_KEY=google api key
    SLACK_TOKEN=slack token
    ```
    This file will store your environment variables, which are essential for the application's configuration.

## Usage
This project provides two functions.

1) We crawl notices from the official website and notify Slack when new notices are registered.

2) Register the key and value in Google Sheet and connect to slack commands through API.
   When a key is requested, the registered value is provided. Yes/What is the damage formula?
