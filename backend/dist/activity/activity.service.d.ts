import { PrismaService } from '../prisma/prisma.service';
export declare class ActivityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(userId: string): Promise<({
        id: string;
        userId: string;
        type: "expense_added";
        description: string;
        relatedId: string;
        timestamp: Date;
    } | {
        id: string;
        userId: string;
        type: "settlement";
        description: string;
        relatedId: string;
        timestamp: Date | null;
    })[]>;
}
