import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Set the channel for the card game.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to set as the card game channel.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const channelId = channel.id;
    console.log(channelId);
    await interaction.reply(
      `The card game channel has been set to ${channel}.`
    );
  },
};
