import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword: string): Promise<string | undefined> => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};
