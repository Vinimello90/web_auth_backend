[![en](https://img.shields.io/badge/lang-en-red.svg)](./README.md) [![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](./README.pt-br.md)

# Web Authentication - backend

Este é um projeto de API **RESTful** desenvolvido com **Node.js**, **Express.js**, **MongoDB** e **Mongoose**. A API recebe dados, os salva em um banco de dados e fornece informações sobre usuários para consumo na plataforma do projeto **[Web Authentication](https://github.com/Vinimello90/web_authn#readme)**.

A API utiliza a biblioteca **webauthn** para autenticação por **Passkey** com **SimpleWebAuthn**, reforçando a segurança e permitindo a autenticação sem senha.

## Tecnologias

- Node.js
- Express.js
- MongoDB
- Mongoose
- Jsonwebtoken
- SimpleWebAuthn
- Cors
- Winston
- Joi / Celebrate

## Descrição das Tecnologias e Técnicas Utilizadas

### Node.js e Express.js

**Node.js** é um ambiente de execução JavaScript que permite rodar código fora do navegador, possibilitando o desenvolvimento de aplicações **back-end**. O framework **Express.js** foi utilizado para criar o servidor e as rotas da API.

As rotas de requisição para dados de usuários e **Passkeys** foram implementadas com os métodos `get()`, `post()` do **Express.js**. As rotas foram organizadas em módulos, utilizando o método `Router()` para criar um roteador. O método `require()` do **Node.js** carrega os módulos, e o método `use()` é utilizado para incluí-los no módulo principal.

Também foi implementado um middleware global para tratar erros nas rotas, utilizando o método `use()` no módulo principal para executar ao chamar o método `next()` nas rotas.

### MongoDB

É um banco de dados **NoSQL** orientado a documentos. Em vez de armazenar dados em tabelas, como bancos relacionais (por exemplo, MySQL ou PostgreSQL), ele usa documentos no formato **JSON**.

### Mongoose

É uma biblioteca para **Node.js** que facilita a interação com o **MongoDB**. Utilizando **Schemas** e **Models** do **mongoose**, é validado os campos e criado os dados dos usuários.

Os métodos `create(), find()` e `findById()` são usados para realizar as operações **CRUD** (Create, Read, Update, Delete) e manipular os dados no banco.

### Jsonwebtoken

Utilizo a biblioteca **jsonwebtoken** para gerar tokens de autenticação, que permitem identificar o usuário e mantê-lo conectado mesmo após fechar e reabrir a página. Para criar o token, uso a função `jwt.sign()`, que gera uma **hash** contendo informações como o ID do usuário e um prazo de expiração para o token, ficando o token inválido após o expirar sendo necessário um novo login. Para validar o token, uso `jwt.verify()`, que retorna o **payload** com os dados armazenados, como a ID do usuário, se o token for válido.

### SimpleWebAuthn

Uso a biblioteca **@simplewebauthn/server** para implementar autenticação com **Passkey** no backend. Utilizo as funções `generateRegistrationOptions()` e `generateAuthenticationOptions()` para gerar os desafios (challenges) que são enviados ao front-end. Após a resposta do usuário, uso `verifyRegistrationResponse()` e `verifyAuthenticationResponse()` para validar os dados retornados, garantindo que o dispositivo seja confiável. Essa abordagem permite autenticação com **biometria** ou **chaves de segurança**, aumentando a segurança das contas dos usuários e permitindo o autenticação sem senha.

### Cors

O **CORS (Cross-Origin Resource Sharing)** é um mecanismo de segurança que define quais origens podem acessar recursos no servidor. Para facilitar sua implementação no **Node.js**, utilizo a biblioteca **cors**, que funciona como um middleware e simplifica a configuração do CORS em aplicações web.

### Winston

Utilizo a biblioteca **winston** para registrar logs da aplicação. Em conjunto com o middleware **express-winston**, consigo registrar automaticamente todas as requisições e erros. Para isso, aplico `app.use(requestLogger)` nas requisições e `app.use(errorLogger)` nos erros.

### Joi / Celebrate

Uso o **Joi** para definir e validar esquemas de dados. Já o **Celebrate** é um middleware do **Express** que aplica essas validações automaticamente nas requisições HTTP. Com os dois juntos, consigo garantir entradas seguras e bem estruturadas nas minhas APIs.

## Documentação

Após instalar as dependências com **npm i** e configurar o endereço do **mongodb** e a porta da **API**, inicie o servidor usando o comando **npm run start**.

## Endpoints

### GET /users/me

Retorna os dados de um usuário específico com base no **ID** do usuário autorizado, em formato JSON.

\* É necessário enviar o token no headers para autorização.

**Exemplo:**

```bash
https://api.webauth.protechadvanced.com/users/me
```

### POST /passkeys/register/options

Gera as opções necessárias para registrar um novo **passkey**. O servidor cria um desafio (**challenge**) e configura os dados que serão usados no processo de registro do autenticador (como chaves de segurança ou biometria).

\* Essa rota deve ser chamada antes do processo de criação do passkey no front-end.

**Exemplo:**

JSON

```json
{
  "username": "exemplo@exemplo.com"
}
```

Endereço (URL)

```bash
https://api.webauth.protechadvanced.com/passkeys/register/options
```

### POST /passkeys/register/verify

Verifica a resposta de registro enviada pelo cliente após o uso do autenticador. A rota valida a credencial recebida e, se estiver correta, salva a **chave pública** e demais dados do autenticador no banco de dados vinculando à conta do usuário.

\* Para vincular o passkey à conta, o usuário precisa estar autenticado ou finalizar o processo de registro.

**Exemplo:**

Endereço (URL)

```bash
https://api.webauth.protechadvanced.com/passkeys/register/verify
```

### POST /passkeys/authentication/options

Envia o nome de usuário para autenticação e gera as opções necessárias para iniciar o processo de **login com passkey**. Essa rota retorna um novo desafio (**challenge**) e dados que o autenticador usará para gerar uma resposta de autenticação.

\* Deve ser chamada antes de autenticar com biometria ou chave de segurança.

**Exemplo:**

JSON

```json
{
  "username": "exemplo@exemplo.com"
}
```

Endereço (URL)

```bash
https://api.webauth.protechadvanced.com/passkeys/authentication/options
```

### POST /passkeys/authentication/verify

Verifica a resposta de autenticação enviada pelo cliente após o uso do passkey. Se a validação for bem-sucedida, o usuário é autenticado e recebe um **token JWT** para acessar as rotas protegidas da aplicação.

**Exemplo:**

Endereço (URL)

```bash
https://api.webauth.protechadvanced.com/passkeys/authentication/verify
```
