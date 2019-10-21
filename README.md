# Node.js session management with Redis

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

```
REDIS_URL - The URL of the Redis server
REDIS_PASSWORD - If set, client will run Redis auth command on connect
```

For Heroku deployment, set these values via [Config Vars](https://devcenter.heroku.com/articles/config-vars).

## Useful Redis commands

Some commands that may help you while you are debugging and testing your new external session storage. Note that all of these must be executed at the `redis-cli` prompt, which you can initialize by typing `redis-cli` into your terminal.

**monitor** will show real-time output as any activity occurs

**KEYS** \* will show a numbered list of all existing data keys

**GET** [put the key here] will show you the contents of a specific key

**ttl** [put the key here] will show the remaining time till expiration

**flushdb** removes all keys from the currently selected database

[Comprehensive list of Redis commands](https://redis.io/commands)

[Redis Data Types](https://redis.io/topics/data-types)

You need to know what type of value that key maps to, as for each data type, the command to retrieve it is different.

Here are the commands to retrieve key value:
- if value is of type string -> [GET](https://redis.io/commands/get) \<key\>
- if value is of type hash -> [HGETALL](https://redis.io/commands/hgetall) \<key\>
- if value is of type lists -> [LRANGE](https://redis.io/commands/lrange) \<key\> \<start\> \<end\>
- if value is of type sets -> [SMEMBERS](https://redis.io/commands/smembers) \<key\>
- if value is of type sorted sets -> [ZRANGE](https://redis.io/commands/zrange) \<key\> \<min\> \<max\>
 
command to check the type of value a key mapping to:

[TYPE](https://redis.io/commands/type) \<key\>

## Useful links

### Managing sessions with Redis

- https://medium.com/mtholla/managing-node-js-express-sessions-with-redis-94cd099d6f2f
- https://expressjs.com/en/resources/middleware/cookie-session.html
- https://www.npmjs.com/package/express-session
- https://www.npmjs.com/package/connect-redis
- https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework
- https://codeforgeek.com/2015/07/using-redis-to-handle-session-in-node-js/

### Redis

- [Download and install Redis](https://redis.io/download)
- [Redis Protocol Specification](https://redis.io/topics/protocol)
- [Redis Commands](https://redis.io/commands)
- [Redis Clients for Node.js](https://redis.io/clients#nodejs)
- [redis tag on Stack Overflow](https://stackoverflow.com/questions/tagged/redis)

### node_redis

- [node_redis Documentation](http://redis.js.org/)
- [node_redis GitHub](https://github.com/noderedis/node_redis)
- [node_redis tag on Stack Overflow](https://stackoverflow.com/questions/tagged/node-redis)

### Heroku
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Heroku Redis](https://devcenter.heroku.com/categories/heroku-redis)
- [Heroku Node.js support](https://devcenter.heroku.com/categories/nodejs-support)
- [heroku tag on Stack Overflow](https://stackoverflow.com/questions/tagged/heroku)
