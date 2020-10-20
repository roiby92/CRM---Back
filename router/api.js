const express = require('express')
const Category = require('../model/Category')
const router = express.Router()
const Transaction = require('../model/TransactionSchema')

router.get('/transactions', async function (req, res) {
    const transactions = await Transaction.find({})
    res.send(transactions)
})

router.get('/total',async function (req, res) {
    const totalAaoutByCategoty = await Transaction.aggregate([
        {
            $group:
            {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        }])
    res.send(totalAaoutByCategoty)

})

router.get('/categories', async function (req, res) {
    const categories = await Category.find({})
    res.send(categories)
})

router.post('/transaction', async function (req, res) {
    const transaction = new Transaction(req.body)
    await transaction.save()
    res.send(transaction)
})

router.post('/category', async function (req, res) {
    const category = new Category(req.body)
    await category.save()
    res.send(category)
})

router.delete('/transaction/:id', async function (req, res) {
    const { id } = req.params
    try {
        await Transaction.findByIdAndDelete({ _id: id })
        res.send(true)
    } catch (e) {
        res.send(false)
    }

})


module.exports = router