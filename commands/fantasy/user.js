import { SlashCommandBuilder } from "discord.js";
import { getUserWithAthletes } from "../../db";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get data of a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get data for")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const userData = await getUserWithAthletes(user.id);
    if (!userData) {
      return interaction.reply("User not found");
    }
    const athletes = userData.athletes.map((a) => a.name).join(", ");
    return interaction.reply(`User: ${user.username}\nAthletes: ${athletes}`);
  },
};
