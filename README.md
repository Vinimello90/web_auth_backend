[![en](https://img.shields.io/badge/lang-en-red.svg)](./README.md) [![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](./README.pt-br.md)

# Web Authentication - backend

This is a **RESTful API** project developed with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**. The API receives data, stores it in a database, and provides user information for consumption on the **[Web Authentication](https://github.com/Vinimello90/web_auth_frontend#readme)** platform.

The API uses the **webauthn** library for **Passkey** authentication with **SimpleWebAuthn**, enhancing security and enabling passwordless authentication.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- Jsonwebtoken
- SimpleWebAuthn
- Cors
- Winston
- Joi / Celebrate

## Description of Technologies and Techniques Used

### Node.js and Express.js

**Node.js** is a JavaScript runtime environment that allows running code outside the browser, enabling **backend** application development. The **Express.js** framework was used to create the server and API routes.

Request routes for user data and **Passkeys** were implemented using the `get()` and `post()` methods from **Express.js**. Routes were organized into modules using the `Router()` method to create a router. The **Node.js** `require()` method loads the modules, and the `use()` method is used to include them in the main module.

A global middleware was also implemented to handle errors in routes, using the `use()` method in the main module to execute whenever `next()` is called in the routes.

### MongoDB

MongoDB is a **NoSQL** document-oriented database. Instead of storing data in tables like relational databases (e.g., MySQL or PostgreSQL), it uses **JSON**-formatted documents.

### Mongoose

Mongoose is a **Node.js** library that simplifies interaction with **MongoDB**. Using **Schemas** and **Models** in Mongoose, fields are validated and user data is created.

Methods like `create()`, `find()`, and `findById()` are used to perform **CRUD** operations (Create, Read, Update, Delete) and manipulate database records.

### Jsonwebtoken

The **jsonwebtoken** library is used to generate authentication tokens, allowing the user to remain logged in even after closing and reopening the page. Tokens are created with `jwt.sign()`, generating a **hash** containing information such as the user ID and an expiration time. After expiration, the token becomes invalid and requires a new login. Tokens are validated with `jwt.verify()`, which returns the **payload** with stored data, like the user ID, if the token is valid.

### SimpleWebAuthn

The **@simplewebauthn/server** library is used to implement **Passkey** authentication on the backend. Functions like `generateRegistrationOptions()` and `generateAuthenticationOptions()` generate challenges sent to the frontend. After the user's response, `verifyRegistrationResponse()` and `verifyAuthenticationResponse()` validate the returned data, ensuring the device is trusted. This approach enables **biometric** or **security key** authentication, increasing account security and enabling passwordless authentication.

### CORS

**CORS (Cross-Origin Resource Sharing)** is a security mechanism that defines which origins can access server resources. In **Node.js**, the **cors** library is used as middleware to simplify CORS configuration in web applications.

### Winston

The **winston** library is used to log application events. Together with the **express-winston** middleware, all requests and errors can be automatically logged. `app.use(requestLogger)` is applied to log requests, and `app.use(errorLogger)` is applied to log errors.

### Joi / Celebrate

**Joi** is used to define and validate data schemas. **Celebrate** is an **Express** middleware that automatically applies these validations to HTTP requests. Together, they ensure secure and well-structured input in the API.

## Documentation

After installing dependencies with **npm i** and configuring the **MongoDB** URL and the **API** port, start the server using the command **npm run start**.

## Endpoints

### GET /users/me

Returns data for a specific user based on the authorized user's **ID**, in JSON format.

\* A token must be sent in the headers for authorization.

**Example:**

```bash
https://api.webauth.protechadvanced.com/users/me
```

### POST /passkeys/register/options

Generates the necessary options to register a new **passkey**. The server creates a **challenge** and sets up the data to be used in the authenticator registration process (such as security keys or biometrics).

\* This route must be called **before** the passkey creation process on the frontend.

**Example:**

JSON

```json
{
  "username": "example@example.com"
}
```

URL

```bash
https://api.webauth.protechadvanced.com/passkeys/register/options
```

### POST /passkeys/register/verify

Verifies the registration response sent by the client after using the authenticator. This route validates the received credential and, if correct, saves the **public key** and other authenticator data in the database, linking it to the user's account.

\* To link the passkey to the account, the user must be authenticated or complete the registration process.

**Example:**

URL

```bash
https://api.webauth.protechadvanced.com/passkeys/register/verify
```

### POST /passkeys/authentication/options

Sends the username for authentication and generates the necessary options to start the **passkey login** process. This route returns a new **challenge** and data that the authenticator will use to generate an authentication response.

\* Must be called **before** authenticating with biometrics or a security key.

**Example:**

JSON

```json
{
  "username": "example@example.com"
}
```

URL

```bash
https://api.webauth.protechadvanced.com/passkeys/authentication/options
```

### POST /passkeys/authentication/verify

Verifies the authentication response sent by the client after using the passkey. If validation is successful, the user is authenticated and receives a **JWT token** to access protected routes in the application.

**Example:**

URL

```bash
https://api.webauth.protechadvanced.com/passkeys/authentication/verify
```
