const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Review, ReviewImage, User, Spot, SpotImage, Booking } = require('../../db/models');

router.use(handleValidationErrors)

router.get('/current', requireAuth, async (req, res) => {
  console.log('yay')
    const userId = req.user.id
    const bookings = await Booking.findAll({
        where: {
            userId,
        },
        include: [
            {
              model: Spot,
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'description'],
              },
            },
          ],
    })

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ message: 'No bookings found for this user.', bookings: [] });
    }
    return res.json({'Bookings':bookings})
})

router.put('/:bookingId', requireAuth, async(req, res) => {
    const bookingId = req.params.bookingId
    const userId = req.user.id
    const { startDate, endDate } = req.body
    const booking = await Booking.findByPk(bookingId)


  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  if (userId !== booking.userId) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }

  const currentDate = new Date();
  if (new Date(booking.startDate) < currentDate) {
    return res.status(400).json({
      message: "Past bookings can't be modified",
    });
  }

  if (new Date(startDate) < currentDate) {
    return res.status(400).json({
      message: "Booking start date cannot be in the past",
    });
  }

  if (new Date(endDate) <= new Date(startDate)) {
    return res.status(400).json({
      message: "End date must be after the start date",
    });
  }



  await booking.update(req.body);
  await booking.save();

  res.json(booking);
})


router.delete('/:bookingId', requireAuth, async(req, res)=> {
    const bookingId = req.params.bookingId
    const userId = req.user.id
    const booking = await Booking.findByPk(bookingId)

    if (booking.userId !== userId) {
        return res.status(403).json({
            message: 'Forbidden'
        })
    }

    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    const currentDate = new Date()
    if (new Date(booking.startDate) < currentDate) {
        return res.status(403).json({
          message: "Past bookings can't be deleted",
        });
    }

    await booking.destroy()

    res.json({
        message: "Sucessfully deleted"
    })


})

module.exports = router