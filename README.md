# Url shortener app

### Build

Install all dependencies
```bash
npm i && cd resources/ && npm i
```

Set you variables in .env
```bash
cp .env.example .env
```

Build front end part
```bash
cd resources/ && npm run build
```

### Setup backend

Set you variables in .env
```bash
cp .env.example .env
```

Create tmp dear for logs
```bash
mkdir tmp
```

Run migrations 

```bash
node ace migration:run
```

Edit and run `cron.sh`. It will run command for auto clear old entries of urls

### Run tests

```bash
npm test
```

### Start server

```bash
npm start 
```

### Adonis fullstack application

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

