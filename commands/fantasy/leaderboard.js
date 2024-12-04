import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Leaderboard of users"),
  async execute(interaction) {
    await interaction.reply("Leaderboard message");
  },
};
