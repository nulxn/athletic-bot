import { SlashCommandBuilder } from "discord.js";
import { createUser, db } from "../../db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register for the fantasy league")
    .addStringOption((option) =>
      option.setName("name").setDescription("Your name").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("athleticid")
        .setDescription("Your athletic.net id")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.user;
    const name = interaction.options.getString("name");
    const athleticid = interaction.options.getString("athleticid");

    const users = await db.run("SELECT * FROM user WHERE id = ?", [user.id]);
    const userExists = users.length > 0;

    if (userExists) {
      await interaction.reply(JSON.stringify(users));
    } else {
      await createUser(user.id, athleticid, name);
      await interaction.reply("You have been registered successfully.");
    }
  },
};
