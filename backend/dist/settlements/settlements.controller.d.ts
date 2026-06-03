import { SettlementsService } from './settlements.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
export declare class SettlementsController {
    private readonly settlementsService;
    constructor(settlementsService: SettlementsService);
    getAll(req: any): Promise<{
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        group_id: string | null;
        created_at: Date | null;
        receiver_id: string;
        payer_id: string;
        note: string | null;
        status: string;
    }[]>;
    create(req: any, dto: CreateSettlementDto): Promise<{
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        group_id: string | null;
        created_at: Date | null;
        receiver_id: string;
        payer_id: string;
        note: string | null;
        status: string;
    }>;
    updateStatus(id: string, req: any, dto: UpdateSettlementDto): Promise<{
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        group_id: string | null;
        created_at: Date | null;
        receiver_id: string;
        payer_id: string;
        note: string | null;
        status: string;
    }>;
}
