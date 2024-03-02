import solace from 'solclientjs';
import { Client } from './client.js';
export class Subscriber extends Client {
    constructor(options) {
        super(options);
        this.session.on(solace.SessionEventCode.MESSAGE, message => {
            console.log('GOT MESSAGE');
            const destination = message.getDestination();
            if (destination) {
                this.emit(destination.getName(), message.getBinaryAttachment());
            }
        });
    }
    async startSubscription(topic) {
        if (this.listenerCount(topic) > 1) {
            return;
        }
        await this.ready;
        this.session.subscribe(solace.SolclientFactory.createTopicDestination(topic), true, topic, 10000);
        return this.waitForEvent(solace.SessionEventCode.SUBSCRIPTION_OK, solace.SessionEventCode.SUBSCRIPTION_ERROR);
    }
    async stopSubscription(topic) {
        await this.ready;
        this.session.unsubscribe(solace.SolclientFactory.createTopicDestination(topic), true, topic, 10000);
        return this.waitForEvent(solace.SessionEventCode.SUBSCRIPTION_OK, solace.SessionEventCode.SUBSCRIPTION_ERROR);
    }
    async subscribe(topic, fn) {
        super.on(topic, fn);
        return this.startSubscription(topic);
    }
    async unsubscribe(topic, fn) {
        super.off(topic, fn);
        if (this.listenerCount(topic) === 0) {
            await this.stopSubscription(topic);
        }
    }
}
//# sourceMappingURL=subscriber.js.map