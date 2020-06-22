const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const mysql = require('mysql');

const client = new Client({
    disableEveryone: true
})

// Collections
client.commands = new Collection();
client.aliases = new Collection();

config({
    path: __dirname + "/.env"
});

// Run the command loader
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "me getting developed",
            type: "WATCHING"
        }
    }); 
})

let y = process.openStdin()
y.addListener("data", res => {

    let x = res.toString().trim().split(/ +/g);
    client.channels.cache.get("724351932210217001").send(x.join(" "));

    // client.users.cache.get("455319603191611392").send(x.join(" ")).then(console.log("message sent"));

});

var conn = mysql.createConnection({
    host: "eu-cdbr-west-03.cleardb.net",
    database: "heroku_8720c9bc8e2820a",
    user: "b35164c854c43a",
    password: "fc66534f"
});

setInterval(function () {
    conn.query('SELECT 1');
}, 5000);

client.on("message", async message => {
    const prefix = ";";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    // If message.member is uncached, cache it.
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command) 
        command.run(client, message, args, conn);
});

client.on("guildMemberAdd", member => {
    console.log("User" + member.user.tag + " has joined the server!");

    var role = member.guild.roles.find("name", "Outsiders");
    member.roles.add(role);
})

client.login(process.env.TOKEN);