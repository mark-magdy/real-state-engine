import { NextResponse } from 'next/server';
import { ENDPOINT_REGISTRY } from '@/shared/lib/constants';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Received AI search query:', query);
    console.log('Using API key:', !!apiKey);
    if (!apiKey) {
      // Fallback: simple keyword matching when no API key
      return NextResponse.json(fallbackRoute(query));
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const endpointsDescription = ENDPOINT_REGISTRY.map(
      (ep) =>
        `- id: "${ep.id}", route: "${ep.route}", description: "${ep.description}", params: ${JSON.stringify(ep.params)}`
    ).join('\n');

    const prompt = `You are a routing assistant for a real estate analytics platform.
Given the user's query and the available endpoints below, determine which endpoint best answers their question.
Return ONLY valid JSON with no markdown formatting.

Available endpoints:
${endpointsDescription}

User query: "${query}"

Respond with JSON: { "endpointId": "...", "params": {}, "confidence": 0.0-1.0 }
If no endpoint matches well, return: { "endpointId": null, "confidence": 0 }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    if (!text) {
      return NextResponse.json(fallbackRoute(query));
    }

    const parsed = JSON.parse(text);

    if (!parsed.endpointId || parsed.confidence < 0.3) {
      return NextResponse.json(fallbackRoute(query));
    }

    const endpoint = ENDPOINT_REGISTRY.find((ep) => ep.id === parsed.endpointId);

    if (!endpoint) {
      return NextResponse.json(fallbackRoute(query));
    }

    return NextResponse.json({
      route: endpoint.route,
      params: parsed.params || {},
      confidence: parsed.confidence,
    });
  } catch (error) {
    console.error('AI Search error:', error);
    return NextResponse.json(
      { error: 'AI search failed', route: '/analysis' },
      { status: 500 }
    );
  }
}

function fallbackRoute(query: string): { route: string; params: Record<string, string> } {
  const q = query.toLowerCase();

  if (q.includes('roi') || q.includes('return') || q.includes('investment')) {
    return { route: '/analysis/roi', params: {} };
  }
  if (q.includes('price') && q.includes('type')) {
    return { route: '/analysis/price-by-type', params: {} };
  }
  if (q.includes('price') || q.includes('average') || q.includes('cost')) {
    return { route: '/analysis/average-price', params: {} };
  }
  if (q.includes('count') || q.includes('distribution') || q.includes('inventory')) {
    return { route: '/analysis/property-counts', params: {} };
  }
  if (q.includes('installment') || q.includes('payment plan') || q.includes('monthly')) {
    return { route: '/analysis/installments', params: {} };
  }
  if (q.includes('down') || q.includes('downpayment') || q.includes('deposit')) {
    return { route: '/analysis/downpayment', params: {} };
  }
  if (q.includes('find') || q.includes('property') || q.includes('browse') || q.includes('search')) {
    return { route: '/properties', params: {} };
  }

  return { route: '/analysis', params: {} };
}
