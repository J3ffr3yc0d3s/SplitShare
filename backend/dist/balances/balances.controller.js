"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const balances_service_1 = require("./balances.service");
let BalancesController = class BalancesController {
    constructor(balancesService) {
        this.balancesService = balancesService;
    }
    async getBalances(req, userId, friendId) {
        const currentUserId = req.user.id;
        if (userId && friendId) {
            return this.balancesService.getBalanceBetweenUsers(currentUserId, friendId);
        }
        return this.balancesService.getBalances(currentUserId);
    }
    getTotal(req) {
        return this.balancesService.getTotal(req.user.id);
    }
};
exports.BalancesController = BalancesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BalancesController.prototype, "getBalances", null);
__decorate([
    (0, common_1.Get)('total'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BalancesController.prototype, "getTotal", null);
exports.BalancesController = BalancesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('balances'),
    __metadata("design:paramtypes", [balances_service_1.BalancesService])
], BalancesController);
//# sourceMappingURL=balances.controller.js.map