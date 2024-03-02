import 'dotenv/config';

import solace from 'solclientjs';
import { Publisher } from './publisher.js';
import { Subscriber } from './subscriber.js';

(async () => {
	const options = {
		url: process.env.SOLACE_HOSTURL,
		vpnName: process.env.SOLACE_VPN,
		userName: process.env.SOLACE_USER,
		password: process.env.SOLACE_PASSWORD,
	} satisfies solace.SessionProperties;

	const publisher = new Publisher(options);
	const subscriber = new Subscriber(options);

	await subscriber.subscribe('hello_world', console.log);
	await publisher.publish('hello_world', 'Hello, World!');
})();
