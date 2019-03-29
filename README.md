# redis-demo

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Useful Redis commands

Some commands that may help you while you are debugging and testing your new external session storage. Note that all of these must be executed at the `redis-cli` prompt, which you can initialize by typing `redis-cli` into your terminal.

**monitor** will show real-time output as any activity occurs

**KEYS** \* will show a numbered list of all existing data keys

**GET** [put the key here] will show you the contents of a specific key

**ttl** [put the key here] will show the remaining time till expiration

**flushdb** removes all keys from the currently selected database

[Comprehensive list of Redis commands](https://redis.io/commands)