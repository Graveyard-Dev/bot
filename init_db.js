const Sequelize = require("sequelize");

const sequelize = new Sequelize("currency_database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});

const CurrencyShop = require("./models/CurrencyShop")(sequelize, Sequelize.DataTypes);
require("./models/Users")(sequelize, Sequelize.DataTypes);
require("./models/UserItems")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize.sync({ force }).then(async () => {
    const shop = [ 
        CurrencyShop.upsert({ itemEmoji: "<:gembadge:926886708497248416>", name: "gembadge", cost: 1000000, itemDescription: "Ooh shiny!", category: "Badges"}),
        CurrencyShop.upsert({ itemEmoji: "<:certificate:926539198503211051>", name: "VIP pass", cost: 10000000, itemDescription: "Flex on your friends!", category: "Special"}),
        CurrencyShop.upsert({ itemEmoji: "<:certificate:926539198503211051>", name: "Casino Membership", cost: 1000, itemDescription: "Join the casino for some exquisite gambling!", category: "Special"}),
        CurrencyShop.upsert({ itemEmoji: "🔖", name: "Bible", cost: 20, itemDescription: "Read up on some of history's best works of fiction!", category: "Fiction"}),
        CurrencyShop.upsert({ itemEmoji: "👼", name: "Biblically Accurate Angel", cost: 5000000, itemDescription: "They must've escaped! How did that even happen it's an entry in a database!", category: "Fiction"}),
        CurrencyShop.upsert({ itemEmoji: "👼", name: "Angel", cost: 777, itemDescription: "Looks like this ones a tad more child friendly.", category: "Fiction"}),
        CurrencyShop.upsert({ itemEmoji: ":smiling_imp:", name: "Demon", cost: 6666, itemDescription: "Collect these and see how many you can get!", category: "Fiction"}),
        CurrencyShop.upsert({ itemEmoji: ":ghost:", name: "Evil Soul", cost: 10000, itemDescription: "For those on the wrong side of history.", category: "Fiction"}),
        CurrencyShop.upsert({ itemEmoji: "✟", name: "Catholic cross", cost: 40, itemDescription: "SHOUT OUT TO THE CATHOLICS", category: "Fiction"}),
        CurrencyShop.upsert({ itemEmoji: ":arrow_double_up:", name: "Tendies", cost: 5000, itemDescription: "r/superstonk!!!1!!!!11!!!", category: "Memes"}),
        CurrencyShop.upsert({ itemEmoji: ":woman:", name: "Typical Femoid", cost: 1000, itemDescription: "They always chase after chads when there's a nice guy like me right here!", category: "Memes"}),
        CurrencyShop.upsert({ itemEmoji: ":sweat_drops:", name: "Water", cost: 1, itemDescription: "r/hydrohomies", category: "Memes"}),
        CurrencyShop.upsert({ itemEmoji: ":rose:", name: "Rose", cost: 2, itemDescription: "It smells delightful!", category: "Flowers"}),
        CurrencyShop.upsert({ itemEmoji: "🌻", name: "Sunflower", cost: 3, itemDescription: "It smells slightly less delightful than a rose, but still alright.", category: "Flowers"}),
        CurrencyShop.upsert({ itemEmoji: ":top:", name: "One third of an amazon stock", cost: 1125, itemDescription: "Genuine price of one third of an Amazon stock.", category: "Memes"}),
        CurrencyShop.upsert({ itemEmoji: "🚓", name: "Kanye West", cost: 6600000000, itemDescription: "Nothing special.", category: "People"}),
        CurrencyShop.upsert({ itemEmoji: "🚓", name: "Ryan Reynolds", cost: 150000000, itemDescription: "A fine addition to your collection!", category: "People"}),
        /* eslint-disable-next-line no-loss-of-precision */
        CurrencyShop.upsert({ itemEmoji: "🚓", name: "The Dev Team", cost: 999999999999999999999, itemDescription: "Good luck buying this!! Best regards: The Dev Team.", category: "People"}),
        CurrencyShop.upsert({ itemEmoji: "🚓", name: "LocBoi", cost: 50000000, itemDescription: "He won! Fair and square.", category: "People"}),
        CurrencyShop.upsert({ itemEmoji: "🎤", name: "That one artist who fell off", cost: 2000000, itemDescription: "We all know at least one!", category: "People"}),
        CurrencyShop.upsert({ itemEmoji: ":credit_card:", name: "\"God\"", cost: 9223372036854775800, itemDescription: "Just about as much money you can have.", category: "Fiction"}),
        CurrencyShop.upsert({ itemEmoji: "🚓", name: "David Tennant", cost: 17043809, itemDescription: "He really is a lovely man.", category: "People"}),
        CurrencyShop.upsert({ itemEmoji: "🦵", name: "Joe Biden's leg", cost: 2943529411764, itemDescription: "How did they get to that? (1 leg = (Average male's leg weight/Joe biden weight) * U.S.A military networth.)", category: "People"}),
        CurrencyShop.upsert({ itemEmoji: "💔", name: "Egirl", cost: 10, itemDescription: "\"Why isn't it free?\"", category: "People"}),
        CurrencyShop.upsert({ itemEmoji: ":one:", name: "Dog #939458315", cost: 100, itemDescription: "How does this exist?", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: "<:germanshepherd:926588424851439656>", name: "German Shepherd", cost: 500, itemDescription: "Tried and true classic1", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: "🐶", name: "Labrador", cost: 354, itemDescription: "Labradori!", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: ":white_circle:", name: "Pomeranian", cost: 700, itemDescription: "Some people argue that pomeranians don't have a body, only fluff.", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: "🐩", name: "Poodle", cost: 1000, itemDescription: "Did the queen have these?", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: "<:shiba:926585439391981608>", name: "Shiba", cost: 1200, itemDescription: "A favourite of mine!", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: "<:belladog2:926497352238379110>", name: "Bella Dog", cost: 1500, itemDescription: "A vaccuum cleaner of sorts.", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: "<:wtfkitty:909420858093748265>", name: "Chloe Dog", cost: 10000, itemDescription: "A rat in disguise.", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: "<:dachshung:926592145538818050>", name: "Dachshund", cost: 1201, itemDescription: "Hey d!", category: "Dogs"}),
        CurrencyShop.upsert({ itemEmoji: "<:catnocolourbackground:926455472821788672>", name: "No colour cat", cost: 10, itemDescription: "Seriously, how do you exist?? Freak of nature.", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "<:blackcatnobackground:926455428995510282>", name: "Black Cat", cost: 100, itemDescription: "Good luck inbouundd!!!", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "<:orangecatnobackground:926455401921265704>", name: "Orange Cat", cost: 200, itemDescription: "Orngeag", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "<:graycatnobackground:926454324551381022>", name: "Gray Cat", cost: 150, itemDescription: "Cute kitty!", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "<:whitecatnobackground:926455415351439432>", name: "White Cat", cost: 200, itemDescription: "Cute kitty, but white!", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "<:browncatnobackground:926455380194787339>", name: "Brown Cat", cost: 160, itemDescription: "Smells like coffee beans.", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "<:cliffordnobackground:926455391594905650>", name: "Red Cat", cost: 1000, itemDescription: "..Clifford? (I'm sorry)", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "<:browncatnobackground:926455380194787339>", name: "Manta Cat", cost: 10000, itemDescription: "The developer's cat is here?!! Hey cutie! (ig:photosfromthenordic)", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "<:ramezcat:926508561389993994>", name: "Callie Cat", cost: 10000, itemDescription: "Watching over the server administrators.", category: "Cats"}),
        CurrencyShop.upsert({ itemEmoji: "🐠", name: "Fish Ziggy", cost: 1000, itemDescription: "\"He's a bit fat, but it's okay he's cute.\"", category: "Fish"}),
        CurrencyShop.upsert({ itemEmoji: "🍪", name: "Cookie", cost: 1, itemDescription: "You can have one, but only one. I'm always looking at the cookie jar.", category: "Food"}),
        CurrencyShop.upsert({ itemEmoji: "🐤", name: "Chicken", cost: 748485395, itemDescription: "Where's it from?", category: "Food"}),
        CurrencyShop.upsert({ itemEmoji: ":small_red_triangle_down:", name: "Doritoes", cost: 7000, itemDescription: "Man we really are evading lawsuits faster than politicians avoid questions.", category: "Food"}),
        CurrencyShop.upsert({ itemEmoji: ":ramen: ", name: "Japenese food", cost: 10, itemDescription: "\"You can never go wrong with chinese food! Oh wait.\"", category: "Food"}),
        CurrencyShop.upsert({ itemEmoji: "🍪", name: "1.5 chicken nuggets", cost: 5, itemDescription: "CHICKEN NUGGIES", category: "Food"}),
        CurrencyShop.upsert({ itemEmoji: ":coin:", name: "Premium Cookie", cost: 100, itemDescription: "What even is this?", category: "Food" }),
        CurrencyShop.upsert({ itemEmoji: "🍹", name: "Coke E Cola", cost: 3, itemDescription: "Don't want a lawsuit after all ;)", category: "Food" }),
        CurrencyShop.upsert({ itemEmoji: "🍝", name: "Father's spaghetti", cost: 243, itemDescription: "For when you don't have a mom to cook for you.", category: "Food"}),
        CurrencyShop.upsert({ itemEmoji: ":egg: :fish:", name: "Fish eggs", cost: 100, itemDescription: "YUM!", category: "Food"}),
        CurrencyShop.upsert({ itemEmoji: "🚙", name: "Fresh car smell in a bottle", cost: 40, itemDescription: "SO REFRESHING😍", category: "Weird Things"}),
        CurrencyShop.upsert({ itemEmoji: "🪵", name: "Wooden plank", cost: 20, itemDescription: "Literally a wooden plank.", category: "Wooden"}),
    ];
    await Promise.all(shop);
    console.log("Currency database synced.");

    sequelize.close();
}).catch(console.error);
