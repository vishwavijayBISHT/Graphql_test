const User = require("../../models/user");
// const {} = require("./merge");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (a) => {
    try {
      console.log(a);
      const { email, password } = a.userInput;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("user already exists");
      }
      const user = new User({
        email,
        password: bcrypt.hashSync(password, 12),
      });
      const res = await user.save();

      return { ...res._doc, password: null };
    } catch (err) {
      throw new Error("user not created", err);
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("user dont exixt");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("user dont exixt");
      }
      const token = await jwt.sign(
        { userId: user.id, email: user.email },
        "somesuperseqretkey",
        { expiresIn: "1h" }
      );
      return { userid: user.id, token: token, tokenExp: 1 };
    } catch (err) {
      console.log(err);
    }
  },
};
