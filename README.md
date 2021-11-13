# Set up instructions
1. Set updata base
    * Run `npx sequelize-cli db:migrate`
2. Install dependencies
    * Run `npm install`
3. Start server
    * Run `npm start`
npx sequelize-cli db:migrate:undo

## APIs

> Users

| Route | Method | Functionality |
| :--- | :---: | ---: |
| `/api/v1/users/login` | POST | Login user |
| `/api/v1/users/logout` | GET | Logout |
| `/api/v1/users/:email/events` | GET | Retrive all notification perference for a user |
| `/api/v1/users/signup` | POST | Sign up a user |
| `/api/v1/users/:email` | DELETE | Delete a user |


> Events

| Route | Method | Functionality |
| :--- | :---: | ---: |
| `/api/v1/events` | POST | Add new notification perference |

> Health

| Route | Method | Functionality |
| :--- | :---: | ---: |
| `/hello` | GET | Health check :) |


## P.S.
to cascade delete for events, when user is deleted
all successful response must be json


