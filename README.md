# 🔤 ABC Book
A book fan club, ABC Book, allows its members to borrow books from the club. Due to increasing membership, the club management needs a web console for easier management. It should be used by 3 types of users: Admin, Editor and Member.

## 1. 🛠️ Setup Instructions
  1. Run `npm install` in the root directory of project ➡ This will install the packages to run both the backend and frontend concurrently
  2. Run `npm install` in the [Backend folder](app-backend) ➡ This will install the packages to run the backend operations e.g. express, mongoose etc.
  3. Run `npm install` in the [Frontend folder](app-frontend) ➡ This will install the packages to run the frontend operations e.g. React, Typescript etc.

## 2. 💻 Backend

### 2.1 Available Scripts
  1. `npm start` will run the server
  2. `npm run dev` will run the server and watch for changes
  3. `npm run build` will build the TypeScript files into the [dist folder](app-backend/dist)
  4. `npm run seed:db` will seed mongodb with users and books for testing *(running this will give 2 admin users and 1 editor for testing)*
<br/>

**Note: All seed users have a default password of `Pass@123` which can be changed later on**

| Permission| Email          | Password |
|-----------|----------------|----------|
| admin     | admin@abc.com  | Pass@123 |
| admin     | saif@abc.com   | Pass@123 |
| editor    | editor@abc.com | Pass@123 |

### 2.2 Project Structure
The project is structured using mongoose to connect to mongodb uri and then starting the express server to accept client request and output and appropriate response to the request.
<br/>
<br/>
**Client Request ➡ Server ➡ Response**
<br/>
<br/>
The folder structure is as follows:
<br/>
<br/>
![image](https://user-images.githubusercontent.com/70659750/209903822-6485556b-4669-47b4-bd17-48209ca128ab.png)
<br/>
<br/>
**Note: I did not add the port number, jwt secret and some other environment variables to dotenv for easier development access**

### 2.3 API Design
The routes used in this project are broken down into 3 main ones /api/user, /api/book & /api/request. Middlewares such as authenticationCheck and authorizationCheck are added *(assuming that the api call is made with an Authorization Header)* to ensure that response is in accordance to the user group permissions.

#### User Routes
#### [User Model](app-backend/src/models/user.ts)
##### Unprotected Routes
| Name     | Method | Route              | Required                                                                     | Response                                                                                             |
|----------|--------|--------------------|------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| Login    | POST   | /api/user/login    | email: String<br>password: String                                            | 200: Return user object<br>500: Invalid password                                                     |
| Register | POST   | /api/user/register | email: String<br>name: String<br>password: String<br>confirmPassword: String | 200: Return user object<br>500: Email already used,<br>passwords don't match,<br>password not strong |

##### Authenticated Routes
| Name            | Method | Route                     | Required                                    | Response                                                           |
|-----------------|--------|---------------------------|---------------------------------------------|--------------------------------------------------------------------|
| Update Password | PUT    | /api/user/update-password | password: String<br>confirmPassword: String | 200: Message<br>500: Passwords don't match,<br>password not strong |

##### Editor Routes
| Name            | Method | Route         | Required                                                             | Response         |
|-----------------|--------|---------------|----------------------------------------------------------------------|------------------|
| Get All Users   | GET    | /api/user/all | Needs to be at least<br>editor role                                  | 200: User Array  |
| Get Single User | GET    | /api/user/:id | Needs to be at least editor<br>role<br>Needs to have correct user id | 200: User object |

##### Administrator Routes
| Name        | Method | Route                | Required                                                                                               | Response                                                               |
|-------------|--------|----------------------|--------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| Create User | POST   | /api/user/create     | Needs to be admin<br>name: String<br>email: String                                                     | 200: Make a request awaiting another<br>admin to approve user creation |
| Delete User | POST   | /api/user/delete/:id | Needs to be admin<br>id: String (id of person to be deleted)                                           | 200: Make a request awaiting another<br>admin to delete user           |
| Update User | POST   | /api/user/update/:id | Needs to be admin<br>id: String (id of person to be updated)<br>payload: Any user fields to be updated | 200: Make a request awaiting another<br>admin to update user           |

#### Book Routes
#### [Book Model](app-backend/src/models/book.ts)
#### [Borrow Model](app-backend/src/models/borrow.ts)
##### Authenticated Routes
| Name            | Method | Route                | Required                                                                                                                             | Response                                                                                                                                          |
|-----------------|--------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| Get All Books   | GET    | /api/book/all        | Needs to be authenticated                                                                                                            | 200: book array                                                                                                                                   |
| Get Single Book | GET    | /api/book/:id        | Needs to be authenticated<br>id: String (id of book to be fetched)                                                                   | 200: book object                                                                                                                                  |
| Borrow Book     | POST   | /api/book/borrow/:id | Needs to be authenticated<br>id: String (id of book to be borrowed)<br>book needs to have quantity > 1                               | 200: update book object with quantity, last_borrower field,<br>, borrow availability and add borrow object into <br>borrow_history in book object |
| Return Book     | POST   | /api/book/return/:id | Needs to be authenticated<br>id: String (id of book to be returned)<br>borrow record needs to be found and <br>isReturned flag false | 200: update book object quantity, borrow availability and<br>borrow object                                                                        |
##### Authorized Routes
| Name        | Method | Route                | Required                                                                                                                                                                 | Response                 |
|-------------|--------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| Create Book | POST   | /api/book/create     | Needs to be authorized (admin or editor)<br>title: String<br>description: String<br>genre: String [enum]<br>author: String<br>year_published: String<br>quantity: Number | 200: book object         |
| Update Book | PUT    | /api/book/update/:id | Needs to be authorized (admin or editor)<br>id: String (id of book to be updated)<br>payload: any book fields to be updated                                              | 200: updated book object |
| Delete Book | Delete | /api/book/delete/:id | Needs to be authorized (admin or editor)<br>id: String (id of book to be deleted)                                                                                        | 200: success message     |

#### Request Routes
#### [Request Model](app-backend/src/models/request.ts)
##### NEEDS TO BE ADMINISTRATOR
| Name            | Method | Route            | Required                                                       | Response                                                                 |
|-----------------|--------|------------------|----------------------------------------------------------------|--------------------------------------------------------------------------|
| Get All Request | GET    | /api/request/all | Needs to be admin                                              | 200: request array                                                       |
| Approve Request | POST   | /api/request/:id | Needs to be admin<br>id: String (id of request to be approved) | 200: update request object and<br>add, remove or update user accordingly |


### 2.4 Code Implementation
* Server is implemented in [server.ts](app-backend/src/server.ts) and this is where all 3 main routes are defined as well
* The main routes have either authenticationCheck middleware or authorization middleware depending on the requirements
* The main routes are then passed their specific route where all the request are defined e.g. [userRoutes](app-backend/src/routes)
* From the specific routes they are being handled by specific controllers e.g. [userController](app-backend/src/controllers)
* The specific controllers uses a middleware function [catchAsync](app-backend/src/middleware/catchAsync.ts) just resolve the controller function and if there is an error it will go to next ➡ which will lead back to [server.ts](app-backend/src/server.ts) where it will return a status of 500 with the error

### 2.5 Scalability
* Folders are structured in a way that it is easier to plug and play e.g. to add new routes, models etc.
* Request are made keeping in mind that it might need alternative information to show e.g. getAllBooks is aggregated to show the user obj in last_borrower field and borrow_history array with user obj just in case the information is needed in the frontend


## 3. 💄 Frontend
Created with CRA with TypeScript template

### 3.1 Available Scripts
  1. `npm start` will run `npm run dev` and `npm watch:sass` in parallel
  2. `npm run dev` will start the application in development mode on [http://localhost:3000](http://localhost:3000) 
  3. `npm run build` will build the application for production to the build folder
  4. `npm run eject` will remove the build dependency from the application
  5. `npm run watch:sass` will watch changes made on sass and update the css file
  6. `npm run compile:sass` will compile the sass files into a compilation css file
  7. `npm run concat:css` will concat all the compiled css files and output a concat file
  8. `npm run prefix:css` will add vendor prefixers to the concatenated css files
  9. `npm run compress:css` will compress the concatenated css files
  10. `npm run build:css` will run `compile:sass` `concat:css` `prefix:css` `compress:css`
  
**Note: Not much has been done on the Frontend as I was concentrating on the Backend of the application**
