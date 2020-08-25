require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const {
  createUser,
  retrieveUser,
  updateUser,
  deleteUser,
} = require('../utils/db');

describe('Testing CRUD for User model', () => {
  const testingId = uuidv4();
  const sampleStates = ['testing-0', 'testing-1'];

  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  });

  it('should create a new user', async () => {
    await createUser(testingId);
  });

  it('should retrieve the newly created user', async () => {
    const doc = await retrieveUser(testingId);
    const { user } = doc;
    expect(user).toEqual(testingId);
  });

  it('should update the user', async () => {
    await updateUser(testingId, sampleStates);
    const doc = await retrieveUser(testingId);
    const { states } = doc;
    const parsedStates = states.toObject();

    expect(parsedStates.length).toEqual(sampleStates.length);

    for (let i = 0; i < sampleStates.length; i += 1) {
      const sourceState = sampleStates[i];
      const targetState = parsedStates[i];

      expect(sourceState).toEqual(targetState);
    }
  });

  it('should delete the specified user', async () => {
    await deleteUser(testingId);
    const doc = await retrieveUser(testingId);

    expect(doc).toBeNull();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
