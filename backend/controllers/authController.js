/**
 * @file Contollers for authentication. Session-based using OAuth 2.0
 */
const { validationResult } = require("express-validator");
const createError = require("http-errors");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");
const session = require("express-session");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
/** Helper function to get an OAuth2Client instance. */
function getOAuth2Client() {
  return new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);
}

/** Controller that returns the code challenge to the client. */
async function googleRedirect(req, res, next) {
  if (req.session.credentials) {
    console.log("User already logged in");
    // If session is already logged in, do not redirect to OAuth consent screen.
    res.status(200).json({ warning: "Already logged in" });
  } else {
    try {
      const oAuth2Client = getOAuth2Client();

      console.log("Making a new client");
      // Generate code challenge & verifier (PKCE)
      const { codeVerifier, codeChallenge } =
        await oAuth2Client.generateCodeVerifierAsync();
      // Store the code verifier in the session
      req.session.codeVerifier = codeVerifier;

      // Generate OAuth URL to redirect to
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        scope: [
          "openid",
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      });

      res.redirect(authUrl);
    } catch (err) {
      next(err);
    }
  }
}

/**
 * Controller function that logs in user, given they have started an OAuth flow
 * from the oAuthRedirect redirect URL, and have the correct authorization code.
 */
async function googleLogin(req, res, next) {
  const errors = validationResult(req);
  console.log("Initiate new user", req.session);
  await req.session.save();
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const oAuth2Client = getOAuth2Client();

  // Get authorization code from request and code verifier from session storage
  const code = req.body.code;
  const codeVerifier = req.session.codeVerifier;

  if (req.session.credentials) {
    // If already logged in, do not go through the OAuth flow
    res.status(201).json({ warning: "Already logged in" });
    console.log("Already logged in");
  } else {
    try {
      // Request for an access token.
      const { tokens } = await oAuth2Client.getToken({ code, codeVerifier });

      oAuth2Client.setCredentials(tokens);
      try {
        console.log("Initiate new user 2");

        // Get userinfo endpoint from OpenID Connect Discovery document
        const oidConfRes = await oAuth2Client.request({
          url: "https://accounts.google.com/.well-known/openid-configuration",
          method: "GET",
        });
        const userinfoEndpoint = oidConfRes.data.userinfo_endpoint;

        // Get the user information using the endpoint
        const userinfo = await oAuth2Client.request({
          url: userinfoEndpoint,
          method: "GET",
        });

        // console.log("user info ",userinfo);
        // Attach the user's email  address to the session
        req.session.user = {
          emailId: userinfo.data.email,
          userName: userinfo.data.name,
          picture: userinfo.data.picture,
        };
      } catch (err) {
        console.log("Token error ", err);
        return next(err);
      }

      // Storing credentials in session storage
      req.session.credentials = tokens;
      try {
        const user = await User.findOne({
          emailId: req.session.user.emailId,
        }).exec();
        console.log("session user", req.session.user);

        if (user) {
          // Update the user's name if it has changed.
          if (user.userName !== req.session.user.userName) {
            user.userName = req.session.user.userName;
            await user.save();
          }

          // If user is registered, send all details of the user
          const { emailId, userName, phoneNo, role } = user;
          const userDetails = {
            registered: true,
            emailId,
            userName,
            phoneNo,
            role,
            picture: req.session.user.picture,
          };
          res.status(200).json(userDetails);
          console.log("user creation successful", userDetails);
        } else {
          // Send the details fetched from OIDC
          const { emailId, userName, picture } = req.session.user;

          // Get emailId and userName from session, phoneNo from request
          // body, and role assigned by default is "student".
          const newUser = new User({
            emailId,
            userName,
            phoneNo: null,
            role: "customer",
          });
          await newUser.save();

          res.status(200).json({
            registered: false,
            emailId,
            userName,
            picture,
          });
        }
      } catch (err) {
        console.log("storing credential in session storage ", err);
        return next(err);
      }
    } catch (err) {
      // If authorization code was invalid, we return 401 Unauthorized.
      next(createError(401, "Invalid code grant request"));
    }
  }
  console.log("Finally user made", req.session);
  await req.session.save();
  res.status(200);
}

async function logout(req, res, next) {
  try {
    if (req.session.credentials) {
      // If session was logged in, then revoke credentials
      console.log("Initiate logout");
      const oAuth2Client = getOAuth2Client();
      oAuth2Client.setCredentials(req.session.credentials);
      await oAuth2Client.revokeCredentials();
    }
  } catch (err) {
    next(err);
  }

  // Destroy the current session
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204);
    }
  });
}

async function isAuthenticated(req, res, next) {
  console.log("request session", req.session);
  if (req.session.credentials) {
    // Try to find the user among the registered users
    // req.user = await User.findOne({ emailId: req.session.user.emailId }).exec();
          // await req.user.populate("");
      next();
  } else {
    // Return 401 Unauthorized if user is not authenticated
    res.status(401).json({ errors: "User is not authenticated" });
  }
}



/**
 * Middleware function, that can be used to check for authentication on
 * protected API endpoints. Returns 401 Unauthorized if user is not
 * authenticated.
 */
async function isAuthenticatedAsBusiness(req, res, next) {
  console.log("request session", req.session);
  if (req.session.credentials) {
    // Try to find the user among the registered users
    req.user = await User.findOne({ emailId: req.session.user.emailId }).exec();
    req.session.user = req.user;
    await req.session.save();
    if (req.user.role == "business") {
      // await req.user.populate("");
      next();
    } else {
      // Return 401 Unauthorized if user is not a business
      res
        .status(401)
        .json({
          errors:
            "User must be registered as a business in order to post an advertisement",
        });
    }
  } else {
    // Return 401 Unauthorized if user is not authenticated
    res.status(401).json({ errors: "User is not authenticated" });
  }
}

module.exports = {
  googleRedirect,
  googleLogin,
  logout,
  isAuthenticated,
  isAuthenticatedAsBusiness,
};
