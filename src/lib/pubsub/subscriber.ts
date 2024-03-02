import solace from 'solclientjs';

import { Client } from './client.js';

export class Subscriber extends Client {
	constructor(options: solace.SessionProperties) {
		super(options);

		this.session.on(
			solace.SessionEventCode.MESSAGE,
			message => {
				console.log('GOT MESSAGE');
				const destination = message.getDestination();

				if (destination) {
					this.emit(destination.getName(), message.getBinaryAttachment());
				}
			},
		);
	}

	private async startSubscription(topic: string) {
		if (this.listenerCount(topic) > 1) {
			return;
		}

		await this.ready;

		this.session.subscribe(
			solace.SolclientFactory.createTopicDestination(topic),
			true,
			topic,
			10_000,
		);

		return this.waitForEvent(
			solace.SessionEventCode.SUBSCRIPTION_OK,
			solace.SessionEventCode.SUBSCRIPTION_ERROR,
		);
	}

	private async stopSubscription(topic: string) {
		await this.ready;

		this.session.unsubscribe(
			solace.SolclientFactory.createTopicDestination(topic),
			true,
			topic,
			10_000,
		);

		return this.waitForEvent(
			solace.SessionEventCode.SUBSCRIPTION_OK,
			solace.SessionEventCode.SUBSCRIPTION_ERROR,
		);
	}

	public async subscribe(topic: string, fn: (message: string) => void) {
		super.on(topic, fn);

		return this.startSubscription(topic);
	}

	public async unsubscribe(topic: string, fn: (message: string) => void) {
		super.off(topic, fn);

		if (this.listenerCount(topic) === 0) {
			await this.stopSubscription(topic);
		}
	}
}
