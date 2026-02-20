import { ComboItem } from "@/components/reuseables/location-combobox";
import { useQuery } from "@tanstack/react-query";

export const fetchCountries = async (): Promise<ComboItem[]> => {
  const response = await fetch(`https://countriesnow.space/api/v0.1/countries`);
  if (!response.ok) throw new Error("Error fetching countries");
  const data = await response.json();
  // Map each country country into an object with a `value` property
  return data.data.map((country: { country: string }) => ({
    value: country.country,
  }));
};

export const useCountries = () => {
  return useQuery<ComboItem[], Error>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    select: (data) => data.sort((a, b) => a.value.localeCompare(b.value)), // Sort countries alphabetically by `value`
    staleTime: Infinity,
  });
};
