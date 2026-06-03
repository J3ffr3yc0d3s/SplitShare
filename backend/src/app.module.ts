import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExpensesModule } from './expenses/expenses.module';
import { FriendsModule } from './friends/friends.module';
import { BalancesModule } from './balances/balances.module';
import { SettlementsModule } from './settlements/settlements.module';
import { ActivityModule } from './activity/activity.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ExpensesModule,
    FriendsModule,
    BalancesModule,
    SettlementsModule,
    ActivityModule,
    DashboardModule,
  ],
})
export class AppModule {}
