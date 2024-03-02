import EventEmitter from "events";
import solace from "solclientjs";

class Publisher extends EventEmitter {
	private solace: typeof solace;
	private session?: solace.Session;

	private async connect(options: solace.SessionProperties) {
		// if already connected to sessions
		if (this.session) return;

		const session = (this.session =
			solace.SolclientFactory.createSession(options));

		return new Promise<void>((resolve, reject) => {
			// define session event listeners
			session.on(
				solace.SessionEventCode.UP_NOTICE,
				(sessionEvent: solace.SessionEvent) => {
					console.log(
						"=== Successfully connected and ready to publish messages. ==="
					);
					resolve();
				}
			);

			session.on(
				solace.SessionEventCode.CONNECT_FAILED_ERROR,
				function (sessionEvent: solace.SessionEvent) {
					console.log(
						"Connection failed to the message router: " +
							sessionEvent.infoStr +
							" - check correct parameter values and connectivity!"
					);
					reject();
				}
			);
		});
	}

	public async publish(content: string, topic: string) {
		// set message attributes
		const message = solace.SolclientFactory.createMessage();

		message.setDestination(
			solace.SolclientFactory.createTopicDestination(topic)
		);
		message.setBinaryAttachment(content);
		message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

		// pub msg
		this.session?.send(message);
	}

	public async disconnect() {
		// if not connected to session
		if (!this.session) return;

		await this.session.disconnect();
		this.session.dispose();
		this.session = undefined;
	}
}
