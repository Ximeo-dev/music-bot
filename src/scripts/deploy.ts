import { config } from 'dotenv'
import path, { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

config({ path: resolve(__dirname, '..', '..', '.env') })

import { REST, Routes, APIUser } from "discord.js";
import commands from "../commands/index.js";
import Keys from "../keys.js";
import { fileURLToPath } from 'url';

const body = commands
  .map(({ commands }) => commands.map(({ meta }) => meta))
  .flat();

const rest = new REST({ version: "10" }).setToken(Keys.clientToken);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  if (process.env.NODE_ENV === "production") {
    await rest.put(Routes.applicationGuildCommands(currentUser.id, Keys.testGuild), { body: [] });
    await rest.put(Routes.applicationCommands(currentUser.id), { body });
  } else {
    await rest.put(Routes.applicationGuildCommands(currentUser.id, Keys.testGuild), { body });
  }

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;
    const response =
      process.env.NODE_ENV === "production"
        ? `Successfully released commands in production as ${tag}`
        : `Successfully registered commands for production in ${Keys.testGuild} as ${tag}`;

    console.log(response);
  })
  .catch(console.error);
