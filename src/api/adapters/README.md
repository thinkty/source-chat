## Adapters

Adapters, in cooperation with the [handler](https://github.com/thinkty/dialogflow-editor-server/blob/master/src/api/adapters/handler.js) and the [action](https://github.com/thinkty/dialogflow-editor-server/blob/master/src/api/adapters/action.js) module, are the core modules in the [chatbot segment](https://github.com/thinkty/dialogflow-editor-server#chatbot) of the server.

Adapters are the operators that connects the server and the specified chat platform such as Discord, Slack, etc.
It relays the user inputs from the platform to the server and sends the responses from the server back to the user.

The ones that decide the flow of the conversation based on the user inputs are the handler and the action module.
The handler does the following major tasks in sequence to handle user inputs:
- Retrieves the current user state
- Detects intent with the user state and input
- Looks up the state transition table for next states based on the detected intent and current state
- If action is specified by the intent, calls the action module to decide the next states of the user
- Update the user state
- Send the response to the adapter to send to the user

During the process of handling the user input, if an action is specified in the intent, that means that the server has to decide the next states based on the following factors:
- **who** user id `string`
- **what** user input `string`, next states `string[]`
- **when / where** current states `string[]`
- **how** action `string`

After handling the action, the response to send to the user and the next states should be returned.
