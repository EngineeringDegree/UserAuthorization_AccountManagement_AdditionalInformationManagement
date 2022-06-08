const express = require('express')
const router = express.Router()

// Middleware which sends add card page
router.get('/', async (req, res) => {
    return res.status(200).render('admin/manage')
})

module.exports = router