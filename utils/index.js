const Album = require("../models/Album");
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

const getAlbumName = async (albumId) => {
  try {
    const album = await Album.findById(albumId).select("title").lean();

    return album ? album.title : null;
  } catch (error) {
    console.error("Error fetching album name:", error.message);
    return null;
  }
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
module.exports = { isAdmin, getAlbumName, getAlbumDetails };
