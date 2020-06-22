const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "check",
    category: "info",
    description: "Checks if a user if binded.",
    run: (client, message, args, conn) => {

        message.delete();

        let user = message.member.user;
        let member = message.guild.member(user);

        if (!member.roles.cache.find(r => r.name === "Outsiders")) return message.channel.send("\`You're already verified!\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        if (args.length === 0) return message.channel.send("\`Please provide a valid code.\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        let userCheck = client.users.cache.get(args[0]);

        if (!userCheck.roles.cache.find(r => r.name === "Outsiders")) return message.channel.send("\`User has already been verified.\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        conn.query(`SELECT * FROM verificationcodes WHERE discordid = ${args[0]}`, function(error, results, fields) {
            if (error) throw error;

            if (results[0].length === 0) return message.channel.send("\`User has not yet been binded.\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

            message.channel.send(`User is binded to code ${results[0].code}.`).then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);
        });  
    }
}