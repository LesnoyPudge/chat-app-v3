import HTTP_STATUS_CODES from 'http-status-enum';



export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }

    static badRequest(message = 'Неверный запрос') {
        return new ApiError(HTTP_STATUS_CODES.BAD_REQUEST, message);
    }

    static unauthorized(message = 'Не авторизован') {
        return new ApiError(HTTP_STATUS_CODES.UNAUTHORIZED, message);
    }
    
    static forbidden(message = 'Доступ запрещён') {
        return new ApiError(HTTP_STATUS_CODES.FORBIDDEN, message);
    }

    static notFound(message = 'Не найдено') {
        return new ApiError(HTTP_STATUS_CODES.NOT_FOUND, message);
    }

    static internal(message = 'Непредвиденная ошибка') {
        return new ApiError(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, message);
    }
}