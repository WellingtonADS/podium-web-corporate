import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { fetchBillingRecords } from "../../services/api";

vi.mock("axios", () => {
  const mockGet = vi.fn().mockResolvedValue({ data: [] });
  return {
    default: {
      create: () => ({
        get: mockGet,
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
      }),
      get: mockGet,
    },
  };
});

describe("api service", () => {
  it("fetchBillingRecords calls axios.get", async () => {
    (axios.get as unknown as any).mockResolvedValue({ data: [] });
    const res = await fetchBillingRecords();
    expect(axios.get).toHaveBeenCalled();
    expect(res).toEqual([]);
  });
});
