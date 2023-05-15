


export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }

    static badRequest(message = 'Неверный запрос') {
        return new ApiError(400, message);
    }

    static unauthorized(message = 'Не авторизован') {
        return new ApiError(401, message);
    }
    
    static forbidden(message = 'Доступ запрещён') {
        return new ApiError(403, message);
    }

    static notFound(message = 'Не найдено') {
        return new ApiError(404, message);
    }
}