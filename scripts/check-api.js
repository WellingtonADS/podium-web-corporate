#!/usr/bin/env node
(async () => {
  // carregar dotenv
  try {
    require("dotenv").config();
  } catch {
    await import("dotenv").then((m) => m.config());
  }

  // garantir fetch (Node 18+ tem; tenta node-fetch se não)
  if (typeof globalThis.fetch === "undefined") {
    try {
      // dynamic import to avoid requiring node-fetch if not installed
      const mod = await import("node-fetch").catch(() => null);
      if (mod && mod.default) globalThis.fetch = mod.default;
    } catch {
      console.error(
        "Fetch não disponível. Use Node >=18 ou instale 'node-fetch'.",
      );
      process.exit(2);
    }
  }

  const VITE_API_URL = process.env.VITE_API_URL;
  if (!VITE_API_URL) {
    console.error("VITE_API_URL não definido. Adicione no .env e reinicie.");
    process.exit(2);
  }

  const base = `${VITE_API_URL.replace(/\/$/, "")}/api/v1`;
  const tests = [
    { name: "GET / (health)", method: "GET", path: "/" },
    {
      name: "GET /corporate/cost-centers",
      method: "GET",
      path: "/corporate/cost-centers",
    },
    {
      name: "GET /stats/corporate/billing",
      method: "GET",
      path: "/stats/corporate/billing?period=2025-12",
    },
    { name: "GET /bookings", method: "GET", path: "/bookings" },
  ];

  let token = process.env.PODIUM_TOKEN || null;

  // tenta login se credenciais estiverem no .env
  if (!token && process.env.PODIUM_TEST_USER && process.env.PODIUM_TEST_PASS) {
    try {
      const body = new URLSearchParams();
      body.append("username", process.env.PODIUM_TEST_USER);
      body.append("password", process.env.PODIUM_TEST_PASS);

      const res = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        token = data.access_token || data.token || data?.data?.token || null;
        console.log(
          "Login: OK",
          token ? "(token obtido)" : "(sem token no payload)",
        );
      } else {
        console.warn(`Login falhou: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.warn("Login erro:", err?.message || err);
    }
  }

  const results = [];
  for (const t of tests) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${base}${t.path}`, {
        method: t.method,
        headers,
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} - ${txt}`);
      }
      results.push({ name: t.name, ok: true });
      console.log(`${t.name}: OK`);
    } catch (err) {
      results.push({
        name: t.name,
        ok: false,
        error: err.message || String(err),
      });
      console.error(`${t.name}: FAIL ->`, err.message || err);
    }
  }

  const failed = results.filter((r) => !r.ok).length;
  const jsonMode = process.argv.includes("--json");

  if (jsonMode) {
    console.log(JSON.stringify({ ok: failed === 0, failed, results }, null, 2));
  }

  if (failed > 0) {
    console.error(
      `${failed} teste(s) falharam. Verifique VITE_API_URL, CORS e autenticação.`,
    );
    process.exit(1);
  } else {
    console.log("Todos os testes passaram.");
    process.exit(0);
  }
})();
