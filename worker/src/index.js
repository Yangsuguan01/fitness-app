export default {
  async fetch(request, env) {
    const CORS_HEADERS = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === "/health") {
      // Actually test Baidu connectivity
      try {
        const tokenResp = await fetch(
          `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${env.BAIDU_API_KEY}&client_secret=${env.BAIDU_SECRET_KEY}`,
          { method: "POST", signal: AbortSignal.timeout(8000) }
        );
        if (!tokenResp.ok) throw new Error("Token fetch failed");
        const tokenData = await tokenResp.json();
        if (!tokenData.access_token) throw new Error("No token");
        return new Response(JSON.stringify({ status: "ok", baidu: true, service: "fitness-ai" }), {
          status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      } catch (e) {
        return new Response(JSON.stringify({ status: "error", baidu: false, message: e.message }), {
          status: 503, headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      }
    }

    if (url.pathname === "/recognize" && request.method === "POST") {
      try {
        const { image } = await request.json();
        if (!image) {
          return new Response(JSON.stringify({ error: "No image data" }), {
            status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS }
          });
        }

        const tokenResp = await fetch(
          `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${env.BAIDU_API_KEY}&client_secret=${env.BAIDU_SECRET_KEY}`,
          { method: "POST", signal: AbortSignal.timeout(8000) }
        );
        const tokenData = await tokenResp.json().catch(() => ({}));
        const token = tokenData.access_token;
        if (!token) throw new Error("Baidu token unavailable");

        const form = new URLSearchParams();
        form.append("image", image);
        form.append("top_num", "3");
        const dishResp = await fetch(
          `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${token}`,
          { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: form.toString(), signal: AbortSignal.timeout(15000) }
        );
        const result = await dishResp.json();
        const dishes = (result.result || []).slice(0, 3).map(item => {
          let cal = item.calorie;
          if (!cal) {
            for (const [name, kcal] of Object.entries(CAL_DB || {})) {
              if ((item.name || "").includes(name) || name.includes(item.name || "")) {
                cal = kcal; break;
              }
            }
          }
          return {
            name: item.name,
            calorie: cal ? parseFloat(cal) : null,
            probability: Math.round((item.probability || 0) * 1000) / 10,
          };
        });

        return new Response(JSON.stringify({ success: true, dishes }), {
          status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: `AI识别失败: ${err.message}` }), {
          status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      }
    }

    return new Response(JSON.stringify({ error: "not found", endpoints: ["/health", "/recognize"] }), {
      status: 404, headers: { "Content-Type": "application/json", ...CORS_HEADERS }
    });
  }
};