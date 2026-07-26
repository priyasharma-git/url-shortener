import axios from 'axios';
import type { UrlRequest, UrlResponse, UrlStatsResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const urlService = {
    createShortUrl: async(data: UrlRequest): Promise<UrlResponse> => {
        const response = await api.post<UrlResponse>('/urls', data);
        return response.data;
    },
    getUrlStats: async(shortCode: string): Promise<UrlStatsResponse> => {
        const response = await api.get<UrlStatsResponse>(`/urls/${shortCode}/stats`);
        return response.data;
    },
};