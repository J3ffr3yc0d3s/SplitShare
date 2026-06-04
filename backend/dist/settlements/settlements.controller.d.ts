import { SettlementsService } from './settlements.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
export declare class SettlementsController {
    private readonly settlementsService;
    constructor(settlementsService: SettlementsService);
    getAll(req: any): Promise<{
        id: string;
        created_at: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        group_id: string | null;
        receiver_id: string;
        status: string;
        payer_id: string;
        note: string | null;
    }[]>;
    create(req: any, dto: CreateSettlementDto): Promise<{
        id: string;
        created_at: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        group_id: string | null;
        receiver_id: string;
        status: string;
        payer_id: string;
        note: string | null;
    }>;
    updateStatus(id: string, req: any, dto: UpdateSettlementDto): Promise<{
        id: string;
        created_at: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        group_id: string | null;
        receiver_id: string;
        status: string;
        payer_id: string;
        note: string | null;
    }>;
}
