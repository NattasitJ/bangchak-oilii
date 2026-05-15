/**
 * Cloudflare Worker - Oil Price API Proxy + Static Site
 *
 * Handles:
 *   /api      → Proxy to Bangchak Oil Price API
 *   /*        → Serve static files (index.html, index.css)
 */

const BANGCHAK_API_URL = 'https://oil-price.bangchak.co.th/ApiOilPrice2/th';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // API proxy route
        if (url.pathname === '/api' || url.pathname === '/api.php') {
            return handleApiRequest();
        }

        // Serve static assets (index.html, index.css, etc.)
        return env.ASSETS.fetch(request);
    },
};

async function handleApiRequest() {
    try {
        const response = await fetch(BANGCHAK_API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0',
            },
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: 'Failed to fetch oil prices', httpCode: response.status }),
                {
                    status: 502,
                    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders },
                }
            );
        }

        const data = await response.text();

        return new Response(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'public, max-age=300',
                ...corsHeaders,
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: 'Internal error', message: err.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders },
            }
        );
    }
}
