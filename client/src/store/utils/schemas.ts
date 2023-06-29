import z from "zod";

const SuggestionSchema = z.object({
  text: z.string(),
  magicKey: z.string()
});

export const SuggestionArraySchema = z.array(SuggestionSchema).default([]);

export type Suggestion = z.infer<typeof SuggestionSchema>;

const CandidateSchema = z
  .object({
    address: z.string(),
    location: z.object({
      x: z.number(),
      y: z.number()
    })
  })
  .nonstrict();

export const CandidatesArraySchema = z.array(CandidateSchema).min(1);

export type CandidateArray = z.infer<typeof CandidatesArraySchema>;

export const RouteShareSchema = z.object({
  distance: z.number(),
  latlngs: z.array(z.array(z.number()).length(2)),
  markers: z.array(z.array(z.number()).length(2)),
  route_type: z.enum(["foot", "bicycle", "mixed"])
});

export type RouteShare = z.infer<typeof RouteShareSchema>;

const LatLngZod = z
  .object({
    lat: z.number(),
    lng: z.number()
  })
  .nonstrict();

export const RoutePrimitiveSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    latlngs: z.array(LatLngZod),
    markerPos: z.array(LatLngZod),
    distance: z.number(),
    type: z.enum(["foot", "bicycle", "mixed"]),
    short: z.string()
  })
);
