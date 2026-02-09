import "@testing-library/jest-dom";
import { server } from "./__mocks__/server";

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });
