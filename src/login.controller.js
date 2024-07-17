import jwt from "jsonwebtoken";

const loginUser = async (req, res, next) => {
  const user = {
    name: "Harsh Bachchani",
    email: "harshbachchani@gmail.com",
    password: "HarshB",
    username: "harsh",
  };
  console.log("Hello from me");
  if (user) {
    const accessToken = await jwt.sign(user, "access_secret", {
      expiresIn: "15m",
    });
    const refreshToken = await jwt.sign(user, "refresh_secret", {
      expiresIn: "7d",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.json({ message: "Login successful", user });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    console.log("Hii from me");
    console.log(req.cookies);
    console.log(req.params);
    console.log(req.headers);
    const user = {
      name: "Harsh Bachchani",
      email: "harshbachchani@gmail.com",
      password: "HarshB",
      username: "harsh",
    };
    if (refreshToken) {
      await jwt.verify(refreshToken, "refresh_secret", (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Invalid refresh token" });
        const newAccessToken = jwt.sign(user, "access_secret", {
          expiresIn: "15m",
        });
        console.log(newAccessToken);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
        });
        res.json({ message: "Token refreshed" });
      });
    } else {
      console.log("Helll from threr");
      res.status(401).json({ message: "No refresh token provided" });
    }
  } catch (error) {
    return res
      .status(501)
      .json({ message: "Internal Server Error", err: error });
  }
};
export { loginUser, refreshToken };
