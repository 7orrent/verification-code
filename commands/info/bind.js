const { MessageEmbed } = require("discord.js");

function generateCode() {
    let min = 100000000
    let max = 500000000

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: "bind",
    category: "info",
    description: "Binds a user to a code.",
    run: (client, message, args, conn) => {

        message.delete();

        let user = message.member.user;
        let member = message.guild.member(user);

        if (!member.roles.cache.find(r => r.name === "Followers")) return message.channel.send("\`Invalid Permissions.\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        if (args.length === 0) return message.channel.send("\`Invalid Arguements.\`").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error);

        let bindName = args[1]
        let bindUserId = args[0]

        if (isNaN(bindUserId)) return message.channel.send("\`The provided userid was not a valid number\`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);
        if (bindUserId.length < 18) return message.channel.send("\`The provided userid doesn't meet the requirements.\`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);
        
        const quoteArray = [`"`,"`",`'`];
        for (let i=0; i <quoteArray.length;i++) {
            const elem = quoteArray[i]

            if (bindName.includes(elem)) return console.log("User: " + member.user.username + " entered an invalid piece of text.")
        }

        let userCode = generateCode()

        conn.query(`INSERT INTO verificationcodes(\`name\`,\`code\`,\`discordid\`) VALUES("${bindName}", ${userCode}, ${bindUserId})`);
        message.channel.send("`User has been binded, dm'ing you their verification code.`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);
        member.send(`\`${bindName}'s verification code is: ${userCode}\``);
    }
}