# Walkshare

[![build status](https://github.com/walkshare/walkshare/actions/workflows/ci.yml/badge.svg)](.github/workflows/ci.yml)
[![license](https://img.shields.io/github/license/walkshare/walkshare.svg)](LICENSE)

A community driven event planner

## Inspiration

While creating Walkshare we had a few goals in mind. First, to promote a healthy and sustainable way to explore without any repercussions to the environment. Second, to help individuals connect with each other through the planning and scheduling of in person events. Finally, we wanted a simple UI and easy to use UI to allow users to quickly find attractions based off of their interests and location.

## What it does

Walkshare is centered around the use of MapBox. Users can interact with the map dynamically and view Points of Interests (POIs) that are nearby to their live location. Creating and planning an event to a POI is simple and quick; itineraries can be auto generated by AI. After creating an routes are automatically generated and displayed and nearby users are notified of the event.

## How we built it

- Mapbox to show user's live location
- Components created with daisyUI and TailwindCSS
- Reactivity and routing built with SvelteKit
- Real-time notifications handled with PubSub+
- Bundling and code splitting performed by Vite
- Web server created with tRPC
- Authentication managed with Lucia
- Personalized itineraries created with OpenAI
- Data stored in a PostgreSQL database handled with Drizzle

## Challenges we ran into

Learning Solace's PubSub+ proved to be a difficult but rewarding challenge. Our team hadn't heard of PubSub or even Event Brokers prior to uOttaHack. Diving into Solace's technologies seemed daunting at first, however, with Solace's instructions on uottahack.solace.cloud as well as their documentation, setting up our very own Event Broker proved to be a straightforward task. After setting up the Event Broker, we quickly found solclientjs which had comprehensive documentation and many useful examples.

## What we learned

We used many new technologies during uOttahack. Our project wouldn't be possible without MapBox, we learned to create a dynamic map which a user can interact with. Creating a database can sometimes be tough without structure, so we decided to learn Drizzle which allowed us to create and use schemas on our data. Finally, thanks to Solace we learned about Event Brokers and how to use them.

## What's next for Walkshare

- Language support
- Ratings
- Messaging using PubSub+
- Leaderboard and points system
- Email reminder support
