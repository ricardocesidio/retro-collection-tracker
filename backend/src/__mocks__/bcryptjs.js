module.exports = {
  hash: jest.fn().mockResolvedValue('$2a$12$hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
};
