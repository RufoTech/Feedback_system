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
  photoUrl?: string;
  status: 'pending' | 'in_progress' | 'completed';
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
  tagTypes: ['Request', 'Table', 'Stats'],
  endpoints: (builder) => ({
    getRequests: builder.query<RequestSubmission[], { type?: string; status?: string }>({
      query: (filters) => {
        const params: any = {};
        if (filters.type && filters.type !== 'all') params.type = filters.type;
        if (filters.status) params.status = filters.status;
        return { url: 'requests', params };
      },
      providesTags: ['Request'],
    }),
    updateRequestStatus: builder.mutation<RequestSubmission, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `requests/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Request', 'Stats'],
    }),
    getStats: builder.query<StatsResponse, void>({
      query: () => 'requests/stats',
      providesTags: ['Stats'],
    }),
    getTables: builder.query<TableItem[], string>({
      query: (restaurantId) => `restaurants/${restaurantId}/tables`,
      providesTags: ['Table'],
    }),
    createTable: builder.mutation<TableItem, { restaurantId: string; tableNumber: string }>({
      query: ({ restaurantId, tableNumber }) => ({
        url: `restaurants/${restaurantId}/tables`,
        method: 'POST',
        body: { tableNumber },
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
  }),
});

export const {
  useGetRequestsQuery,
  useUpdateRequestStatusMutation,
  useGetStatsQuery,
  useGetTablesQuery,
  useCreateTableMutation,
  useDeleteTableMutation,
} = adminApi;
