import { rest } from "msw";
import { Booking } from "../../services/api";

// Derive API bases from env for consistency with app code
type ImportMetaWithEnv = ImportMeta & {
  env: { VITE_API_URL?: string; VITE_API_PROD_URL?: string };
};
const API_BASE =
  (import.meta as ImportMetaWithEnv).env?.VITE_API_URL ??
  "http://localhost:8000";
// Optional production override for CI/e2e
const PROD_API_BASE =
  (import.meta as ImportMetaWithEnv).env?.VITE_API_PROD_URL ??
  "https://podium-backend-api-production.up.railway.app";

const bookings: Booking[] = [
  {
    id: 1,
    status: "requested",
    origin_address: "Av. Paulista, 1000",
    dest_address: "Rua Augusta, 200",
    passenger_id: 1,
    cost_center_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: "Teste",
  },
];

const _employeeList = [
  {
    id: 1,
    email: "joao@empresa.com",
    full_name: "João Silva",
    role: "employee",
    is_active: true,
    company_id: 1,
    employee_profile: { department: "Marketing", cost_center_id: 1 },
  },
  {
    id: 2,
    email: "maria@empresa.com",
    full_name: "Maria Santos",
    role: "employee",
    is_active: true,
    company_id: 1,
    employee_profile: { department: "Vendas", cost_center_id: 2 },
  },
];

export const handlers = [
  // Auth login
  rest.post("/api/v1/login", async (_req, res, ctx) => {
    return res(ctx.json({ access_token: "test-token" }));
  }),

  // Fetch bookings (support both /api/v1/bookings and /bookings)
  rest.get("/api/v1/bookings", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ bookings }));
  }),
  rest.get("/bookings", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ bookings }));
  }),

  // Absolute URL variants
  rest.get(`${API_BASE}/api/v1/bookings`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ bookings }));
  }),
  rest.get(`${API_BASE}/bookings`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ bookings }));
  }),

  // Production API variants
  rest.get(`${PROD_API_BASE}/api/v1/bookings`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ bookings }));
  }),
  rest.get(`${PROD_API_BASE}/bookings`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ bookings }));
  }),

  // Create booking
  rest.post("/api/v1/bookings", async (req, res, ctx) => {
    const body = await req.json();
    const id = bookings.length + 1;
    const newBooking: Booking = {
      id,
      status: "requested",
      origin_address: body.origin_address,
      dest_address: body.dest_address,
      passenger_id: body.passenger_id,
      cost_center_id: body.cost_center_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: body.notes || null,
    };
    bookings.push(newBooking);
    return res(ctx.status(201), ctx.json(newBooking));
  }),
  rest.post("/bookings", async (req, res, ctx) => {
    const body = await req.json();
    const id = bookings.length + 1;
    const newBooking: Booking = {
      id,
      status: "requested",
      origin_address: body.origin_address,
      dest_address: body.dest_address,
      passenger_id: body.passenger_id,
      cost_center_id: body.cost_center_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: body.notes || null,
    };
    bookings.push(newBooking);
    return res(ctx.status(201), ctx.json(newBooking));
  }),

  // Absolute variants
  rest.post(`${API_BASE}/api/v1/bookings`, async (req, res, ctx) => {
    const body = await req.json();
    const id = bookings.length + 1;
    const newBooking: Booking = {
      id,
      status: "requested",
      origin_address: body.origin_address,
      dest_address: body.dest_address,
      passenger_id: body.passenger_id,
      cost_center_id: body.cost_center_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: body.notes || null,
    };
    bookings.push(newBooking);
    return res(ctx.status(201), ctx.json(newBooking));
  }),
  rest.post(`${API_BASE}/bookings`, async (req, res, ctx) => {
    const body = await req.json();
    const id = bookings.length + 1;
    const newBooking: Booking = {
      id,
      status: "requested",
      origin_address: body.origin_address,
      dest_address: body.dest_address,
      passenger_id: body.passenger_id,
      cost_center_id: body.cost_center_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: body.notes || null,
    };
    bookings.push(newBooking);
    return res(ctx.status(201), ctx.json(newBooking));
  }),

  // Production API POST variants
  rest.post(`${PROD_API_BASE}/api/v1/bookings`, async (req, res, ctx) => {
    const body = await req.json();
    const id = bookings.length + 1;
    const newBooking: Booking = {
      id,
      status: "requested",
      origin_address: body.origin_address,
      dest_address: body.dest_address,
      passenger_id: body.passenger_id,
      cost_center_id: body.cost_center_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: body.notes || null,
    };
    bookings.push(newBooking);
    return res(ctx.status(201), ctx.json(newBooking));
  }),
  rest.post(`${PROD_API_BASE}/bookings`, async (req, res, ctx) => {
    const body = await req.json();
    const id = bookings.length + 1;
    const newBooking: Booking = {
      id,
      status: "requested",
      origin_address: body.origin_address,
      dest_address: body.dest_address,
      passenger_id: body.passenger_id,
      cost_center_id: body.cost_center_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: body.notes || null,
    };
    bookings.push(newBooking);
    return res(ctx.status(201), ctx.json(newBooking));
  }),

  // Cancel booking
  rest.patch("/api/v1/bookings/:id/cancel", (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const idx = bookings.findIndex((b) => b.id === Number(id));
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ detail: "Not found" }));
    bookings[idx].status = "cancelled";
    bookings[idx].updated_at = new Date().toISOString();
    return res(ctx.status(200), ctx.json(bookings[idx]));
  }),
  rest.patch("/bookings/:id/cancel", (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const idx = bookings.findIndex((b) => b.id === Number(id));
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ detail: "Not found" }));
    bookings[idx].status = "cancelled";
    bookings[idx].updated_at = new Date().toISOString();
    return res(ctx.status(200), ctx.json(bookings[idx]));
  }),

  // Absolute cancel variants
  rest.patch(`${API_BASE}/api/v1/bookings/:id/cancel`, (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const idx = bookings.findIndex((b) => b.id === Number(id));
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ detail: "Not found" }));
    bookings[idx].status = "cancelled";
    bookings[idx].updated_at = new Date().toISOString();
    return res(ctx.status(200), ctx.json(bookings[idx]));
  }),
  rest.patch(`${API_BASE}/bookings/:id/cancel`, (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const idx = bookings.findIndex((b) => b.id === Number(id));
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ detail: "Not found" }));
    bookings[idx].status = "cancelled";
    bookings[idx].updated_at = new Date().toISOString();
    return res(ctx.status(200), ctx.json(bookings[idx]));
  }),

  // Production API PATCH cancel variants
  rest.patch(`${PROD_API_BASE}/api/v1/bookings/:id/cancel`, (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const idx = bookings.findIndex((b) => b.id === Number(id));
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ detail: "Not found" }));
    bookings[idx].status = "cancelled";
    bookings[idx].updated_at = new Date().toISOString();
    return res(ctx.status(200), ctx.json(bookings[idx]));
  }),
  rest.patch(`${PROD_API_BASE}/bookings/:id/cancel`, (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const idx = bookings.findIndex((b) => b.id === Number(id));
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ detail: "Not found" }));
    bookings[idx].status = "cancelled";
    bookings[idx].updated_at = new Date().toISOString();
    return res(ctx.status(200), ctx.json(bookings[idx]));
  }),

  // Fetch employees for select (support multiple path variants)
  // Return employee list for any users GET variant to simplify tests
  rest.get("/api/v1/users", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),

  rest.get("/api/v1/users/", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),

  rest.get("/users", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),

  rest.get("/users/", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),

  // Absolute users variants
  rest.get(`${API_BASE}/api/v1/users`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),
  rest.get(`${API_BASE}/api/v1/users/`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),
  rest.get(`${API_BASE}/users`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),
  rest.get(`${API_BASE}/users/`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),

  // Production API users variants
  rest.get(`${PROD_API_BASE}/api/v1/users`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),
  rest.get(`${PROD_API_BASE}/api/v1/users/`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),
  rest.get(`${PROD_API_BASE}/users`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),
  rest.get(`${PROD_API_BASE}/users/`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(_employeeList));
  }),

  // Users batch (simplified)
  rest.post("/users/batch", async (req, res, ctx) => {
    const body = await req.json();
    const results = body.map((u: { email: string }) => ({
      email: u.email,
      status: "created",
    }));
    return res(
      ctx.status(200),
      ctx.json({
        summary: {
          created: results.length,
          conflicts: 0,
          errors: 0,
          total: results.length,
        },
        results,
      }),
    );
  }),

  // Cost centers for company (used by BookingForm)
  rest.get("/api/v1/corporate/cost-centers", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "1",
          name: "Diretoria",
          code: "CC-DIR",
          budget_limit: 50000.0,
          current_spent: 0,
          active: true,
          allowed_categories: [],
          spending_limit_per_ride: 1000,
        },
        {
          id: "2",
          name: "Financeiro",
          code: "CC-FIN",
          budget_limit: 30000.0,
          current_spent: 0,
          active: true,
          allowed_categories: [],
          spending_limit_per_ride: 1000,
        },
      ]),
    );
  }),
  rest.get("/corporate/cost-centers", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "1",
          name: "Diretoria",
          code: "CC-DIR",
          budget_limit: 50000.0,
          current_spent: 0,
          active: true,
          allowed_categories: [],
          spending_limit_per_ride: 1000,
        },
        {
          id: "2",
          name: "Financeiro",
          code: "CC-FIN",
          budget_limit: 30000.0,
          current_spent: 0,
          active: true,
          allowed_categories: [],
          spending_limit_per_ride: 1000,
        },
      ]),
    );
  }),

  // Absolute cost center variants
  rest.get(`${API_BASE}/api/v1/corporate/cost-centers`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "1",
          name: "Diretoria",
          code: "CC-DIR",
          budget_limit: 50000.0,
          current_spent: 0,
          active: true,
          allowed_categories: [],
          spending_limit_per_ride: 1000,
        },
        {
          id: "2",
          name: "Financeiro",
          code: "CC-FIN",
          budget_limit: 30000.0,
          current_spent: 0,
          active: true,
          allowed_categories: [],
          spending_limit_per_ride: 1000,
        },
      ]),
    );
  }),

  // Production API cost center variants
  rest.get(
    `${PROD_API_BASE}/api/v1/corporate/cost-centers`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: "1",
            name: "Diretoria",
            code: "CC-DIR",
            budget_limit: 50000.0,
            current_spent: 0,
            active: true,
            allowed_categories: [],
            spending_limit_per_ride: 1000,
          },
          {
            id: "2",
            name: "Financeiro",
            code: "CC-FIN",
            budget_limit: 30000.0,
            current_spent: 0,
            active: true,
            allowed_categories: [],
            spending_limit_per_ride: 1000,
          },
        ]),
      );
    },
  ),
  rest.get(`${PROD_API_BASE}/corporate/cost-centers`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "1",
          name: "Diretoria",
          code: "CC-DIR",
          budget_limit: 50000.0,
          current_spent: 0,
          active: true,
          allowed_categories: [],
          spending_limit_per_ride: 1000,
        },
        {
          id: "2",
          name: "Financeiro",
          code: "CC-FIN",
          budget_limit: 30000.0,
          current_spent: 0,
          active: true,
          allowed_categories: [],
          spending_limit_per_ride: 1000,
        },
      ]),
    );
  }),

  // Photon geocoding (used by AddressAutocomplete) - mock to keep tests deterministic
  rest.get("https://photon.komoot.io/api", (req, res, ctx) => {
    const q = req.url.searchParams.get("q") || "";
    // Return a predictable single feature that AddressAutocomplete can parse
    return res(
      ctx.status(200),
      ctx.json({
        features: [
          {
            properties: {
              osm_id: 999999,
              name: q || "Av Teste 1",
              osm_type: "way",
              housenumber: "1000",
              street: q || "Av Teste",
              district: "Centro",
              city: "Cidade",
              postcode: "00000",
            },
            geometry: { coordinates: [-46.6333, -23.5505] },
          },
        ],
      }),
    );
  }),
];
