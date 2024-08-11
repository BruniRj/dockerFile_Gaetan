export function createApiResponses<T = any>(options: {
    statusCode: number;
    message?: string;
    data?: T;
}): ApiResponses<T> {
    const { statusCode, message, data } = options;
    const response: ApiResponses<T> = {
        statusCode,
        message: message || '',
        data: data || null,
    };
    return response;
}

export type ApiResponses<T = any> = {
    statusCode: number;
    message: string;
    data: T;
}