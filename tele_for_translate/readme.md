# tele_for_translate

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)

## Introduction
This project is an automatic translation program created to comfortably converse with foreigners on Telegram.

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
    cd style/tele_for_translate
    ```
3. **Updating npm packages:**
    ```bash
    npm update
    ```
4. **Running the application:**
    ```bash
    npm start
    ```

5. **Fill in configuration file values:**
    ```bash
    .env
    FILENAME=languages.csv
    GOOGLEAPI_KEY=google api key
    TELE_TOKEN=telegram bot token
    ```

## Usage
This project provides only one feature.

In the FILENAME imported file, the following examples are provided:
[ru,ko], [ko,ru] This setting means that if Russian is input, it is converted into Korean and vice versa. 
When no setting is provided, English appears by default.
