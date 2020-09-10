# Source Chat

## Overview
Source chat is a template server for managing intents on Dialogflow using the [Dialogflow Editor](https://github.com/thinkty/dialogflow-editor) and also serving as a chatbot hub for various chat application platforms such as [Slack](https://api.slack.com/bot-users) and [Discord](https://discordpy.readthedocs.io/en/latest/discord.html).
You can easily connect other chat platforms by adding your own platform adapters to handle receiving and sending messages.

## System Layout
Source Chat can be divided into three parts:

### Editor
The editor segment handles the interaction between the [Dialogflow Editor](https://github.com/thinkty/dialogflow-editor) and Source Chat server instance.
When a user exports the graph from the Dialogflow Editor to an Source Chat server, intents will be parsed from the graph data and be sent to Dialogflow.
After Dialogflow has been successfully updated, the server will update its own state transition table, which stores the flow locally.
![system layout for editor](https://imgur.com/OfWKkHT.png)
1. The end user will edit the graph using the Dialogflow Editor tool
2. Once done, the user will send the graph to a Source Chat server including the graph and the agent name
3. Once the server receives the graph, it will **validate** the graph, **parse** intents from the graph, and **update** Dialogflow with the new intents
4. The update process will be executed using the [IntentsClient](https://googleapis.dev/nodejs/dialogflow/latest/v2.IntentsClient.html#batchUpdateIntents) API from Dialogflow
5. Dialogflow will verify the intents for the last time and proceed to update
6. If any error is detected during the process, Dialogflow will send the error back to the server and the server will notify the client
7. Once the intents have been added successfully, the server will update its own State Transition Table which manages the flow of the conversation
8. If the process was successful, a 200 OK will be sent back to the client

### Version Controller
Compared to other components, the [version controller](https://github.com/thinkty/source-chat/tree/master/src/api/graphManager) does a simple job of keeping various versions of the graph.
The API can be used to **create** a new graph and **get** all the graphs with the time of creation.

### Chatbot
The chatbot segment handles the interaction between the message platform such as Slack or Discord and the server.
![system layout for chatbot](https://imgur.com/o0VtSQj.png)
1. The end user is the person communicating with the chatbot
2. The end user sends a message on the platform (Slack or Discord)
3. The platform then adds additional payloads such as user identifier, the message, and more depending on the platform
4. The platform calls the registered server with the payloads or sometimes fires an event to notify the server
5. The server then receives the payload and get the user's latest status in the flow
6. The server sends a request to Dialogflow to detect which intent the user's message falls into based on the context (state) and the user input
7. Based on the current context of the user and the input (message), Dialogflow computes the appropriate intent
8. Dialogflow responds with an intent that may contain an action which will help the server to make decisions
9. After getting the intent back from Dialogflow, if the intent's action is specified, that has to be handled. This process is better explained in the [README](https://github.com/thinkty/source-chat/tree/master/src/api/adapters) for the adapters.
10. After deciding the next states of the user, the server sends message(s) (reply to the user) to the platform
11. After validation, the platform passes on the message to the user

The process above is an abstract version of the single session between a user and the chatbot.
The State Transition Table can be seen as the core of this project as it manages the flow of the conversation.
In the editor segment, the table updates itself with the latest intents from Dialogflow so that it can respond with the appropriate next states when queried in the chatbot segment of this project.
In conclusion, this project is aimed to provide a modular server that can handle multiple chat platforms at once with a single source of flow.

## Installation
I highly recommend using this project with HTTPS as some of the adapters (such as Slack) require an HTTPS endpoint.
If you want to test it locally, I recommend using [ngrok](https://ngrok.com/) to create a tunnel quickly and test it out.

1. Clone and change directory
```
git clone https://github.com/thinkty/dialogflow-editor-server.git
cd dialogflow-editor-server
```
2. Install the dependencies
```
npm install
```
3. Setup the environment variables in a `.env` file. If some of the crucial tokens are not given for an adapter, that adapter will not be enabled. In addition to the adapters, this server also uses MongoDB. Therefore, an additional step of creating a MongoDB cluster might is required beforehand. **!Caution!** Do not expose your .env file to others as it includes sensitive information.

4. If you have any intents with the action value specified and would like to handle it in the server, add the handlers in the [action.js](https://github.com/thinkty/source-chat/tree/master/src/api/adapters). If you are not sure what this process means, please read the Chatbot segment.

5. Start your server
```
npm start
```

## Available Adapters
Below is the list of adapters ready for use with the server.
In the description, there are requirements for the adapter.
The required environment variables should be set for the adapter/bot to function properly.

- [Discord](https://github.com/thinkty/source-chat/tree/master/src/api/adapters/discord.js): It requires `DISCORD_TOKEN` and `DISCORD_BOT_NAME`.`DISCORD_TOKEN` is the bot token (not the client secret) under Bot settings. `DISCORD_BOT_NAME` is the name of the bot and is used to ignore messages sent by the bot itself.
- [Slack](https://github.com/thinkty/source-chat/tree/master/src/api/adapters/slack.js) : It requires `SLACK_BOT_TOKEN`. `SLACK_BOT_TOKEN` is the Bot User OAuth Access Token that can be found under **OAuth & Permissions** in the application page.

## Adding Adapters
To add a chat platform such as Facebook Messenger, WhatsApp, and more, it requires two parts:
- **Access point**: this could be a socket that is initialized at server startup or an endpoint that needs a route to be specified
- **Adapter**: this would be a module that handles receiving messages from the platform and sending replies back to it

Following the requirements, one could easily add custom adapters for their own interface.

## License
MIT
