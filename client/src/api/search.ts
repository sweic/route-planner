import axios from "axios";
import {
  CandidateArray,
  CandidatesArraySchema,
  Suggestion,
  SuggestionArraySchema
} from "../store/utils/schemas";

export const getLocations = async (loc: string) => {
  const endpoint = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?maxSuggestions=15&f=json&text=${encodeURIComponent(
    loc
  )}`;
  const resp = await axios.get(endpoint);
  if (
    resp.status != 200 ||
    !SuggestionArraySchema.safeParse(resp.data.suggestions).success
  )
    return [];
  return resp.data.suggestions.slice(0, 10) as Suggestion[];
};

export const goToLocation = async (s: Suggestion) => {
  const endpoint = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&magicKey=${s.magicKey}`;
  const resp = await axios.get(endpoint);
  if (
    resp.status != 200 ||
    !CandidatesArraySchema.safeParse(resp.data.candidates).success
  )
    return null;
  return resp.data.candidates[0] as CandidateArray[0];
};
