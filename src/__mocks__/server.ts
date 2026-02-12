import { setupServer } from "msw/node";
import { mockHandlers } from "./mockHandlers";

export const server = setupServer(...mockHandlers);
