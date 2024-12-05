import { SlashCommandBuilder } from "discord.js";
import { createUser, db } from "../../db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register for the fantasy league")
    .addStringOption((option) =>
      option.setName("name").setDescription("Your name").setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.user;
    const name = interaction.options.getString("name");
    const users = await db.run("SELECT * FROM users");
    const userExists = true;

    if (userExists) {
      await interaction.reply(JSON.stringify(users));
    } else {
      await createUser(user.id);
      await interaction.reply("You have been registered successfully.");
    }
  },
};
