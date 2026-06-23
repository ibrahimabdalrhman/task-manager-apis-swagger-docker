import { AppError } from '../src/utils/AppError';

describe('AppError', () => {
  it('should create an operational error with status code', () => {
    const error = new AppError('Not found', 404);
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
  });

  it('should include validation errors when provided', () => {
    const errors = [{ field: 'email', message: 'Invalid email' }];
    const error = new AppError('Validation failed', 400, errors);
    expect(error.errors).toEqual(errors);
  });

  it('should default to 500 status code', () => {
    const error = new AppError('Server error');
    expect(error.statusCode).toBe(500);
  });
});
