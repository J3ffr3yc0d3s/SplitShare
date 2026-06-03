import { PrismaService } from '../prisma/prisma.service';
export declare class BalancesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private aggregateBalances;
    getBalances(userId: string): Promise<{
        id: string;
        userId: string;
        friendId: string;
        amount: number;
        lastUpdated: Date;
    }[]>;
    getBalanceBetweenUsers(userId: string, friendId: string): Promise<{
        id: string;
        userId: string;
        friendId: string;
        amount: number;
        lastUpdated: Date;
    } | null>;
    getTotal(userId: string): Promise<{
        owedToYou: number;
        youOwe: number;
    }>;
}
