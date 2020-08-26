## Testing

Framework: [**Jest**](https://jestjs.io/)
Scripts:
- `npm test` : Run the test cases
- `npm run test:cov` : Run the test cases and report coverage
- `npm run test:watch` : Run only the modified test cases
- `npm run test:watchAll` : Run all test cases when tests are modified
- `npm run test:leaks` : Run the test cases and watch for [leaks](https://jestjs.io/docs/en/cli#--detectopenhandles)

Tests:
- [API routes](https://github.com/thinkty/dialogflow-editor-server/blob/master/src/tests/routes.test.js) : tested using [supertest](https://github.com/visionmedia/supertest) and testing the individual routes
- [Database](https://github.com/thinkty/dialogflow-editor-server/blob/master/src/tests/db.test.js) : testing the controllers for the User model
- [State Table](https://github.com/thinkty/dialogflow-editor-server/blob/master/src/tests/stateTable.test.js) : testing the singleton class' `update` method and `lookup` method

Currently, there aren't any unit tests for the individual modules and functions except for the database tests and the intent table tests.
