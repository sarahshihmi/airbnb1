const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Sequelize } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models');


const router = express.Router();

const avgStarRating = (reviews) => {

}

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true})
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true})
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true})
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true})
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .exists({ checkFalsy: true})
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .exists({ checkFalsy: true})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true})
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true})
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];


router.get('/:spotId', async (req, res) => {
    const spotid = parseInt(req.params.spotId);
    
    
   const spot = await Spot.findOne({
        where: {id: spotid},
        attributes: {
            include: [
              [
                Sequelize.fn('COUNT', Sequelize.col('Reviews.id')),
                'numReviews',
              ],
              [
                Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                'avgStarRating',
              ],
            ],
          },
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ], group: ['Spot.id', 'SpotImages.id', 'Owner.id']
   })





    return res.json(spot);
})

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    if (req.user.id !== req.params.spotId) {
        return new Error('You do not own this spot.')
    }

    const {
         address, city, state, country, 
         lat, lng, name, description, price
        } = req.body

    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    })

    spot.update()
})

router.post('/', requireAuth, validateSpot, async (req, res) => {
    const {
         address, city, state, country, 
         lat, lng, name, description, price
        } = req.body

        const spot = await Spot.create({
                    address, city, state, country, 
                    lat, lng, name, description, price
                })

        return res.json(spot)
});

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




module.exports = router;