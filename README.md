# Redis session management with Node.js

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

![Redis session management with Node.js](public/img/redis-node.png)

## Local development

### Requires

* Heroku
  * [a free account](https://signup.heroku.com)
  * [command-line tools (CLI)](https://devcenter.heroku.com/articles/heroku-command-line)
* [redis server](https://redis.io/download) (installed and listening on the default local port)
* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node.js](https://nodejs.org) 10.x

### Setup

In your shell terminal, clone this repo to become the working directory:

```bash
git clone https://github.com/velizarn/redis-demo
cd redis-demo
```

Install Node packages:

```bash
npm install
```
Copy the local dev environment variables template (.env.sample), and then open `.env` in your editor:

```
cp .env.sample .env
```

### Running

The app runs one web process, declared in the [`Procfile`](Procfile). It may be start using the follow commands:

```bash
# Simply run the web & stream processes
# as declared in Procfile (like Heroku uses for deployment):
heroku local
```

### Demo

In a browser view the web UI [http://localhost:5000/](http://localhost:5000/) and [http://localhost:5000/sess/get](http://localhost:5000/sess/get).

## Configuration

Configured via environment variables.

For local development, set these values in `.env` file.

For Heroku deployment, set these values via [Config Vars](https://devcenter.heroku.com/articles/config-vars).

## Useful Redis commands

Some commands that may help you while you are debugging and testing your new external session storage. Note that all of these must be executed at the `redis-cli` prompt, which you can initialize by typing `redis-cli` into your terminal.

**monitor** will show real-time output as any activity occurs

**KEYS** \* will show a numbered list of all existing data keys

**GET** [put the key here] will show you the contents of a specific key

**ttl** [put the key here] will show the remaining time till expiration

**flushdb** removes all keys from the currently selected database

[Comprehensive list of Redis commands](https://redis.io/commands)

## Useful links

- https://medium.com/mtholla/managing-node-js-express-sessions-with-redis-94cd099d6f2f
- https://expressjs.com/en/resources/middleware/cookie-session.html
- https://www.npmjs.com/package/express-session
- https://www.npmjs.com/package/connect-redis
- https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework
- https://codeforgeek.com/2015/07/using-redis-to-handle-session-in-node-js/
