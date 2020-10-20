const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const User = require('../model/User')

router.post(`/register`, async function (req, res) {
    try {
        const { email, password, firstName, lastName } = req.body

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ msg: "Not all fields have been enterd" })
        }
        const isExists = await User.find({ email: email })

        if (isExists.length > 0) {
            return res.status(400).json({ msg: 'account alredy exists' })
        }
        else {
            const salt = await bcrypt.genSalt()
            const hashPassword = await bcrypt.hash(password, salt);
            const user = new User({ email, password: hashPassword, firstName, lastName })
            await user.save()
            res.send(user)
        }
    } catch (err) {
        res.status(500).json({ error: err.massage });
    }
})

router.post(`/login`, async function (req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ msg: "Not all fiekds have been enterd" })
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ msg: "No User Found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) { return res.status(400).json({ msg: 'Invalid Password' }) }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                transactions: user.transactions
            }
        })
    }
    catch (err) {
        res.status(500).json({ error: err.massage });
    }
})

router.delete('/delete', auth, async function (req, res) {
    const deletedUser = await User.findByIdAndDelete(req.user)
    res.json(deletedUser)
})

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.json(false)

        const verified = jwt.verify(token,process.env.JWT_SECRET)
        if(!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if(!user) return res.json(false)

        res.json(true)

    } catch (err) {
        res.status(500).json({ error: err.massage });
    }
})

module.exports = router