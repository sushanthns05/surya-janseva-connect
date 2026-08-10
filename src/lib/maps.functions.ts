import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

type GeoResult = {
  state: string;
  district: string;
  city: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
};

function pick(components: Array<{ long_name: string; types: string[] }>, type: string) {
  return components.find((c) => c.types.includes(type))?.long_name ?? "";
}

async function gatewayFetch(path: string, init?: RequestInit) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !mapsKey) {
    throw new Error(
      "Map services are not configured. Missing GOOGLE_MAPS_API_KEY / LOVABLE_API_KEY.",
    );
  }
  const response = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": mapsKey,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Google Maps gateway failed [${response.status}]: ${body}`);
    throw new Error("Map lookup failed. Please enter the address manually.");
  }
  return response;
}

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((input: { latitude: number; longitude: number }) =>
    z
      .object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) })
      .parse(input),
  )
  .handler(async ({ data }): Promise<GeoResult> => {
    const response = await gatewayFetch(
      `/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}&region=in`,
    );
    const json = (await response.json()) as {
      results?: Array<{
        formatted_address: string;
        address_components: Array<{ long_name: string; types: string[] }>;
      }>;
    };
    const first = json.results?.[0];
    if (!first) throw new Error("No address found for that location.");
    const c = first.address_components;
    return {
      state: pick(c, "administrative_area_level_1"),
      district: pick(c, "administrative_area_level_3") || pick(c, "administrative_area_level_2"),
      city: pick(c, "locality") || pick(c, "postal_town"),
      locality: pick(c, "sublocality_level_1") || pick(c, "neighborhood") || pick(c, "route"),
      address: first.formatted_address,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  });

export const searchPlaces = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string }) =>
    z.object({ query: z.string().trim().min(3).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const response = await gatewayFetch("/places/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery: data.query,
        regionCode: "IN",
        maxResultCount: 6,
      }),
    });
    const json = (await response.json()) as {
      places?: Array<{
        id: string;
        displayName?: { text: string };
        formattedAddress?: string;
        location?: { latitude: number; longitude: number };
      }>;
    };
    return (json.places ?? []).map((p) => ({
      id: p.id,
      name: p.displayName?.text ?? p.formattedAddress ?? "Unknown place",
      address: p.formattedAddress ?? "",
      latitude: p.location?.latitude ?? 0,
      longitude: p.location?.longitude ?? 0,
    }));
  });
