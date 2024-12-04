import { SlashCommandBuilder } from "discord.js";
import { createUser, db } from "../../db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register for the fantasy league"),
  async execute(interaction) {
    const user = interaction.user;
    const users = await db.collection("users").get();
    const userExists = users.docs.some((doc) => doc.data().id === user.id);

    if (userExists) {
      await interaction.reply("You are already registered.");
    } else {
      await createUser(user.id);
      await interaction.reply("You have been registered successfully.");
    }
  },
};
