// src/config/__mocks__/postgres.js
const mockDb = {
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn(),
};

export default mockDb;
