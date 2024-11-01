const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");

const { gravestone } = require(`${__basedir}/emojis.json`);

async function giveUserPrize(client, user, win, bet) {
    if (win === true) {
        client.currency.add(user.id, bet);
    } else {
        client.currency.add(user.id, -bet);
    }
}   

async function addPlayerToEmbed(embed, player, win) {
    if (win === true) {
        return embed.fields.push({
            name: `${player.username}`,
            value: `+${player.bet}${gravestone}`
        });
    } else {
        return embed.fields.push({
            name: `${player.username}`,
            value: `-${player.bet}${gravestone}`
        });
    }
}

async function gameEnd(client, playerList, dealer) {
    const embed = {
        title: "The game has ended!",

        fields: [

        ],

        color: "RED"
    };

    for (let i = 0; i < playerList.length; ++i) {
        const user = playerList[i];
        
        let userCardTotal = 0;
        for (let i = 0; i < user.cards.length; ++i) {
            userCardTotal += user.cards[i].value;
        }

        if (user.bust === true) {
            await giveUserPrize(client, user.user, false, -user.bet);
            await addPlayerToEmbed(embed, user, false);

            continue;
        }

        if (dealer.bust === true) {
            await giveUserPrize(client, user.user, true, user.bet);
            await addPlayerToEmbed(embed, user, true);

            continue;
        }

        if (await countDealerTotal(dealer) > userCardTotal) {
            await giveUserPrize(client, user.user, false, user.bet);
            await addPlayerToEmbed(embed, user, false);

            continue;
        }

        if (await countDealerTotal(dealer) === userCardTotal) {
            await giveUserPrize(client, user.user, false, 0);
            user.bet = 0;
            await addPlayerToEmbed(embed, user, false);
        }
        
        if (userCardTotal > await countDealerTotal(dealer)) {
            await giveUserPrize(client, user.user, true, user.bet);
            await addPlayerToEmbed(embed, user, true);

            continue;
        }
    }

    return embed;
}

async function promptOptions(channel, user, promptMessage, options) {
    const rows = [];

    let index = 0;
    for (let i = 0; i < Math.min(Math.ceil(options.length / 25), 5); ++i) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`dropdown${i}`)
                    .addOptions(options.slice(index, index + 25).map((option, j) => {
                        return {label: `${index + j + 1}. ${option}`, value: (index + j).toString()};
                    }))
            );
        rows.push(row);
        index += 25;
    }

    const message = await channel.send({
        content: promptMessage,
        components: rows
    });

    const filter = interaction => interaction.user.id === user.id;
    // max time for collector is below (but reduced it to 60 seconds)
    //const collector = message.createMessageComponentCollector({filter, time: 2_147_483_647});
    const collector = message.createMessageComponentCollector({filter, time: 60000});

    return new Promise((resolve, reject) => {
        collector.on("end", () => {
            reject(new Error("no option chosen"));

            message.delete();
        });

        collector.on("collect", async interaction => {
            resolve(Number.parseInt(interaction.values[0]));

            rows.forEach(row => {
                row.components[0].options.forEach(option => {
                    option.default = false;
                });
            });
            rows[Math.floor(Number.parseInt(interaction.values[0]) / 25)].components[0].options[Number.parseInt(interaction.values[0]) % 25].default = true;

            await interaction.update({components: rows});
            collector.stop();
        });
    });
}

async function makeBJEmbed(playerList, dealer) {
    const embed = {
        title: "Blackjack",

        fields: [],
        
        color: "RED"
    };

    for (let i = 0; i < playerList.length; ++i) {
        const user = playerList[i];
        
        let userCards = "";
        let userCardTotal = 0;
        
        for (let i = 0; i < user.cards.length; ++i) {
            if (user.cards.length < 1) {
                return;
            }

            userCards += `${user.cards[i].name}\n`;
            userCardTotal += user.cards[i].value;
        }

        embed.fields.push({
            name: `${user.username} (${user.bet + gravestone || "No bet"})`,
            value: `Cards:\n${userCards || "No cards"} (${userCardTotal})`,
        });
    }

    let dealerCards = "";
    let dealerCardTotal = 0;

    for (let i = 0; i < dealer.cards.length; ++i) {
        const card = dealer.cards[i].name;

        dealerCards += `${card}, `;
        dealerCardTotal += dealer.cards[i].value;
    }

    embed.fields.push({
        name: `${dealer.username}`,
        value: `Cards:\n${dealerCards || "No cards"} (${dealerCardTotal})`
    });

    return embed;
}

async function makeGameInviteEmbed(inviter, gameName) {
    return new MessageEmbed({
        title: `${inviter.username} is hosting a game of ${gameName}!`,
        
        description: "React with ✅ to join!"
    });    
}

async function resolveGameInvite(messageReaction) {
    const userList = messageReaction.users.cache;
    const playerList = [];

    userList.forEach(user => {
        if (user.id === messageReaction.message.author.id) return;

        playerList.push(`${user.id}`);
    });

    return playerList;
}

async function makePlayerObjectList(client, players) {
    const playerList = [];

    for (let i = 0; i < players.length; ++i) {
        const user = await client.users.fetch(players[i]);

        playerList.push({
            user: user,
            username: user.username,
            bet: 0,
            cards: [
            ],
            bust: false,
            doubledDown: false,
        });
    }

    return playerList;
}

async function giveCard() {
    const houses = ["Spades", "Hearts", "Clubs", "Diamonds"];
    const house = houses[Math.floor(Math.random() * houses.length)];

    const cardNumber = Math.floor(Math.random() * 10 + 1);

    if (cardNumber >= 10) {
        const royals = ["King", "Queen", "Jack"];
        const royal = royals[Math.floor(Math.random() * royals.length)];

        return {
            name: royal + " of " + house,
            value: cardNumber
        };
    }

    return {
        name: cardNumber + " of " + house,
        value: cardNumber
    };
}

async function makeDealer() {
    const dealer = {
        user: null,
        username: "Dealer",
        bet: null,
        cards: [

        ],
        bust: false,
    };

    const card = await giveCard();

    dealer.cards.push(card);

    return dealer;
}

async function countDealerTotal(dealer) {
    let dealerCardTotal = 0;

    for (let i = 0; i < dealer.cards.length; ++i) {
        const card = dealer.cards[i].value;

        dealerCardTotal += card;
    }

    return dealerCardTotal;
}

async function doDealerTurn(dealer) {
    const dealerCardTotal = await countDealerTotal(dealer);

    if (dealerCardTotal < 17) {
        dealer.cards.push(await giveCard());
        return "goagain";
    } else if (dealerCardTotal >= 17 && dealerCardTotal <= 21) {
        return "pass";
    } else if (dealerCardTotal > 21) {
        return "bust";
    }
}

async function countUserCardTotal(userObject) {
    //give the user a card
    userObject.cards.push(await giveCard());

    //count the users card total
    let cardTotal = 0;
    for (let i = 0; i < userObject.cards.length; ++i) {
        cardTotal += userObject.cards[i].value;
    }

    return cardTotal;
}
async function doBJTurn(channel, userObject) {
    let options;

    if (userObject.doubledDown === true) {
        options = ["Hit", "Stand"];
    } else {
        options = ["Hit", "Stand", "Double Down"];
    }

    const turnOption = await promptOptions(channel, userObject.user, `${userObject.user} What will you do?`, options).catch(() => {
        return "bust";
    });

    if (turnOption === 0) {
        const cardTotal = await countUserCardTotal(userObject);

        if (cardTotal > 21) {
            return "bust";
        }
    }

    if (turnOption === 1) {
        return "pass";
    }

    if (turnOption === 2) {
        userObject.doubledDown = true;
        const cardTotal = await countUserCardTotal(userObject);

        if (cardTotal > 21) {
            return "bust";
        }

        userObject.bet *= 2;
    }
}

module.exports = {
    makeGameInviteEmbed,
    resolveGameInvite,
    makeBJEmbed,
    makePlayerObjectList,
    doBJTurn,
    giveCard,
    gameEnd,
    makeDealer,
    doDealerTurn,
};