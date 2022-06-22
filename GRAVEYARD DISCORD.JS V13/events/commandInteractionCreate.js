const { sendGuildLog } = require(`${__basedir}/utilities/generalFunctions.js`);

const { create } = require(`${__basedir}/configs/colors.json`);

const { formatBacktick } = require(`${__basedir}/utilities/generalFunctions.js`);

const { log } = require(`${__basedir}/utilities/botLogFunctions.js`);

const { missingPermissions } = require(`${__basedir}/utilities/commandFunctions.js`);

module.exports = {
    name: "commandinteractioncreate",
    async execute(graveyard) {
        graveyard.on("interactionCreate", async interaction => {
            //* only accept command interactions
            // this file only handles command interactions
            if (!interaction.isCommand()) return;

            //
            //! Command execution
            //

            //* finds the command in the collection
            // returns if the command is not found
            const command = graveyard.commands.get(interaction.commandName);
            if (!command) return;

            //* check member permissions
            // if the member is missing permissions, tell them what permissions theyre missing and end the execution
            const isMissingPermissions = await missingPermissions(interaction.member, interaction, command);
            if (isMissingPermissions !== false) {
                return await interaction.reply(`You do not have these required permissions in this channel or server: ${isMissingPermissions.map(formatBacktick).join(", ")}`);
            }

            //* check for bot permissions
            // if im missing permissions, tell them what permissions im missing and end the execution
            const isBotMissingPermissions = await missingPermissions(interaction.guild.me, interaction, command);
            if (isBotMissingPermissions !== false) {
                return await interaction.reply(`I do not have these required permissions in this channel or server: ${isBotMissingPermissions.map(formatBacktick).join(", ")}`);
            }

            //* execute the command
            // if command execution fails, log the error and send them an ephemeral reply stating to go contact support.
            await command.execute(interaction);

            //
            //! Logging
            //

            //* send a log to the guild
            const fields = [
                {
                    name: "User",
                    value: `${await interaction.user.tag}`
                },
                {
                    name: "Command name",
                    value: `${await interaction.commandName}`
                },
                {
                    name: "Channel",
                    value: `${await interaction.channel}`
                }
            ];

            await sendGuildLog(graveyard, "A user initiated an application command", fields, create, null, "log_command_interactions", interaction.guild);

            //* log the command to server logs
            log(`In the guild ${interaction.guild.name}, ${interaction.user.tag} used the command ${interaction.commandName} with the options {${await interaction.options.data.map(option => ` NAME: [${option.name}] VALUE: [${option.value}]`) || "No options"} }`);

        });
    }
};