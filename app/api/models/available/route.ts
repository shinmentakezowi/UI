import { NextResponse } from "next/server";
import { MOCK_MODELS, MOCK_PLAN_KEY } from "@/lib/mock-data";
import { detectProvider, detectModelType, PROVIDER_DISPLAY } from "@/lib/models";

export async function GET() {
  const models = MOCK_MODELS.map((id) => ({
    id,
    provider: detectProvider(id),
    type: detectModelType(id),
  }));

  const providerSet = new Set(models.map((m) => m.provider));
  const providers = Array.from(providerSet).map((key) => ({
    key,
    name: PROVIDER_DISPLAY[key] ?? key,
    count: models.filter((m) => m.provider === key).length,
  }));

  const typeSet = new Set(models.map((m) => m.type));
  const types = Array.from(typeSet);

  return NextResponse.json({
    models,
    providers,
    types,
    count: models.length,
    providerCount: providers.length,
    provisioned: true,
    plan: MOCK_PLAN_KEY,
  });
}
