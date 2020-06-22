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

        conn.query(`SELECT * FROM verificationcodes WHERE discordid = ${member.user.id}`, function(error, results, fields) {
            if (error) throw error;

            if (results[0].length !== 0) return message.channel.send("`User is already bound to a code.`");


            let bindName = args[1]
            let bindUserId = args[0]

            if (isNaN(bindUserId)) return message.channel.send("\`The provided userid was not a valid number\`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);
            if (bindUserId.length < 18) return message.channel.send("\`The provided userid doesn't meet the requirements.\`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);

            if (bindName.length === 0) return message.channel.send("`Please provide a valid name.`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);
            if (bindName.length > 255) return message.channel.send("`Name is invalid, must be under the length of 255.`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);
            
            const quoteArray = [`"`,"`",`'`];
            for (let i=0; i <quoteArray.length;i++) {
                const elem = quoteArray[i]

                if (bindName.includes(elem)) return message.channel.send(`\`Invalid text component used: ${elem}\``).then(m => {m.delete({ timeout: 5000})}).catch(console.error);
            }

            let userCode = generateCode()

            conn.query(`INSERT INTO verificationcodes(\`name\`,\`code\`,\`discordid\`) VALUES("${bindName}", ${userCode}, ${bindUserId})`);
            message.channel.send("`User has been binded, dm'ing you their verification code.`").then(m => {m.delete({ timeout: 5000})}).catch(console.error);
            member.send(`\`${bindName}'s verification code is: ${userCode}\``);
        
        });  
    }
}