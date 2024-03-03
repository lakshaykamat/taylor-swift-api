const isAdmin = (usernameToCheck, passwordToCheck) => {
  const USER = [
    {
      username: process.env.USERNAME1,
      password: process.env.PASSWORD1,
    },
    {
      username: process.env.USERNAME2,
      password: process.env.PASSWORD2,
    },
  ];
  const user = USER.find((user) => user.username === usernameToCheck);

  if (user) {
    // Check if the provided password matches the stored password
    return user.password === passwordToCheck;
  }

  return false;
};

module.exports = { isAdmin };
