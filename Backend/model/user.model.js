import { mongoose } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      requird: true,
    },
    email: {
      type: String,
      requird: true,
    },
    password: {
      type: String,
      requird: true,
      set: (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    },
  },
  { timestamps: true }
);
const User = mongoose.model("user", userSchema);

export { User };
