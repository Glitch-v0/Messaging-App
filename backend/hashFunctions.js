import bcrypt from "bcryptjs";

const createHash = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export { createHash, comparePasswords };
