// Normalizes country names between Nominatim and the Natural Earth TopoJSON
// used by react-simple-maps. Keys are lowercased aliases; values are the
// canonical form found in the TopoJSON's geography `properties.name`.
const ALIASES: Record<string, string> = {
  "united states": "United States of America",
  "usa": "United States of America",
  "us": "United States of America",
  "u.s.a.": "United States of America",
  "u.s.": "United States of America",
  "czechia": "Czech Republic",
  "russian federation": "Russia",
  "republic of korea": "South Korea",
  "korea, republic of": "South Korea",
  "korea (south)": "South Korea",
  "democratic people's republic of korea": "North Korea",
  "korea, democratic people's republic of": "North Korea",
  "ivory coast": "Côte d'Ivoire",
  "cote d'ivoire": "Côte d'Ivoire",
  "burma": "Myanmar",
  "syrian arab republic": "Syria",
  "laos": "Lao PDR",
  "lao people's democratic republic": "Lao PDR",
  "vietnam": "Vietnam",
  "viet nam": "Vietnam",
  "tanzania, united republic of": "Tanzania",
  "macedonia": "North Macedonia",
  "the former yugoslav republic of macedonia": "North Macedonia",
  "eswatini": "Swaziland",
  "swaziland": "Swaziland",
  "congo": "Republic of the Congo",
  "republic of the congo": "Republic of the Congo",
  "democratic republic of the congo": "Dem. Rep. Congo",
  "congo, the democratic republic of the": "Dem. Rep. Congo",
  "brunei darussalam": "Brunei",
  "bolivia, plurinational state of": "Bolivia",
  "venezuela, bolivarian republic of": "Venezuela",
  "iran, islamic republic of": "Iran",
  "palestine, state of": "Palestine",
  "taiwan, province of china": "Taiwan",
  "bahamas": "The Bahamas",
  "gambia": "The Gambia",
  "timor-leste": "East Timor",
  "dominican rep.": "Dominican Republic",
  "central african republic": "Central African Rep.",
  "south sudan": "S. Sudan",
  "solomon islands": "Solomon Is.",
  "bosnia and herzegovina": "Bosnia and Herz.",
};

export function canonicalCountry(input: string | undefined | null): string | null {
  if (!input) return null;
  const key = input.trim().toLowerCase();
  if (!key) return null;
  return ALIASES[key] ?? input.trim();
}
