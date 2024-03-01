import { User } from "../model/user.model.js";

const handleUserSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });

  return res.status(200).json({
    message: "user created successfully",
  });
};

export { handleUserSignUp };
