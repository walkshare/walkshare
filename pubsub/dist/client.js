import EventEmitter from 'events';
import solace from 'solclientjs';
const factory = new solace.SolclientFactoryProperties();
factory.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factory);
export class Client extends EventEmitter {
    solace;
    session;
    ready;
    constructor(options) {
        super();
        this.solace = solace;
        this.ready = this.connect(options);
    }
    async waitForEvent(ok, err) {
        return new Promise((resolve, reject) => {
            this.session.on(ok, resolve);
            this.session.on(err, reject);
        });
    }
    async connect(options) {
        this.session =
            solace.SolclientFactory.createSession(options);
        this.session.connect();
        return this.waitForEvent(solace.SessionEventCode.UP_NOTICE, solace.SessionEventCode.CONNECT_FAILED_ERROR);
    }
    async disconnect() {
        this.session.disconnect();
        return new Promise(resolve => {
            this.session.on(solace.SessionEventCode.DISCONNECTED, () => {
                this.session.dispose();
                resolve();
            });
        });
    }
}
//# sourceMappingURL=client.js.map