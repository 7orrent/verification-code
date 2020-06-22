const { MessageEmbed } = require("discord.js");

function generateCode() {
    let min = 100000000
    let max = 500000000

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: "verify",
    aliases: ["identify", "confirmidentity"],
    category: "info",
    description: "Verify your identity.",
    run: (client, message, args, conn) => {

        message.delete();

        let user = message.member.user;
        let member = message.guild.member(user);

        if (!member.roles.cache.find(r => r.name === "Outsiders")) return message.channel.send("\`You're already verified!\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        if (args.length === 0) return message.channel.send("\`Please provide a valid code.\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        conn.query(`SELECT * FROM verificationcodes WHERE discordid = ${member.user.id}`, function(error, results, fields) {
            if (error) throw error;

            if (results[0].length === 0) return;

            if (args[0] == results[0].code) {
                message.channel.send(`\`Verification confirmed, welcome ${results[0].name}\``).then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);
                member.roles.add("724352305088168058");
                member.roles.remove("724353377466581022");
                member.setNickname(results[0].name);

                client.channels.cache.get("724485839018786917").send(`\`User, ${member.user.username}#${member.user.discriminator}, has been verified successfully.\``);
            } else {
                message.channel.send(`\`Verification Failed, Incorrect Code.\``).then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);
            }
        });  
    }
}