import { registerSchema, loginSchema } from '../src/validators/authValidators';
import { createProjectSchema } from '../src/validators/projectValidators';
import { createTaskSchema } from '../src/validators/taskValidators';

describe('validators', () => {
  describe('registerSchema', () => {
    it('should accept valid registration data', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject weak passwords', () => {
      const result = registerSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        password: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'john@example.com',
        password: 'anypassword',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('createProjectSchema', () => {
    it('should accept valid project data', () => {
      const result = createProjectSchema.safeParse({
        title: 'My Project',
        description: 'A test project',
        status: 'active',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = createProjectSchema.safeParse({ title: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('createTaskSchema', () => {
    it('should accept valid task data with defaults', () => {
      const result = createTaskSchema.safeParse({ title: 'My Task' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('pending');
        expect(result.data.priority).toBe('medium');
      }
    });
  });
});
