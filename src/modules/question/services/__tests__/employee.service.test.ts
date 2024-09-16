import prisma from '../../../prisma/prisma';
import * as employeeService from '../../services/employee.service';
import { Employee, Seniority } from '@prisma/client';
import { EmployeeData } from '../../types/employee.types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { encryptText, decryptText } from '../../utils/crypto.helper';

jest.mock('../../../prisma/prisma', () => ({
  employee: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
}));

jest.mock('../../utils/crypto.helper', () => ({
  encryptText: jest.fn(),
  decryptText: jest.fn(),
}));

describe('Employee Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an employee', async () => {
    const employeeData: EmployeeData = {
      name: 'John',
      surname: 'Doe',
      image: 'https://example.com/employee-image.jpg',
      position: 'Developer',
      expertise: 'Full Stack',
      seniority: 'SENIOR',
      email: 'john.doe@example.com',
      phone: '123456789',
      netSalary: '5000',
      grossSalary: '6000',
      skills: ['JavaScript', 'React'],
    };
  
    const encryptedNetSalary = 'encryptedNetSalary';
    const encryptedGrossSalary = 'encryptedGrossSalary';
    const decryptedNetSalary = '5000';
    const decryptedGrossSalary = '6000';
    const createdEmployee = {
      id: '1',
      ...employeeData,
      netSalary: decryptedNetSalary,
      grossSalary: decryptedGrossSalary,
      createdAt: '2024-07-26T11:22:45.400Z',
      updatedAt: '2024-07-26T11:22:45.400Z',
    };
  
    (prisma.employee.create as jest.Mock).mockResolvedValueOnce({
      id: '1',
      ...employeeData,
      netSalary: encryptedNetSalary,
      grossSalary: encryptedGrossSalary,
      createdAt: '2024-07-26T11:22:45.400Z',
      updatedAt: '2024-07-26T11:22:45.400Z',
    });
  
    (decryptText as jest.Mock).mockImplementation((text) => {
      if (text === encryptedNetSalary) return decryptedNetSalary;
      if (text === encryptedGrossSalary) return decryptedGrossSalary;
      return '';
    });
  
    (encryptText as jest.Mock).mockImplementation((text) => {
      if (text === '5000') return encryptedNetSalary;
      if (text === '6000') return encryptedGrossSalary;
      return '';
    });
  
    const result = await employeeService.createEmployee(employeeData);
  
    expect(result).toEqual(createdEmployee);
    expect(prisma.employee.create).toHaveBeenCalledWith({
      data: {
        ...employeeData,
        netSalary: encryptedNetSalary,
        grossSalary: encryptedGrossSalary,
        skills: {
          connectOrCreate: [
            { where: { name: 'JavaScript' }, create: { name: 'JavaScript' } },
            { where: { name: 'React' }, create: { name: 'React' } },
          ],
        },
      },
    });
  });
  

  // Add more test cases for different scenarios (e.g., existing email, error handling)

  it('should get an employee by ID', async () => {
    const employeeId = '1';
    const employee: Employee = {
      id: employeeId,
      name: 'John',
      surname: 'Doe',
      image: 'https://example.com/employee-image.jpg',
      position: 'Developer',
      expertise: 'Full Stack',
      seniority: 'SENIOR',
      email: 'john.doe@example.com',
      phone: '123456789',
      netSalary: '5000',
      grossSalary: '6000',
      active: true,
    };

    (prisma.employee.findUnique as jest.Mock).mockResolvedValueOnce(employee);

    const result = await employeeService.getEmployeeById(employeeId);

    expect(result).toEqual(employee);
    expect(prisma.employee.findUnique).toHaveBeenCalledWith({
      where: { id: employeeId },
      include: {
        skills: true,
        allocations: {
          include: {
            project: true,
          },
        },
      },
    });
  });

  it('should update an employee', async () => {
    const employeeId = '1';
    const updatedEmployeeData: EmployeeData = {
      name: 'John',
      surname: 'Doe',
      image: 'https://example.com/employee-image.jpg',
      position: 'Developer',
      expertise: 'Full Stack',
      seniority: 'SENIOR' as Seniority,
      email: 'john.doe@example.com',
      phone: '123456789',
      netSalary: '5000',
      grossSalary: '6000',
      skills: ['React'],
    };

    const updatedEmployee = {
      id: employeeId,
      ...updatedEmployeeData,
    };

    const skillConnections = [
      {
        where: { name: 'React' },
        create: { name: 'React' },
      },
    ];

    (prisma.employee.update as jest.Mock).mockResolvedValueOnce(updatedEmployee);

    (encryptText as jest.Mock).mockReturnValue('encrypted');

    const result = await employeeService.updateEmployee(employeeId, updatedEmployeeData);

    expect(result).toEqual(updatedEmployee);
    expect(prisma.employee.update).toHaveBeenCalledWith({
      where: { id: employeeId },
      data: {
        ...updatedEmployeeData,
        netSalary: 'encrypted',
        grossSalary: 'encrypted',
        skills: {
          connectOrCreate: skillConnections,
        },
      },
    });
  });

  it('should delete an employee', async () => {
    const employeeId = '1';
    const deletedEmployee: Employee = {
      id: employeeId,
      name: 'John',
      surname: 'Doe',
      image: 'https://example.com/employee-image.jpg',
      position: 'Developer',
      expertise: 'Full Stack',
      seniority: 'SENIOR',
      email: 'john.doe@example.com',
      phone: '123456789',
      netSalary: '5000',
      grossSalary: '6000',
      active: false,
    };

    (prisma.employee.update as jest.Mock).mockResolvedValueOnce(deletedEmployee);

    const result = await employeeService.deleteEmployee(employeeId);

    expect(result).toEqual(deletedEmployee);
    expect(prisma.employee.update).toHaveBeenCalledWith({
      where: { id: employeeId },
      data: {
        active: false,
      },
    });
  });

  // Add more test cases for different scenarios

  it('should get all employees', async () => {
    const employees = [
      {
        id: '1',
        name: 'John',
        surname: 'Doe',
        image: 'https://example.com/employee-image.jpg',
        position: 'Developer',
        expertise: 'Full Stack',
        seniority: 'SENIOR',
        email: 'john.doe@example.com',
        phone: '123456789',
        netSalary: '5000',
        grossSalary: '6000',
        active: true,
        allocations: [],
        totalUtilisation: 0,
      },
      {
        id: '2',
        name: 'John',
        surname: 'Doe',
        image: 'https://example.com/employee-image.jpg',
        position: 'Developer',
        expertise: 'Full Stack',
        seniority: 'SENIOR',
        email: 'john.doe@example.com',
        phone: '123456789',
        netSalary: '5000',
        grossSalary: '6000',
        active: true,
        allocations: [],
        totalUtilisation: 0,
      },
    ];

    (prisma.employee.findMany as jest.Mock).mockResolvedValueOnce(employees);

    const request = {} as FastifyRequest;

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;

    const result = await employeeService.getAllEmployees({});

    expect(result).toEqual(employees);
    expect(prisma.employee.findMany).toHaveBeenCalled();
  });
});
