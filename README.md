# Graveyard
Discord bot

{:toc}

## Running

Preferred node version is 16.x, 17.x.

Run `npm install` in the main directory to install the dependencies.

Run `npm start` to run the bot.

Run `npm run log` to start the logging server and go to http://127.0.0.1:9001, or run `tail -f logs/*` to have it in your terminal.

Run `npm run status` to see the status of the bot's process.

Run `npm stop` to stop running the bot.

Run `node init_db.js --force` to re-initialize the database, to reset the currency system.

Edit the `config.json` file to change the bot name, default prefix, discord bot token, and api keys.

Run `git clean -dfX` to clean the directory.

## Configuration files

### `config.json`

This is for bot wide configuration (api keys, bot token, bot name, etc.).
Make sure to put your bot token in the config.json file!

### `server_config.json` and `default_server_config.json`

This is for server wide configurations (prefixes, etc.).

### `development_config.json`

This is for development options (discord development servers, discord developer users, testing bot configs, etc.).

### sqlite database

This is for the currency system.

### `jest.config.js`

This is for testing the bot. Do not edit.

### `ecosystem.config.js`

This is for running the bot. Do not edit.

## Making new commands

### Files

Each command must be within a folder in `./command_list/` (such as `./command_list/general/help.js`).

### Properties

Each command must have a module.exports, containing the following properties:

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| name | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> | no | The name of the command. For aliases, use an array containing all the names. |
| description | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | no | The description of the command shown in the help menu. |
| userPermissions | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)> | yes | Discord permissions required to run the command. See [Discord.Permissions.FLAGS](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS). |
| usage | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> | no | Defines how a command should be used, with all arguments possible. See [Usage](#usage) |
| execute | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)(message: [Discord.Message](https://discord.js.org/#/docs/main/stable/class/Message), args: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>) => [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) | no | The function to be run when a user enters a command. |

<details><summary>Example</summary>

```js
module.exports = {
    name: "command",
    description: "A command that does things.",
    userPermissions: ["ADMINISTRATOR"],
    
    usage: [
        { tag: "number", checks: {isinteger: null} },
        { tag: "nothing" },
    ],

    execute(message, args) {
        message.channel.send("I did stuff!");
        if (args[0])
            message.channel.send(`You entered a number! ${args[0]}`);
    },
};
```

</details>

### Usage

The usage property of a command's module.exports defines the rules for how a command is to be used.

It is an array of options where each option is an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) that defines a possible route for the argument to pass. See [Option](#option).

If no option passes, the usage is sent in the channel the user sent the command in.
Descriptions are automatically generated from the usage [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

If multiple options pass, the `CommandUsageError` error will be thrown.

<details><summary>Example</summary>

```js
module.exports = {
  
}
```

</details>

#### Option

An option is an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) that represents a possible route the argument can pass.

It must contain the following properties:

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| tag | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | no | The name of an argument in an option. |
| example | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | yes | An example to display when showing the usage of a command. |
| checks | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | yes | The checks the argument string must pass for it to continue down the option. See [Checks](#checks). |
| next | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | yes | A list of the next options (identical to the usage). See [Usage](#usage). |

<details><summary>Example</summary>

```js
{
    tag: "something",
    example: "12345",
    checks: {
        isinteger: null,        // checks if the first argument string is an integer
    },
    next: [
      {
          tag: "something-else",
          example: "",
          checks: {
              is: {not: "wasd"} // checks if the second argument string is not "wasd"
          },
      }
    ],
}
```

</details>

##### Checks

Checks is an object that defines rules that the argument to pass to continue down the option.

If checks is [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) or empty, the option will always pass.

A check can be inverted by replacing the value with `{not: value}`. See [Not](#not).

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| is | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | yes | Argument is exactly the string. |
| isin | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> | yes | Argument is exactly one of the strings in the array. |
| isempty | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | yes | Argument is not given. |
| isinteger | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | yes | Argument is an integer. |
| matches | [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | yes | Argument matches the regular expression somewhere in the string. |
| matchesfully | [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | yes | Argument matches the regular expression fully. |
| isuseridinguild | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | yes | Argument is the ID or mention of a user in the guild the message was sent in. |
| isbanneduseridinguild | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) | yes | Argument is the ID or mention of a banned user in the guild the message was sent in. |
| passes | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | yes | Argument passes a custom rule. See [Passes](#passes). |

<details><summary>Example</summary>

```js
{
    is: "word",   // checks that the argument is exactly "word"
}
```

</details>

###### Passes

If the check you need is not available, you can create one.

| PROPERTY | TYPE | OPTIONAL | DESCRIPTION |
| :-: | :-: | :-: | :-: |
| func | [Function](arg: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)) | no | Must return a [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) determining whether the argument passed or not. |
| description | [Function](not: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean), value: any) | no | The description shown to automatically generate the usage shown to users. The not argument is true if the check was inverted (see [Not](#not)). |

<details><summary>Example</summary>

```js
{
    func: arg => arg.length === 9,
    description: (not, value) => `${not ? "does not have" : "has"} a length of 9`,
}
```

</details>

###### Not

All checks can be inverted by replacing the value with `{not: value}`.

**Note:** when a check is inverted, the option will pass if the argument is not given.
To disable this behavior, add the `isempty: {not: null}` check.
