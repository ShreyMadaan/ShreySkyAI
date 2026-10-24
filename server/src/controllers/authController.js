
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const googleClient = new OAuth2Client();

function safeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    favoriteCities: user.favoriteCities,
    preferredUnit: user.preferredUnit,
  };
}

function startSession(req, user) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);

      req.session.userId = user._id.toString();

      req.session.save((saveError) => {
        if (saveError) return reject(saveError);
        resolve();
      });
    });
  });
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 60 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      email.length > 254 ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Provide a valid name, email, and password (8–72 UTF-8 bytes).",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      authProvider: "local",
      lastLoginAt: new Date(),
    });

    await startSession(req, user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: safeUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");

    if (!user?.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const matches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!matches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    await startSession(req, user);

    await User.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
}

export async function googleLogin(req, res) {
  const { credential } = req.body ?? {};

  if (
    typeof credential !== "string" ||
    !credential.trim() ||
    credential.length > 10000
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid Google credential is required.",
    });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({
      success: false,
      message: "Google authentication is not configured.",
    });
  }

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch (error) {
    console.error("Google token verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Google credential.",
    });
  }

  if (
    !payload?.sub ||
    !payload?.email ||
    payload.email_verified !== true
  ) {
    return res.status(401).json({
      success: false,
      message: "Google account verification failed.",
    });
  }

  try {
    const googleId = payload.sub;
    const email = payload.email.trim().toLowerCase();

    let user = await User.findOne({ googleId });

    if (!user) {
      const existingEmailUser = await User.findOne({ email });

      if (existingEmailUser) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists. Sign in using your original method.",
        });
      }

      const name =
        typeof payload.name === "string" && payload.name.trim()
          ? payload.name.trim().slice(0, 60)
          : email.split("@")[0].slice(0, 60);

      try {
        user = await User.create({
          name,
          email,
          googleId,
          authProvider: "google",
          lastLoginAt: new Date(),
        });
      } catch (error) {
        if (error.code !== 11000) throw error;

        user = await User.findOne({ googleId });

        if (!user) {
          return res.status(409).json({
            success: false,
            message:
              "An account with this email already exists. Sign in using your original method.",
          });
        }
      }
    }

    await startSession(req, user);

    await User.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    );

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Google authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to authenticate with Google.",
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session user no longer exists.",
      });
    }

    return res.json({
      success: true,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user.",
    });
  }
}

export function logout(req, res) {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Unable to log out.",
      });
    }

    res.clearCookie("shreysky.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  });
}
