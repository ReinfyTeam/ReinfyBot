# ReinfyBot

ReinfyBot is a Discord bot for the Reinfy Discord server. It loads commands from the `commands/` directory, handles message-based commands using the configured prefix, and starts a small Express HTTP endpoint for uptime/status monitoring.

## Features

- `ping` reports the Discord gateway latency.
- `kick` allows a member with the `Moderator` role to kick a mentioned member when the bot has the required Discord permission.
- `reload` reloads a command module during development.
- The root HTTP route serves `index.html`, which can be used as a simple health/status page.
- The bot sets its presence after the Discord client is ready.

## Requirements

- Node.js compatible with the locked dependency graph. The current Discord.js dependency tree includes packages requiring Node.js 16.9 or newer.
- A Discord bot token with the gateway intents and permissions required by the enabled commands.

The repository does not include a token loader such as `dotenv`. Provide the token as the case-sensitive `token` environment variable in the process that starts the bot. Do not commit the token or replace the tracked `config.json` with secrets.

## Configuration

`config.json` currently contains the message prefix:

```json
{
  "prefix": "!"
}
```

The bot passes `process.env.PORT` to the HTTP listener. Set `PORT` explicitly when deploying behind a health monitor. The Discord token is read from `process.env.token`.

## Local development

Install the locked dependencies and start the bot from the repository root:

```text
npm ci
node index.js
```

The process starts both the Discord client and the Express status endpoint. Command modules are loaded from `commands/`, and event handlers are loaded from `events/`.

The GitHub Actions workflow runs `npm ci` across its configured Node.js matrix and invokes the optional `build` and `check-lint` npm scripts when they exist. The current `package.json` does not define either script, so those optional checks are skipped until the project adds them. This repository has no separate runtime test suite; validating command behavior still requires a configured Discord test environment.

## Security and operations

Keep the bot token outside Git and rotate it if it is exposed. The `kick` command depends on the exact `Moderator` role name, guild context, member permissions, and the bot's `KICK_MEMBERS` permission. The `reload` command is intended for development and should not be exposed to untrusted users.

## License

ReinfyBot is licensed under the [GNU Lesser General Public License v2.1](LICENSE).
