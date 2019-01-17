const { Schema } = require('mongoose');
module.exports = {
    name: 'guilds',
    schema: new Schema({
        guildID: { type: String, default: null },
        prefix: { type: String, default: process.env.MAIKA_PREFIX },
        reddit: {
            enabled: { type: Boolean, default: false },
            channelID: { type: String, default: null }
        },
        twitch: {
            enabled: { type: Boolean, default: false },
            channelID: { type: String, default: null }
        },
        starboard: {
            threshold: { type: Number, default: 1 },
            enabled: { type: Boolean, default: false },
            channelID: { type: String, default: null }
        },
        logging: {
            enabled: { type: Boolean, default: false },
            channelID: { type: String, default: null }
        },
        social: {
            enabled: { type: Boolean, default: false },
            levelNotice: { type: Boolean, default: false}
        },
        tags: { type: Array, default: [] },
        blacklist: []
    })
};