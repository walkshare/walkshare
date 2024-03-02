import EventEmitter from 'events';
import solace from 'solclientjs';

const factory = new solace.SolclientFactoryProperties();
factory.profile = solace.SolclientFactoryProfiles.version10;

solace.SolclientFactory.init(factory);

export class Client extends EventEmitter {
	protected solace: typeof solace;
	protected session!: solace.Session;

	protected ready: Promise<void>;

	constructor(options: solace.SessionProperties) {
		super();

		this.solace = solace;
		this.ready = this.connect(options);
	}

	protected async waitForEvent(ok: solace.SessionEventCode, err: solace.SessionEventCode) {
		return new Promise<void>((resolve, reject) => {
			this.session.on(ok, resolve);
			this.session.on(err, reject);
		});
	}

	public async connect(options: solace.SessionProperties) {
		this.session =
			solace.SolclientFactory.createSession(options);

		this.session.connect();

		return this.waitForEvent(
			solace.SessionEventCode.UP_NOTICE,
			solace.SessionEventCode.CONNECT_FAILED_ERROR,
		);
	}

	public async disconnect() {
		this.session.disconnect();

		return new Promise<void>(resolve => {
			this.session.on(solace.SessionEventCode.DISCONNECTED, () => {
				this.session.dispose();
				resolve();
			});
		});
	}
}
