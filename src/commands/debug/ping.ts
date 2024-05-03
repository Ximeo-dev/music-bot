import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils/index.js";

const meta = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Упомянуть бота для ответа")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Укажите сообщение, которым должен ответить бот")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(false)
  );


export default command(meta, ({ interaction }) => {
    const message = interaction.options.getString('message')

    return interaction.reply({
        ephemeral: true,
        content: message ?? 'Pong!'
    })
})