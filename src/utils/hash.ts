import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword: string): Promise<string | undefined> => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};
export const comparePassword = async (plainPassword: string, hashedPassword: string | undefined): Promise<boolean> => {
  if (!hashedPassword) {
    return false;
  }

  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};
