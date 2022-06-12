const express = require('express')
const router = express.Router()

// Middleware for login user
router.patch('/', async (req, res) => {
    return res.status(200).send("test")
})

module.exports = router