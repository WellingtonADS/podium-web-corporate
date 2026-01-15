import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { fetchBillingRecords } from "../../services/api";

vi.mock("axios");

describe("api service", () => {
  it("fetchBillingRecords calls axios.get", async () => {
    (axios.get as unknown as jest.Mock).mockResolvedValue({ data: [] });
    const res = await fetchBillingRecords();
    expect(axios.get).toHaveBeenCalled();
    expect(res).toEqual([]);
  });
});
