import { ActivityService } from './activity.service';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    getAll(req: any): Promise<({
        timestamp: Date | null;
        id: string;
        userId: string;
        type: "expense_added";
        description: string;
        relatedId: string;
    } | {
        timestamp: Date | null;
        id: string;
        userId: string;
        type: "settlement";
        description: string;
        relatedId: string;
    })[]>;
}
