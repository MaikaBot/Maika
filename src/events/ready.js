const { Event } = require('../core');
const { Statuses } = require('../assets/game-statuses');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, 'ready');

        this.current = Statuses[Math.floor(Math.random() * Statuses.length)];
    }

    emit() {
        if (!this.client.user.bot) {
            this.client.logger.warn('Hello! You\'re running Maika as a selfuser bot, Maika is not a user/selfbot! Destroying...');
            this.client.destroy();
        }

        this.client.editStatus('online', {
            name: this.current.name.replace('{{prefix}}', process.env.MAIKA_PREFIX),
            type: this.current.type
        });
        this.client.logger.info('Maika successfully connected to Discord OwO');
        this.client.startRedditFeeds();
        setTimeout(() => {
            this.client.editStatus('online', {
                name: this.current.name.replace('{{prefix}}', process.env.MAIKA_PREFIX),
                type: this.current.type
            });
        }, 60 * 1000);
    }
}