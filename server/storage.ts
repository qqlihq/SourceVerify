// Storage interface for the application
// This app doesn't need persistent storage for verification requests
// All processing is done in-memory per request

export interface IStorage {
  // No storage methods needed for this app
  // All verification is stateless
}

export class MemStorage implements IStorage {
  constructor() {
    // No state needed
  }
}

export const storage = new MemStorage();
