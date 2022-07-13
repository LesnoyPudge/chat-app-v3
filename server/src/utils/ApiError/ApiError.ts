


export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }

    static badRequest(message?: string) {
        throw new ApiError(400, message ? message : 'Неверный запрос');
    }

    static unauthorizedError(message?: string) {
        throw new ApiError(401, message ? message : 'Пользователь не авторизован');
    }

    static forbidden(message?: string) {
        throw new ApiError(403, message ? message : 'Доступ запрещён');
    }

    static notFound(message?: string) {
        throw new ApiError(404, message ? message : 'Не найдено');
    }
}