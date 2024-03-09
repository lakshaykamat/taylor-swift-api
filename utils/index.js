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

const durationToSeconds = (duration) => {
  const [minutes, seconds] = duration.split(" ").map((part) => {
    if (part.includes("m")) {
      return parseInt(part.replace("m", ""), 10) * 60;
    } else {
      return parseInt(part.replace("s", ""), 10);
    }
  });
  return minutes + seconds;
};
const calculateTotalDuration = (tracks) => {
  const totalSeconds = tracks.reduce((sum, track) => {
    return sum + durationToSeconds(track.duration);
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
};

module.exports = {
  isAdmin,
  calculateTotalDuration,
};
