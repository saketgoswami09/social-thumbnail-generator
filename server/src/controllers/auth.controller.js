const bcrypt = require("bcryptjs");
const { z, email } = require("zod");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Define a schema for validating the registration input
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const register = async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "user with this email already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "user registerd succsesfully",
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    // If Zod validation fails, it throws an error
    if (error instanceof z.ZodError) {
      // Return a 400 Bad Request with the validation errors
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    // For any other errors, return a generic 500 server error
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    // 1. Get email and password from request body
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    // 2. Find the user in the database by their email
    const user = await User.findOne({ email });
    if (!user) {
      // Security: Use a generic error message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Compare the incoming password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Security: Use the same generic error message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    // If everything is correct, we'll issue a token in the next step.
    // For now, send a success response.
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getMe = async (req, res) => {
  try {
    // The user's id is attached to the req object by the authMiddleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  
  }
};

module.exports = {
  register,
  login,
  getMe,
}

console.log('--- FROM CONTROLLER --- Keys being exported:', Object.keys(module.exports));
