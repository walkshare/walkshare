import EventEmitter from 'events';
import solace from 'solclientjs';

class Publisher extends EventEmitter {
	private solace: typeof solace;
	private session?: solace.Session;

	private async connect(options: solace.SessionProperties) {
		if (this.session) return;

		this.session = solace.SolclientFactory.createSession(options);

		return new Promise((resolve, reject) => {

		});
	}

	public async publish(content: string, topic: string) {
		const message = solace.SolclientFactory.createMessage();

		message.setDestination(
			solace.SolclientFactory.createTopicDestination(topic),
		);

		message.setBinaryAttachment(content);
		message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);


	}
}
