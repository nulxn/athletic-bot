import { SlashCommandBuilder } from "discord.js";
import { exec } from "child_process";

export default {
  data: new SlashCommandBuilder()
    .setName("pull")
    .setDescription("Pulls the latest changes from the repository."),
  async execute(interaction) {
    await interaction.reply("Pulling the latest changes...");

    exec("~/script.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    });
  },
};
