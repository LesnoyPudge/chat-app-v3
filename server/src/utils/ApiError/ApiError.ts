


export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }

    static badRequest(message?: string) {
        return new ApiError(400, message ? message : 'Неверный запрос');
    }

    static unauthorized(message?: string) {
        return new ApiError(401, message ? message : 'Не авторизован');
    }
    
    static forbidden(message?: string) {
        return new ApiError(403, message ? message : 'Доступ запрещён');
    }

    static notFound(message?: string) {
        return new ApiError(404, message ? message : 'Не найдено');
    }
}