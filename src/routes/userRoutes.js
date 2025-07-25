const express = require ("express");
const { verifyToken } = require ("../middleware/auth");
const router = express.Router();
const { authorizeRoles } = require("../middleware/role");


// Only admin can access this route
router.get("/admin", verifyToken, authorizeRoles(["admin"]), (req, res) => {
    try{
    res.json({ message: "Welcome Admin" });
    } catch (err){ 
        console.error("Admin route error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Both manager and admin can access this route
router.get("/manager", verifyToken, authorizeRoles(["admin", "manager"]), (req, res) => {
    res.json({ message: "Welcome Manager" });
});

// All roles can access this route
router.get("/user", verifyToken, authorizeRoles(["admin", "manager", "user"]), (req, res) => {
    res.json({ message: "Welcome User" });
});


module.exports = router;
