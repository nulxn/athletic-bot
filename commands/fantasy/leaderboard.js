import { SlashCommandBuilder } from "discord.js";
import { generateLeaderboard } from "../../db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Leaderboard of users"),
  async execute(interaction) {
    await interaction.reply(JSON.stringify(await generateLeaderboard()));
  },
};
