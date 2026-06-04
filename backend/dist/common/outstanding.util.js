"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMoney = toMoney;
exports.getOutstandingAmount = getOutstandingAmount;
exports.isFullySettled = isFullySettled;
exports.getSignedOutstanding = getSignedOutstanding;
exports.sumOutstandingOwedByPayer = sumOutstandingOwedByPayer;
exports.allocateSettlementFifo = allocateSettlementFifo;
exports.sumAllocatedAmount = sumAllocatedAmount;
function toMoney(value) {
    return Number(value ?? 0);
}
function getOutstandingAmount(row) {
    const share = toMoney(row.share_amount);
    const settled = toMoney(row.settled_amount);
    return Math.max(0, Math.round((share - settled) * 100) / 100);
}
function isFullySettled(row) {
    return getOutstandingAmount(row) <= 0;
}
function getSignedOutstanding(split, userId) {
    const outstanding = getOutstandingAmount(split);
    if (outstanding <= 0) {
        return 0;
    }
    const isPayer = split.expenses.paid_by === userId;
    if (isPayer && split.user_id === userId) {
        return 0;
    }
    return isPayer ? outstanding : -outstanding;
}
function sumOutstandingOwedByPayer(splits, payerId, receiverId) {
    return splits
        .filter((row) => row.user_id === payerId && row.expenses.paid_by === receiverId)
        .reduce((sum, row) => sum + getOutstandingAmount(row), 0);
}
function allocateSettlementFifo(rows, payerId, receiverId, paymentAmount) {
    const ordered = rows
        .filter((row) => row.user_id === payerId && row.expenses.paid_by === receiverId)
        .filter((row) => getOutstandingAmount(row) > 0)
        .sort((a, b) => {
        const dateA = new Date(a.expenses.expense_date ?? 0).getTime();
        const dateB = new Date(b.expenses.expense_date ?? 0).getTime();
        return dateA - dateB;
    });
    let remaining = Math.round(paymentAmount * 100) / 100;
    const allocations = [];
    for (const row of ordered) {
        if (remaining <= 0) {
            break;
        }
        const outstanding = getOutstandingAmount(row);
        const apply = Math.min(remaining, outstanding);
        const newSettled = Math.round((toMoney(row.settled_amount) + apply) * 100) / 100;
        const share = toMoney(row.share_amount);
        allocations.push({
            participantId: row.id,
            amount: apply,
            newSettledAmount: newSettled,
            fullySettled: newSettled >= share,
        });
        remaining = Math.round((remaining - apply) * 100) / 100;
    }
    return allocations;
}
function sumAllocatedAmount(allocations) {
    return Math.round(allocations.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
}
//# sourceMappingURL=outstanding.util.js.map