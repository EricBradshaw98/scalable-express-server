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
POST /api/auth/register SENDS EMAIL to confirm account
POST /api/auth/reset-password RESET PASSWORD WITH 1 time token
POST api/auth/forgot-password SENDS EMAIL TO RESET PASSWORD
GET api/auth/confirm/:token Confirm User account  when accessed




GET /api/users GET ALL USERS
GET /api/users/id VIEW A USER
POST /api/users CREATE A USER
PUT /api/users/id EDIT A USER
DELETE /api/users/id DELETE A USER


GET /api/posts GET ALL posts
GET /api/posts/id VIEW A POST
POST /api/posts CREATE A POST
PUT /api/posts/id EDIT A POST
DELETE /api/posts/id DELETE A POST



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
