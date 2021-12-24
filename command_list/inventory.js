const { Users } = require('../dbObjects');


module.exports = {
    name: 'inventory',
    category: "Currency",
    description: "Show your inventory, or someone else's inventory.",
    async execute (message, args) {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({
            where: {
                user_id: target.id
            }
        });
        
        const items = await user.getItems();
        console.log(items
            )
        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`);
    }
}
