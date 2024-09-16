import { FastifyRequest, FastifyReply } from 'fastify';
import * as employeeService from '../../services/employee.service';
import { EmployeeData } from '../../types/employee.types';
import * as employeeController from '../../controllers/employee.controller';
import prisma from '../../../prisma/prisma';

jest.mock('../../services/employee.service', () => ({
  createEmployee: jest.fn(),
  getAllEmployees: jest.fn(),
  getEmployeeById: jest.fn(),
  deleteEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  getEmployeeByEmail: jest.fn(),
}));

jest.mock('../../../prisma/prisma', () => ({
  employee: {
    findUnique: jest.fn(),
  },
}));

describe('Employee Controller', () => {
  let request: Partial<FastifyRequest>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    // request = {};
    request = {
      body: {
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
      },
    };
    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an employee and return 201 status', async () => {
    const employeeData: EmployeeData = {
      name: 'John',
      surname: 'Doe',
      image: 'https://example.com/employee-image.jpg',
      position: 'Developer',
      expertise: 'Full Stack',
      seniority: 'SENIOR',
      email: 'john.doe.test@example.com',
      phone: '123456789',
      netSalary: '5000',
      grossSalary: '6000',
      skills: ['JavaScript', 'React'],
    };

    request.body = employeeData;
    const createdEmployee = { id: '1', ...employeeData };
    (employeeService.createEmployee as jest.Mock).mockResolvedValue(createdEmployee);
    (employeeService.getEmployeeByEmail as jest.Mock).mockResolvedValue(null);

    await employeeController.createEmployee(request as FastifyRequest, reply as FastifyReply);

    expect(reply.status).toHaveBeenCalledWith(201);

    expect(reply.send).toHaveBeenCalledWith(createdEmployee);
  });

  it('should handle validation errors', async () => {
    const expectedErrorMessage =
      'Seniority is required and must be one of: INTERN, JUNIOR, MEDIOR, SENIOR';

    const requestMock = {
      body: {
        name: 'John',
        surname: 'Doe',
        image: 'https://example.com/employee-image.jpg',
        position: 'Developer',
        expertise: 'Full Stack',
        seniority: 'MINOR',
        email: 'john.doe@example.com',
        phone: '123456789',
        netSalary: '5000',
        grossSalary: '6000',
        skills: ['JavaScript', 'React'],
      },
    };

    const replyMock: Partial<FastifyReply> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await employeeController.createEmployee(requestMock as any, replyMock as any);

    expect(replyMock.status).toHaveBeenCalledWith(400);
    expect(replyMock.send).toHaveBeenCalledWith({ error: expectedErrorMessage });
  });

  it('should return 500 status on server error', async () => {
    const employeeData: EmployeeData = {
      name: 'John',
      surname: 'Doe',
      image: 'https://example.com/employee-image.jpg',
      position: 'Developer',
      expertise: 'Full Stack',
      seniority: 'SENIOR',
      email: 'john.doe.test@example.com',
      phone: '123456789',
      netSalary: '5000',
      grossSalary: '6000',
      skills: ['JavaScript', 'React'],
    };

    request.body = employeeData;
    const error = new Error('Unexpected error');
    (employeeService.createEmployee as jest.Mock).mockRejectedValue(error);

    await employeeController.createEmployee(request as FastifyRequest, reply as FastifyReply);

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({ warning: 'Failed to create employee' });
  });

  it('should return 500 status on server error', async () => {
    const error = new Error('Unexpected error');
    (employeeService.getAllEmployees as jest.Mock).mockRejectedValue(error);

    await employeeController.getAllEmployees(request as FastifyRequest, reply as FastifyReply);

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('should fetch employee by ID', async () => {
    const employeeId = '1';
    const employee = { id: '1', name: 'John', surname: 'Doe' };
    (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(employee);

    const requestMock = { params: { id: employeeId } };
    const replyMock: Partial<FastifyReply> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await employeeController.getEmployeeById(requestMock as any, replyMock as any);

    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(employee);
  });

  it('should return 404 status if employee not found', async () => {
    const employeeId = '1';

    (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(null);

    const requestMock = { params: { id: employeeId } };
    const replyMock: Partial<FastifyReply> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await employeeController.getEmployeeById(requestMock as any, replyMock as any);

    expect(replyMock.status).toHaveBeenCalledWith(404);
    expect(replyMock.send).toHaveBeenCalledWith({ error: 'Employee not found' });
  });

  it('should update an employee and return 200 status', async () => {
    const employeeId = 'employee-id';
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

    const updatedEmployee = { id: employeeId, ...employeeData };
    const requestMock = { params: { id: employeeId }, body: employeeData };
    const replyMock: Partial<FastifyReply> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    (employeeService.updateEmployee as jest.Mock).mockResolvedValue(updatedEmployee);

    await employeeController.updateEmployee(requestMock as any, replyMock as any);

    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(updatedEmployee);
  });

  it('should return 500 status on server error', async () => {
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

    const error = new Error('Unexpected error');
    request.params = { id: '1' };
    request.body = employeeData;
    (employeeService.updateEmployee as jest.Mock).mockRejectedValue(error);

    await employeeController.updateEmployee(request as FastifyRequest, reply as FastifyReply);

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('should delete an employee', async () => {
    const employeeId = 'employee-id';
    const deletedEmployee = { id: employeeId };

    const requestMock = { params: { id: employeeId } };
    const replyMock: Partial<FastifyReply> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    (employeeService.deleteEmployee as jest.Mock).mockResolvedValue(deletedEmployee);

    await employeeController.deleteEmployee(requestMock as any, replyMock as any);

    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(employeeId);
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(deletedEmployee);
  });

  it('should handle employee not found', async () => {
    const employeeId = '1';
    (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(null);

    const requestMock = { params: { id: employeeId } };
    const replyMock: Partial<FastifyReply> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await employeeController.getEmployeeById(requestMock as any, replyMock as any);

    expect(replyMock.status).toHaveBeenCalledWith(404);
    expect(replyMock.send).toHaveBeenCalledWith({ error: 'Employee not found' });
  });
});
