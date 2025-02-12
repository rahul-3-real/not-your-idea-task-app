import { Router } from "express";

import {
  fetchUserProfileController,
  loginController,
  logoutController,
  refreshAccessTokenController,
  registerController,
} from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

// Router
const router = new Router();

router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/logout").post(isAuthenticated, logoutController);

router.route("/refresh-access-token").post(refreshAccessTokenController);
router.route("/profile").get(isAuthenticated, fetchUserProfileController);

export default router;
