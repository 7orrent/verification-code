const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "unbind",
    category: "info",
    description: "Unbinds a user from their code.",
    run: (client, message, args, conn) => {

        message.delete();

        let user = message.member.user;
        let member = message.guild.member(user);

        if (!member.roles.cache.find(r => r.name === "Followers")) return message.channel.send("\`Invalid Permissions.\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        if (args.length === 0) return message.channel.send("\`Invalid Arguements.\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        let bindUserId = args[0] 


        conn.query(`DELETE FROM verificationcodes WHERE discordid = ${bindUserId}`);
        message.channel.send("`User has been unbinded.`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);
    }
}