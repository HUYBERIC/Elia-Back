const registerUser = (req, res) => {
  res.send("User registration");
};

const loginUser = (req, res) => {
  res.send("User login");
};

module.exports = { registerUser, loginUser };
