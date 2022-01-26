const { MessageEmbed } = require("discord.js");

const { Users } = require(`${__basedir}/db_objects`);
const developmentConfig = require(`${__basedir}/development_config.json`);

module.exports = {
    name: "addexp",
    execute(client) {
        client.on("messageCreate", async message => {
            const images = [
                "https://c.tenor.com/Gp2bwwvXtasAAAAd/among-us-meme.gif",
                "https://c.tenor.com/ZcjgRe9DltkAAAAM/rosu.gif",
                "https://c.tenor.com/mKTS5nbF1zcAAAAM/cute-anime-dancing.gif",
                "https://c.tenor.com/U8WV2zeMLBEAAAAM/anime-dancing.gif",
                "https://c.tenor.com/PXrldoXexykAAAAM/anime-dance.gif",
                "https://c.tenor.com/6YxzB6eZ8mAAAAAM/dance-anime-dance.gif",
                "https://c.tenor.com/Lkyf9b8203YAAAAM/dragon-maid-kanna-fite.gif",
                "https://c.tenor.com/1sxsYwSdCHUAAAAM/hiotibocchi-aru-aru.gif",
                "https://c.tenor.com/1GBajCU4TGUAAAAM/mugi-k-on.gif",
                "https://c.tenor.com/z31oZxFm2UIAAAAM/jin-mori-happy.gif",
                "https://c.tenor.com/d2NYSXokaK4AAAAM/pikachu-cheer-dance.gif",
                "https://c.tenor.com/mmw3gG69XGgAAAAM/rock-lee-cheering.gif",
                "https://c.tenor.com/tyb15RWixEYAAAAM/puck-anime.gif",
                "https://c.tenor.com/a7w4Tl3H1YkAAAAM/ilulu-dragon-maid.gif",
                "https://c.tenor.com/_9QBjj1MgLIAAAAM/yui-hirasawa-anime-cheering.gif"
            ];

            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const levelChannel = client.channels.cache.get(client.serverConfig.get(message.guild.id).levelup_channel_id);

            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;

            //find user, give user 1 exp, check reqexp, if exp >= reqexp, level ++;
            const userInDb = await Users.findOne({
                where: { user_id: message.author.id }
            });

            await userInDb.addExp();

            if (userInDb.level === null) {
                userInDb.level = 1;
            }

            if (userInDb.exp >= userInDb.reqexp) {
                await userInDb.addLevel();

                await userInDb.setReqExp();

                await Users.update({exp: 1}, {where: {user_id: message.author.id}}).then(async () => {

                    if (!levelChannel) {return;}

                    const userInDbTwo = await Users.findOne({
                        where: { user_id: message.author.id }
                    });

                    const embed = new MessageEmbed()
                        .setTitle(`${message.author.username} has reached level ${userInDbTwo.level}!`)
                        .setDescription(`${userInDbTwo.reqexp} EXP until the next level.`)
                        .setFooter({text: `For leveling up you earned ${userInDb.level * 1000} RIP coin!`})
                        .setImage(images[Math.floor(Math.random() * images.length)])
                        .setColor(randomColor);

                    levelChannel.send({embeds: [embed]});
                    message.client.currency.add(message.author.id, userInDb.level * 1000);
                });
            }
        });
    }
};