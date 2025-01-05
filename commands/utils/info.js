import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Replies with information about the bot."),
  async execute(interaction) {
    await interaction.reply(
      `Bot uptime: ${process.uptime()} seconds\nBot latency: ${-(
        Date.now() - interaction.createdTimestamp
      )}ms\nAPI latency: ${interaction.client.ws.ping}ms`
    );
  },
};
