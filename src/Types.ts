export interface ApiError {
    message: string;
    code: number;
}

export type Done = (err: any, user?: Express.User | false | null) => void;

declare global {
    namespace Express {
        export interface User {
            id: number;
            email: string;
        }
    }
}
