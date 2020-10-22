const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const sequelize = new Sequelize('mysql://root:@localhost/crm_project')
const dataBaseService = require('../SQL/dataBaseService')

router.get('/clients', async function (req, res) {
    const clients = await sequelize.query(`
    SELECT c.id,c.name, c.email, c.first_contact as firstContact, et.type as emailType, c.sold, o.name as owner, coun.name as country
    FROM client as c JOIN email_type as et
        on c.email_type = et.id
        JOIN owner as o on c.owner = o.id
        JOIN country as coun on c.country = coun.id
    ORDER BY c.first_contact;
    `)
    res.send(clients[0])
})

router.post('/client', async function (req, res) {
    const { client } = req.body
    const newClient = await dataBaseService().addOneClient(client)
    res.send(newClient[0])
})

router.get('/top', async function (req, res) {
    const topOwners = await dataBaseService().getTopOwners()
    res.send(topOwners)
})

router.get('/sales', async function (req, res) {
    const salseByCountry = await dataBaseService().getSalseByCountry()
    res.send(salseByCountry)
})
router.get('/date', async function (req, res) {
    const salseByDate = await dataBaseService().getSalseByDate()
    res.send(salseByDate)
})
router.put('/update', async function (req, res) {
    const { clientName, property, value } = req.body
    const updateClient = await dataBaseService().updateClient(clientName, property, value)
    res.send(updateClient)
})

module.exports = router