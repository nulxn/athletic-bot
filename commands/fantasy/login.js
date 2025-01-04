import { SlashCommandBuilder } from "discord.js";
import { getUserById } from "../../db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("login")
    .setDescription("Login to your account"),
  async execute(interaction) {
    const user = await getUserById(interaction.user.id);
    if (user) {
      await interaction.reply({
        content: `**Go to the following url:** http://localhost:3000/auth?id=${interaction.user.id}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "You are not registered, use `/login`.",
        ephemeral: true,
      });
    }
  },
};
