//const { MessageEmbed } = require("discord.js");
const { SelfRoleRoles, SelfRoleMessages } = require(`${__basedir}/db_objects`);
const { infoLog, errorLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: "selfroles",
    async execute(client) {
        // NOTE: this requires the MESSAGE and REACTION partials to be enabled (in the client initialization)
        
        async function getRolesFromReactionEvent(reactionEvent) {
            // get the message in the database
            const selfRoleMessage = await SelfRoleMessages.findOne({
                where: {
                    message_id: reactionEvent.message.id
                },
                include: ["category"]
            });

            // if it is not a message in the database, return (it is a reaction event on a different message)
            if (selfRoleMessage === null) return null;

            // then get the roles that the reaction represents (can be multiple roles)
            const selfRoleRoles = await SelfRoleRoles.findAll({
                where: {
                    category_id: selfRoleMessage.category.id,
                    emoji: reactionEvent.emoji.toString()
                }
            });

            return selfRoleRoles;
        }

        client.on("messageReactionAdd", async (reactionAddEvent, user) => {
            if (user.id === client.user.id) return; // don't give itself roles

            const selfRoleRoles = await getRolesFromReactionEvent(reactionAddEvent);

            // if it is not a reaction for a role, return (it is on a self role message, but a different reaction)
            if (selfRoleRoles === null || selfRoleRoles.length === 0) return;

            // then give the user who did the reaction the roles
            const member = await reactionAddEvent.message.guild.members.fetch(user);

            try {
                member.roles.add(selfRoleRoles.map(role => role.role_id), "User selected the role(s) in the self role system.");
            } catch (error) {
                errorLog([1, 2], `${__dirname}/${__filename}.js`, "1", "Most likely not our fault, it's probably either that the role was deleted, or we don't have permissions to add the role.", "GUILD-ERROR", "Not able to add a role.");
                return;
            }

            infoLog("Successfully added a role using self roles system.", `${__dirname}/${__filename}.js`, "GUILD-INFO");
        });

        client.on("messageReactionRemove", async (reactionRemoveEvent, user) => {
            if (user.id === client.user.id) return; // don't remove itself roles

            const selfRoleRoles = await getRolesFromReactionEvent(reactionRemoveEvent);

            // if it is not a reaction for a role, return (it is on a self role message, but a different reaction)
            if (selfRoleRoles === null || selfRoleRoles.length === 0) return;

            // then remove the role from the user who did the reaction
            const member = await reactionRemoveEvent.message.guild.members.fetch(user);

            try {
                member.roles.remove(selfRoleRoles.map(role => role.role_id), "User unselected the role(s) in the self role system.");
            } catch (error) {
                errorLog([1, 2], `${__dirname}/${__filename}.js`, "1", "Most likely not our fault, it's probably either that the role was deleted, or we don't have permissions to add the role.", "GUILD-ERROR", "Not able to add a role.");
                return;
            }

            infoLog("Successfully removed a role using self roles system.", `${__dirname}/${__filename}.js`, "GUILD-INFO");
        });
    }
};
