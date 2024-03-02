import solace from 'solclientjs';

import { Client } from './client.js';

export class Publisher extends Client {
	public async publish(topic: string, content: string) {
		await this.ready;

		const message = solace.SolclientFactory.createMessage();

		message.setDestination(
			solace.SolclientFactory.createTopicDestination(topic),
		);
		message.setBinaryAttachment(content);
		message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

		this.session.send(message);
	}
}
