const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Review, ReviewImage, User, Spot } = require('../../db/models');

router.use(handleValidationErrors)

router.get('/current', requireAuth, async(req, res, next)=> {
    const userId = req.user.id
    const reviews = await Review.findAll({
        where:{
            userId,
        },
        include: [
            {
                model: User,
                attributes:['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ]
    })
    res.json(reviews)
})

router.post('/:reviewId/images', requireAuth, async(res, req, next) => {
        const {reviewId} = req.params;
        const userId = req.user.id
        const review = await Review.findOne({
            where: {
                id: reviewId
            }, 
            include:[
                {model: ReviewImage}
            ]
        })

        if (review.userId !== userId) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
        const newImage = await review.createReviewImage(req.body);
        res.status(201).json(newImage);
})
module.exports = router;