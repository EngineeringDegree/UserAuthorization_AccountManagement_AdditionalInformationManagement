const express = require('express')
const router = express.Router()

// Middleware which sends change password page
router.get('/', async (req, res) => {
    return res.status(200).render('pages/changePassword')
})

module.exports = router