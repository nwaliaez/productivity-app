import bcrypt from 'bcryptjs';

export async function saltAndHashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10; // Cost factor, you can adjust this value
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password hashing failed');
  }
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match; // Returns true if the password matches, false otherwise
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}
