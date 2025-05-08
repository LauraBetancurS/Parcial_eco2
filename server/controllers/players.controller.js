const playersDb = require("../db/players.db");

const getPlayers = async (req, res) => {
  try {
    const sortType = req.query.sort;
    let players;

    if (sortType === "alpha") {
      players = playersDb.getPlayersSortedByName();
    } else {
      // default: score descending
      players = playersDb.getPlayersSortedByScore();
    }

    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPlayers,
};
