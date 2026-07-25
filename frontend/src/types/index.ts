export type UrlRequest = {
    originalUrl: string,
    customAlias?: string,
}

export type UrlResponse = {
    shortCode: string,
    shortUrl: string,
    expiresAt: string,
}

export type UrlStatsResponse = {
    shortCode: string,
    originalUrl: string,
    clickCount: number,
    createdAt: string,
    expiresAt: string,
    isExpired: boolean,
    customAlias: string | null,
}

export type ErrorResponse = {
    timestamp: string,
    status: number,
    error: string,
    message: string,
}