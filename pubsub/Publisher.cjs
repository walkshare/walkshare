require("dotenv").config();
const util = require("util");
var TopicPublisher = function (solaceModule, topicName) {
	var solace = solaceModule;
	var publisher = {};
	publisher.session = null;
	publisher.topicName = topicName;

	// Establishes connection to Solace PubSub+ Event Broker
	publisher.connect = () =>
		new Promise((resolve) => {
			// create session
			try {
				publisher.session = solace.SolclientFactory.createSession({
					// solace.SessionProperties
					url: process.env.SOLACE_HOSTURL,
					vpnName: process.env.SOLACE_VPN,
					userName: process.env.SOLACE_USER,
					password: process.env.SOLACE_PASSWORD,
				});
			} catch (error) {
				console.log(error.toString());
			}
			// define session event listeners
			publisher.session.on(
				solace.SessionEventCode.UP_NOTICE,
				(sessionEvent) => {
					console.log(
						"=== Successfully connected and ready to publish messages. ==="
					);
					resolve();
				}
			);

			publisher.disconnect = () => {
				console.log("Disconnecting from Solace PubSub+ Event Broker...");
				if (publisher.session !== null) {
					try {
						publisher.session.disconnect();
						publisher.session.dispose();
						publisher.session = null;
					} catch (error) {
						console.log(error.toString());
					}
				} else {
					console.log("Not connected to Solace PubSub+ Event Broker.");
				}
			};

			// connect the session
			try {
				publisher.session.connect();
			} catch (error) {
				console.log(error.toString());
			}
		});

	// publish a message param
	publisher.publish = (m) => {
		// set message attributes
		var message = solace.SolclientFactory.createMessage();
		message.setDestination(
			solace.SolclientFactory.createTopicDestination(publisher.topicName)
		);
		message.setBinaryAttachment(m);
		message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
		console.log(
			'Publishing message "' + m + '" to topic "' + publisher.topicName + '"...'
		);
		// pub msg
		try {
			publisher.session.send(message);
			console.log("Message published.");
		} catch (error) {
			console.log(error.toString());
		}
	};

	return publisher;
};

var solace = require("solclientjs").debug; // logging supported

// Initialize factory with the most recent API defaults
var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

// enable logging to JavaScript console at WARN level
// NOTICE: works only with ('solclientjs').debug
solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

// create the publisher, specifying the name of the subscription topic
var publisher = new TopicPublisher(solace, "hello_world");

// publish message to Solace PubSub+ Event Broker
(async () => {
	await publisher.connect();

	publisher.publish("some message");

	// disconnect
	publisher.disconnect();
})();
