# API Documentation

## Authentication

### Login
- **Endpoint:** `/api/v1/auth/login`
- **Method:** POST
- **Description:** User login

### Logout
- **Endpoint:** `/api/v1/auth/logout`
- **Method:** POST
- **Description:** User logout

## Homework Management

### List Homework
- **Endpoint:** `/api/v1/homework/list`
- **Method:** GET
- **Description:** List all homework assignments

### Submit Homework
- **Endpoint:** `/api/v1/homework/submit`  
- **Method:** POST
- **Description:** Submit homework

### View Homework
- **Endpoint:** `/api/v1/homework/view`
- **Method:** GET  
- **Description:** View homework details

### Modify Homework
- **Endpoint:** `/api/v1/homework/modify`
- **Method:** PUT
- **Description:** Modify homework details

### Delete Homework
- **Endpoint:** `/api/v1/homework/delete`
- **Method:** DELETE
- **Description:** Delete homework (for class representative, admin and teacher)

### Reply to Homework
- **Endpoint:** `/api/v1/homework/reply`
- **Method:** POST
- **Description:** Teacher reply to homework

### Create Homework
- **Endpoint:** `/api/v1/homework/create`
- **Method:** POST
- **Description:** Create new homework

## Submission Management

### List Submissions by Time
- **Endpoint:** `/api/v1/submission/list/time`
- **Method:** GET
- **Description:** List all submissions sorted by time

### List All Submissions
- **Endpoint:** `/api/v1/submission/list/all`
- **Method:** GET
- **Description:** List all submissions sorted by student name

### Export Submissions
- **Endpoint:** `/api/v1/submission/export`
- **Method:** POST
- **Description:** Export submission statistics to Excel

## System Management

### View Logs
- **Endpoint:** `/api/v1/logs/view`
- **Method:** GET
- **Description:** View system logs

### Export Logs
- **Endpoint:** `/api/v1/logs/export`
- **Method:** GET
- **Description:** Export system logs to Excel

### Modify System Settings
- **Endpoint:** `/api/v1/system/modify`
- **Method:** PUT
- **Description:** Modify system settings (file size, number, type etc.)

## User Management

### List Users
- **Endpoint:** `/api/v1/users/list`
- **Method:** GET
- **Description:** List all users

### Add User
- **Endpoint:** `/api/v1/users/add`
- **Method:** POST
- **Description:** Add a new user

### Delete User
- **Endpoint:** `/api/v1/users/delete`
- **Method:** DELETE
- **Description:** Delete a user

### Modify User
- **Endpoint:** `/api/v1/users/modify`
- **Method:** PUT
- **Description:** Modify user details
