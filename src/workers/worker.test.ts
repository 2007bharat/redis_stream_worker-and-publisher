import { describe, test, expect, beforeEach, mock } from "bun:test";

// 1. पहले से ही सभी Mocks और उनके स्पाइज (spies) define करें
const mockCreateMany = mock(() => Promise.resolve({ count: 1 }));
const mockTickCreate = mock(() => Promise.resolve({}));
const mockXAck = mock(() => Promise.resolve(true));
const mockXAutoClaim = mock(() => Promise.resolve({ messages: [] }));
const mockXReadGroup = mock(() => Promise.resolve([]));
const mockAxiosGet = mock(() => Promise.resolve({ status: 200 }));

// 2. Bun के mock.module का सही सेटअप (इम्पोर्ट्स से ऊपर)
mock.module("../schema", () => ({
  prismaClient: {
    processedEvent: {
      createMany: mockCreateMany,
    },
    website_Ticks: {
      create: mockTickCreate,
    },
  },
}));

mock.module("../redis/redis_function", () => ({
  xAck: mockXAck,
  xAutoClaim: mockXAutoClaim,
  xreadGroup: mockXReadGroup,
}));

mock.module("axios", () => ({
  default: {w
    get: mockAxiosGet,
  },
}));

// 3. अब वर्कर फंक्शन को इम्पोर्ट करें
import { processEventFunction } from "./worker";
describe("Uptime Worker Tests (Bun)", () => {
  beforeEach(() => {
    // हर टेस्ट से पहले सारे मॉक्स को क्लियर करें
    mockCreateMany.mockClear();
    mockTickCreate.mockClear();
    mockXAck.mockClear();
    mockXAutoClaim.mockClear();
    mockXReadGroup.mockClear();
    mockAxiosGet.mockClear();
  });

  test("1. Should process a NEW event successfully when website is UP", async () => {
    mockCreateMany.mockResolvedValue({ count: 1 });
    mockAxiosGet.mockResolvedValue({ status: 200 });

    const mockEvent = {
      id: "event_123",
      message: {
        id: "web_456",
        url: "https://httpbin.org/status/200",
      },
    };

    await processEventFunction(mockEvent);

    expect(mockCreateMany).toHaveBeenCalledTimes(1);
    expect(mockAxiosGet).toHaveBeenCalledWith(
      "https://httpbin.org/status/200",
      { timeout: 5000 },
    );
    expect(mockTickCreate).toHaveBeenCalled();
    expect(mockXAck).toHaveBeenCalledWith("event_123");
  });

  test("2. Should skip ALREADY PROCESSED event (Idempotency check)", async () => {
    // Event पहले से मौजूद है (count = 0)
    mockCreateMany.mockResolvedValue({ count: 0 });

    const mockEvent = {
      id: "event_duplicate",
      message: {
        id: "web_456",
        url: "https://httpbin.org/status/200",
      },
    };

    await processEventFunction(mockEvent);

    expect(mockCreateMany).toHaveBeenCalledTimes(1);
    expect(mockAxiosGet).not.toHaveBeenCalled(); // Axios कॉल नहीं होना चाहिए
    expect(mockTickCreate).not.toHaveBeenCalled();
    expect(mockXAck).toHaveBeenCalledWith("event_duplicate");
  });

  test("3. Should handle website DOWN correctly when Axios fails", async () => {
    mockCreateMany.mockResolvedValue({ count: 1 });
    mockAxiosGet.mockRejectedValue(new Error("Network Error"));

    const mockEvent = {
      id: "event_down",
      message: {
        id: "web_456",
        url: "https://downstream-website.com",
      },
    };

    await processEventFunction(mockEvent);

    expect(mockTickCreate).toHaveBeenCalled();
    expect(mockXAck).toHaveBeenCalledWith("event_down");
  });
});
