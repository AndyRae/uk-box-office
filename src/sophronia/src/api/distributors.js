import { useBackendApi } from "./ApiFetcher";
import useSWR from "swr";

export const fetchKeys = {
  distributorList: (pageIndex, limit) => `distributor/?start=${pageIndex}&limit=${limit}`,
  distributor: (slug) => `distributor/${slug}`,
};

/**
 * Get paginated list of distributors.
 */
export const useDistributorList = (pageIndex=1, limit=10) => {
  const apiFetcher = useBackendApi();
  return useSWR(
    fetchKeys.distributorList(pageIndex, limit),
    async (url) => {
      const data = await apiFetcher(url);
      return data;
    },
    { suspense: true }
  );
};

/**
 * Get a single distributor.
 */
export const useDistributor = (id) => {
  const apiFetcher = useBackendApi();
  return useSWR(fetchKeys.distributor(id), apiFetcher, {
    suspense: true,
  });
};
