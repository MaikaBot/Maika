const Processor          = require('../processor');
const CommandMessage     = require('../message');
const RatelimitProcessor = require('./ratelimits');

module.exports = class CommandProcessor extends Processor {
    /**
     * The command processor is the processor to process commands
     * 
     * Methods:
     *  - `CommandProcessor.process(msg: Eris.Message) => void`: The process function is where the magic happens. It's an overidden function from the `BaseProcessor` class.
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        super(bot);

        this.ratelimit = new RatelimitProcessor(bot);
    }

    /**
     * Process all of the command related messages
     * 
     * @param {import('eris').Message} msg The message from the event emitted
     * @returns {void} A void function of the command running
     */
    async process(msg) {
        if (msg.author.bot || !this.bot.ready)
            return;

        const blacklist = this.isBlacklisted(msg.author);
        if (blacklist)
            return msg.channel.createMessage(`<@${msg.author.id}>, you are prohibited of using me!`);

        const guildPrefix = this.bot.settings.get(msg.channel.guild.id, 'prefix', process.env.MAIKA_PREFIX);
        let prefix;
        const mention = new RegExp(`^<@!?${this.bot.user.id}> `).exec(msg.content);
        let prefixes = [process.env.MAIKA_PREFIX, 'x!', `${mention}`, guildPrefix];

        for (const i of prefixes)
            if (msg.content.startsWith(i))
                prefix = i;

        if (!prefix)
            return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift();
        const cmd = this.bot.registry.commands.filter(s => s.command === command || s.aliases.includes(command));
        const message = new CommandMessage(this.bot, msg, args);

        if (cmd[0].checks.guild && msg.channel.type === 1)
            return message.reply(`<@${message.sender.id}>, Please report to a Discord guild.`);
        if (cmd[0].checks.owner && !this.bot.owners.includes(message.sender.id))
            return message.reply(`<@${message.sender.id}>, You're not my owners.`);

        await this.ratelimit.process(message);

        try {
            await cmd[0].execute(this.bot, message);
        } catch(ex) {
            message.reply(`<@${msg.author.id}>, an error occured while processing the \`${cmd[0].command}\` command.\n\`\`\`js\n${ex.stack > 1990 ? '-- To long to process' : ex.stack}\`\`\``);
        }
    }

    /**
     * Process the blacklist
     * 
     * @param {import('eris').User} user The user
     * @returns {boolean}
     */
    isBlacklisted(user) {
        const blacklist = this.bot.settings.get('global', 'blacklist', []);
        if (blacklist.includes(user.id))
            return true;
        else
            return false;
    }
};