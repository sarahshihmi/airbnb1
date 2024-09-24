const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');


const { setTokenCookie } = require('../../utils/auth');
const { Spot } = require('../../db/models')

const router = express.Router();

router.get('/', async (req, res) => {
    let { page, size} = req.query;

    size = parseInt(size) || 5;
    page = parseInt(page) || 1;


   // Limit size to a reasonable number
    if (size > 20) size = 20;
    if (size < 1) size = 5;

    // Ensure page is a positive number
    if (page < 1) page = 1;

    // Calculate offset for pagination
    const offset = size * (page - 1);

        // Fetch spots with pagination
    const spot = await Spot.findAll({
            limit: size,
            offset: offset,
    });

    return res.json(
        {spots: spot}
    )

});

router.get('/:spotId', async (req, res) => {
    const spotId = parseInt(req.params.spotId);

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    return res.json(spot);
})


module.exports = router;