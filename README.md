<h1 align="center">
  <strong><code>Jipitauri - Based on GPT-3 </code></strong>
</h1>

<p align="center">
 <img width="100px" src="https://github.com/supernova-ge/Jipitauri/blob/main/jipitauri@0.5x.jpg" align="center" alt="Logo" />
</p>

<div align="center">
  
  ![example1](https://img.shields.io/github/stars/supernova-ge/Jipitauri?style=social)
  ![example2](https://img.shields.io/github/forks/supernova-ge/Jipitauri?style=social)
</div>

### Preview

![sample-conversation](https://github.com/supernova-ge/Jipitauri/blob/main/preview.png)

### [Live preview](https://chat.pulsarai.ge)

---

### QuickStart

<p><code>ENVIRONMENT SETUP</code></p>

```env
Follow env_example files at ./api/env_example and ./client/env_example
```
---


:bookmark: `The project can work with any data source which is supported by Prisma.`


:pushpin: To proceed with a database other than MongoDB, some config modifications to schema.prisma file are needed. 

- E.g. to support `MySQL`, `schema.prisma` should look like this: 

```env
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Prompt {
  id        BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  sessionId String 
  input     String
  input_en  String
  output    String
  output_ge String
  summary   String
  createdAt DateTime @map("createdAt") @default(now())
  updatedAt DateTime @map("updatedAt") @updatedAt
}

model Feedback {
  id        BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  message   String
  value     String
  createdAt DateTime @map("createdAt") @default(now())
  updatedAt DateTime @map("updatedAt") @updatedAt
}

```

---

:bookmark: `Meanwhile, we use MongoDB as our database provider because of its simplicity. `


---

```typescript

1. Navigate to `/api` folder
2. Install dependencies
   `pnpm i`
3. Prepare .env file
   Copy env_example file and create .env with your credentials
4. Run the app
   `npm start`
5. Navigate to `/client` folder
6. Install dependencies
   `pnpm i`
7. Prepare .env file
   Copy env_example file and create .env with your credentials
8. Run the app
   `npm start`

```

Or simply

`Set up the environment` then
run :whale: `docker-compose up`
...
