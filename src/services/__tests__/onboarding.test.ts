import { parseEmployeesCsv } from "../onboarding";

const csv = `Name,Email,Cost_Center\nJoao Silva,joao@empresa.com,1\nMaria,invalid-email,2\n`;

describe("parseEmployeesCsv", () => {
  it("parses valid rows and reports errors", async () => {
    // Create a File-like object that implements text()
    const fileLike: { text: () => Promise<string> } = {
      async text() {
        return csv;
      },
    };

    const { rows, errors } = await parseEmployeesCsv(
      fileLike as unknown as File
    );

    expect(rows.length).toBe(1);
    expect(errors.length).toBe(1);
    expect(rows[0].email).toBe("joao@empresa.com");
  });
});
