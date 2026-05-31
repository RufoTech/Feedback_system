import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface RequestSubmission {
  _id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: string;
  type: 'review' | 'suggestion' | 'complaint';
  text: string;
  rating: number;
  isAnonymous: boolean;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface TypeDistribution {
  service: number;
  suggestions: number;
  complaints: number;
}

export interface PeakPeriodStats {
  morning: number;
  lunch: number;
  dinner: number;
}

export interface PeakActivity {
  service: PeakPeriodStats;
  feedback: PeakPeriodStats;
  payment: PeakPeriodStats;
}

export interface TopZone {
  zoneName: string;
  description: string;
  csat: number;
}

export interface StatsResponse {
  totalRequests: number;
  avgCsat: number;
  typeDistribution: TypeDistribution;
  chartLabels: string[];
  chartData: number[];
  peakActivity: PeakActivity;
  topZones: TopZone[];
}

export interface TableItem {
  _id: string;
  restaurantId: string;
  tableNumber: string;
  qrCodeUrl: string;
  createdAt: string;
}

export interface BranchInfo {
  _id: string;
  name: string;
  address?: string;
  description?: string;
}

export interface RestaurantInfo {
  _id: string;
  name: string;
  logo: string;
  address: string;
  description: string;
  branches?: BranchInfo[];
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Request', 'Table', 'Stats', 'Restaurant'],
  endpoints: (builder) => ({
    getRequests: builder.query<RequestSubmission[], { type?: string; startDate?: string; branchId?: string }>({
      query: (filters) => {
        const params: any = {};
        if (filters.type && filters.type !== 'all') params.type = filters.type;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.branchId) params.branchId = filters.branchId;
        return { url: 'requests', params };
      },
      providesTags: ['Request'],
    }),
    getStats: builder.query<StatsResponse, string | undefined>({
      query: (branchId) => {
        const params: any = {};
        if (branchId) params.branchId = branchId;
        return { url: 'requests/stats', params };
      },
      providesTags: ['Stats'],
    }),
    getTables: builder.query<TableItem[], { restaurantId: string; branchId?: string }>({
      query: ({ restaurantId, branchId }) => {
        const params: any = {};
        if (branchId) params.branchId = branchId;
        return { url: `restaurants/${restaurantId}/tables`, params };
      },
      providesTags: ['Table'],
    }),
    createTable: builder.mutation<TableItem, { restaurantId: string; tableNumber: string; branchId?: string }>({
      query: ({ restaurantId, tableNumber, branchId }) => ({
        url: `restaurants/${restaurantId}/tables`,
        method: 'POST',
        body: { tableNumber, branchId },
      }),
      invalidatesTags: ['Table', 'Stats'],
    }),
    deleteTable: builder.mutation<{ deleted: boolean }, string>({
      query: (tableId) => ({
        url: `tables/${tableId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Table', 'Stats'],
    }),
    getRestaurant: builder.query<RestaurantInfo, string>({
      query: (restaurantId) => `restaurants/${restaurantId}`,
      providesTags: ['Restaurant'],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useGetStatsQuery,
  useGetTablesQuery,
  useCreateTableMutation,
  useDeleteTableMutation,
  useGetRestaurantQuery,
} = adminApi;
