import { PrismaService } from '../prisma/prisma.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
export declare class SettlementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(userId: string): Promise<{
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        group_id: string | null;
        created_at: Date | null;
        receiver_id: string;
        payer_id: string;
        note: string | null;
        status: string;
    }[]>;
    create(userId: string, dto: CreateSettlementDto): Promise<{
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        group_id: string | null;
        created_at: Date | null;
        receiver_id: string;
        payer_id: string;
        note: string | null;
        status: string;
    }>;
    updateStatus(id: string, userId: string, dto: UpdateSettlementDto): Promise<{
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
