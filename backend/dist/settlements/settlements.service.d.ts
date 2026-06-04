import { PrismaService } from '../prisma/prisma.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
export declare class SettlementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(userId: string): Promise<{
        id: string;
        created_at: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        group_id: string | null;
        receiver_id: string;
        status: string;
        payer_id: string;
        note: string | null;
    }[]>;
    create(userId: string, dto: CreateSettlementDto): Promise<{
        id: string;
        created_at: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        group_id: string | null;
        receiver_id: string;
        status: string;
        payer_id: string;
        note: string | null;
    }>;
    updateStatus(id: string, userId: string, dto: UpdateSettlementDto): Promise<{
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
