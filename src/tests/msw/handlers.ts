import { rest } from "msw";
import { Booking } from "../../services/api";

// Mirror the default API base used in tests
const API_BASE = "http://localhost:8000";

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
      })
    );
  }),
];
