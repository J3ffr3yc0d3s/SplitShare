import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { PrismaService } from '../prisma/prisma.service'

const mockPrisma = {
  users: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  expenses: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

describe('ExpensesService', () => {
  let service: ExpensesService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get<ExpensesService>(ExpensesService)
  })

  it('getAll() calls prisma.expenses.findMany with correct where clause', async () => {
    const userId = 'user-1'
    mockPrisma.expenses.findMany.mockResolvedValue([])

    await service.getAll(userId)

    expect(mockPrisma.expenses.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { paid_by: userId },
          { expense_participants: { some: { user_id: userId } } },
        ],
      },
      include: { expense_participants: true },
      orderBy: { created_at: 'desc' },
    })
  })

  it('getById() throws NotFoundException when expense not found', async () => {
    mockPrisma.expenses.findUnique.mockResolvedValue(null)

    await expect(service.getById('exp-1', 'user-1')).rejects.toThrow(NotFoundException)
  })

  it('create() calls prisma.expenses.create with correct data', async () => {
    const dto = {
      description: 'Test expense',
      amount: 100,
      category: 'food',
      expenseDate: '2026-01-01',
      groupId: 'some-group-id',
      splitType: 'equal',
      participants: [{ userId: 'user-1', amount: 50 }],
    }
    const userId = 'user-1'

    mockPrisma.expenses.create.mockResolvedValue({ id: 'exp-1' })

    await service.create(userId, dto)

    expect(mockPrisma.expenses.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: dto.description,
        description: dto.description,
        amount: dto.amount,
        category: dto.category,
        paid_by: userId,
        created_by: userId,
        expense_date: dto.expenseDate,
        group_id: dto.groupId,
        expense_participants: {
          create: [{ user_id: 'user-1', share_amount: 50 }],
        },
      }),
      include: { expense_participants: true },
    })
  })

  it('delete() throws NotFoundException when expense not found', async () => {
    mockPrisma.expenses.findUnique.mockResolvedValue(null)

    await expect(service.delete('exp-2', 'user-1')).rejects.toThrow(NotFoundException)
  })
})
