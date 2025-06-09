import bcrypt from 'bcryptjs';

export const generateSalt = async () => {
    const salt = await bcrypt.genSalt(10);
    return salt;
}

export const hashPassword = async (password: string, salt: string) => {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}