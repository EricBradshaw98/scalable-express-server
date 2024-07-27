# Project Title

A brief description of what this project does and who it's for.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Additional Sections](#additional-sections)

## Installation

Instructions for setting up your project locally. You might include:

1. Clone the repository
    ```sh
    git clone https://github.com/your_username/your_project.git
    ```
2. Navigate to the project directory
    ```sh
    cd your_project
    ```
3. Install dependencies
    ```sh
    npm install
    ```

## Usage

Examples and instructions on how to use your project.


ROUTES


POST /api/auth/logout LOGOUT TOKEN AND BLACKLIST
POST /api/auth/login LOGIN WITH TOKEN
POST /api/auth/register

GET /api/users GET ALL USERS
GET /api/users/id VIEW A USER
POST /api/users CREATE A USER
PUT /api/users/id EDIT A USER
DELETE /api/users/id DELETE A USER

GET /api/uploads/download/:id'    downloadFile
GET /api/uploads/documents  getAllDocuments
GET /api/uploads/documents/:id      getDocumentsById
POST /api/uploads/upload-single   uploadSingleFile
POST /api/uploads/upload-multiple  uploadMultipleFiles
DELETE /api/uploads/delete/:id      deleteFile
PUT /api/uploads/rename/:id { newFilename: "test.csv"} RENAME UPLOADED FILE

GET api/messages GET ALL MESSAGES 
GET api/messages/:id GET MESSAGE
POST api/messages CREATE MESSAGE & CONVERSATION IF NECESSARY
DELETE api/messages/:id DELETE MESSAGE
PUT api/messages/:id UPDATE MESSAGE

GET api/conversations GET ALL CONVERSATIONS
GET api/conversationsuser/:id GET CONVERSATIONS FOR USER ID WITH MESSAGES
GET api/conversations/:id GET CONVERSATION
POST api/conversations CREATE CONVERSATION
DELETE api/conversations/:id DELETE CONVERSATION
PUT api/conversations/:id   UPDATE CONVERSATION










```sh
node app.js
