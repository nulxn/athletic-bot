import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getUserWithAthletes, footers } from "../../db.js";


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
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${user.username}'s profile`)
          .setDescription(
            `Name: ${userData.name}\nAthletic.net ID: ${userData.athleticid}\nRegistered at: ${userData.created_at}`
          )
          .addFields(
            userData.athletes.map((athlete) => ({
              name: athlete.name,
              value: `\`ID:\` ${athlete.id}\n\`PR:\` ${athlete.pr}\n\`School:\` ${athlete.school}`,
              inline: true,
            }))
          )
          .setFooter({
            text: footers[Math.floor(Math.random() * footers.length)],
          }),
      ],
    });
  },
};
