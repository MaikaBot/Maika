const Event = require('../structures/event');
const { stripIndents } = require('common-tags');

module.exports = class GuildRoleDeleted extends Event {
    constructor(bot) {
        super(bot, { event: 'guildRoleDelete', emitter: 'on' });
    }

    run(role) {
        const data = this.bot.r.table('guilds').get(role.guild.id).run();
        if (data.logging.enabled && guild.channels.has(data.logging.channelID) && guild.channels.get(data.logging.channelID).permissionsOf(this.bot.user.id).has('sendMessages'))
        guild.channels.get(data.logging.channelID).createMessage({
            embed: {
                description: stripIndents`
                    Role **${role.name}** was deleted
                `,
                color: this.bot.color
            }
        });
    }
};