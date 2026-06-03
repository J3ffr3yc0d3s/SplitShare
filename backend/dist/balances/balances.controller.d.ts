import { BalancesService } from './balances.service';
export declare class BalancesController {
    private readonly balancesService;
    constructor(balancesService: BalancesService);
    getBalances(req: any, userId?: string, friendId?: string): Promise<{
        id: string;
        userId: string;
        friendId: string;
        amount: number;
        lastUpdated: Date;
    } | {
        id: string;
        userId: string;
        friendId: string;
        amount: number;
        lastUpdated: Date;
    }[] | null>;
    getTotal(req: any): Promise<{
        owedToYou: number;
        youOwe: number;
    }>;
}
