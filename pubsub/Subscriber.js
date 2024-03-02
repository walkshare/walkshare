require("dotenv").config();

var TopicSubscriber = function (solaceModule) {
	var solace = solaceModule;
	var subscriber = {};
	subscriber.session = null;
	// needs to be queried from db rather than using an array
	var subscribedTo = [];

	// Establishes connection to Solace PubSub+ Event Broker
	subscriber.connect = () =>
		new Promise((resolve) => {
			try {
				subscriber.session = solace.SolclientFactory.createSession({
					url: process.env.HOSTURL,
					vpnName: process.env.VPN,
					userName: process.env.USER,
					password: process.env.PASSWORD,
				});
			} catch (error) {
				console.log(error.toString());
			}
			// define session event listeners
			subscriber.session.on(
				solace.SessionEventCode.UP_NOTICE,
				function (sessionEvent) {
					console.log("=== Successfully connected and ready to subscribe. ===");

					resolve();
				}
			);

			subscriber.session.on(
				solace.SessionEventCode.CONNECT_FAILED_ERROR,
				function (sessionEvent) {
					console.log(
						"Connection failed to the message router: " +
						sessionEvent.infoStr +
						" - check correct parameter values and connectivity!"
					);
				}
			);

			// define message event listener
			subscriber.session.on(
				solace.SessionEventCode.MESSAGE,
				function (message) {
					console.log(
						'Received message: "' +
						message.getBinaryAttachment() +
						'", details:\n' +
						message.dump()
					);
				}
			);
			// connect the session
			try {
				subscriber.session.connect();
			} catch (error) {
				console.log(error.toString());
			}
		});

	// Subscribes to topic on Solace PubSub+ Event Broker
	subscriber.subscribe = (topicName) => {
		if (subscriber.session !== null) {
			if (subscribedTo.includes(topicName)) {
				console.log(
					'Already subscribed to "' +
					topicName +
					'" and ready to receive messages.'
				);
			} else {
				console.log("Subscribing to topic: " + topicName);
				try {
					subscriber.session.subscribe(
						solace.SolclientFactory.createTopicDestination(topicName),
						true, // generate confirmation when subscription is added successfully
						topicName, // use topic name as correlation key
						10000 // 10 seconds timeout for this operation
					);
					subscribedTo.push(topicName);
				} catch (error) {
					console.log(error.toString());
				}
			}
		} else {
			console.log(
				"Cannot subscribe because not connected to Solace PubSub+ Event Broker."
			);
		}
	};

	subscriber.exit = function () {
		subscriber.disconnect();
	};

	// Unsubscribes from topic on Solace PubSub+ Event Broker
	subscriber.unsubscribe = (topicName) => {
		if (subscriber.session !== null) {
			if (subscribedTo.includes(topicName)) {
				console.log("Unsubscribing from topic: " + topicName);
				try {
					subscriber.session.unsubscribe(
						solace.SolclientFactory.createTopicDestination(topicName),
						true, // generate confirmation when subscription is removed successfully
						topicName, // use topic name as correlation key
						10000 // 10 seconds timeout for this operation
					);
				} catch (error) {
					console.log(error.toString());
				}
			} else {
				console.log(
					'Cannot unsubscribe because not subscribed to the topic "' +
					topicName +
					'"'
				);
			}
		} else {
			console.log(
				"Cannot unsubscribe because not connected to Solace PubSub+ Event Broker."
			);
		}
	};

	subscriber.disconnect = () => {
		console.log("Disconnecting from Solace PubSub+ Event Broker...");
		if (subscriber.session !== null) {
			try {
				subscriber.session.disconnect();
				subscriber.session.dispose();
			} catch (error) {
				console.log(error.toString());
			}
		} else {
			console.log("Not connected to Solace PubSub+ Event Broker.");
		}
	};

	return subscriber;
};

var solace = require("solclientjs").debug; // logging supported

// Initialize factory with the most recent API defaults
var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

// enable logging to JavaScript console at WARN level
// NOTICE: works only with ('solclientjs').debug
solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

// create the subscriber, specifying the name of the subscription topic
var subscriber = new TopicSubscriber(solace, "walkshare");

(async () => {
	await subscriber.connect();

	subscriber.subscribe("walkshare");
	subscriber.subscribe("testcategory2");
	subscriber.unsubscribe("testcategory2");

	// wait to be told to exit
	console.log("Press Ctrl-C to exit");
})();
