const Album = require("../models/Album");
const Song = require("../models/Song");

const enhanceAlbumWithSongsData = async (album) => {
  const songPromises = album.tracks.map((songId) =>
    Song.findById(songId.toString()).select("-__v").select("-_id").lean()
  );
  const songs = await Promise.all(songPromises);

  album.tracks = cleanUpSongsData(songs, album);
  album.trackLength = calculateTotalDuration(album.tracks);
  album.songCount = album.tracks.length;
  return album;
};

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

const getAlbumDetails = async (albumId) => {
  try {
    const album = await Album.findById(albumId).select("-__v -_id").lean();
    return album
      ? {
          albumName: album.title,
          albumCover: album.albumCover,
          artist: album.artist,
          releaseDate: album.releaseDate,
        }
      : null;
  } catch (error) {
    console.error("Error fetching album details:", error.message);
    return null;
  }
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

// Helper function to clean up songs data
const cleanUpSongsData = (songs, album) => {
  return songs
    .filter((song) => song !== null)
    .map(({ albumId, ...songWithoutAlbumId }) => ({
      ...songWithoutAlbumId,
      album: album.title,
    }));
};

module.exports = {
  isAdmin,
  getAlbumDetails,
  calculateTotalDuration,
  cleanUpSongsData,
  enhanceAlbumWithSongsData,
};
