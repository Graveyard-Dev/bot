const { MessageEmbed } = require("discord.js");
const { Levels, Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: ["leaderboard", "lb"],
    description: "Shows the users with the highest levels.",

    usage: [
    ],

    async execute(message) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        function defineUser(userId) {
            return Users.findOne({ where: {user_id: userId} });
        }

        const levels = await Levels.findAll({ where: {guildId: message.guild.id} });
        levels.sort((a, b) => a.level === b.level ? b.exp - a.exp : b.level - a.level);

        const topTen = levels.slice(0, 10);

        const embed = new MessageEmbed()
            .setTitle("Top 10 Users On This Server")
            .setColor(randomColor);

        if (topTen.length === 0) {
            embed.setDescription("According to my statisticas, there is no one on the leaderboard.");
        } else {
            // Sequential asynchronous loop from https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
            await topTen.reduce(async (memo, userLevel, position) => {
                await memo; // Waits for previous to end.
                const userInDb = await defineUser(userLevel.userId);
                const userInDiscord = await message.client.users.fetch(userLevel.userId);
                console.log(userInDiscord);
                embed.addField(`${position + 1}. ${userInDb.badge || ""}${userInDiscord.tag}`, `Level ${userLevel.level}, ${userLevel.exp}/${userLevel.reqExp} XP!`);
            }, undefined);
        }

        message.channel.send({ embeds: [embed] });
    }
};