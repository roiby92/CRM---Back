const dataBaseService = function () {

    const clients = require('./data.json')
    const Sequelize = require('sequelize')
    const sequelize = new Sequelize('mysql://root:@localhost/crm_project')

    const addOwner = async function (owner) {
        let ownerId
        const isOwnerExist = await sequelize
            .query(`SELECT id FROM owner WHERE name = '${owner}'`)
        if (isOwnerExist[0].length === 0) {
            const res = await sequelize
                .query(`INSERT INTO owner VALUES(null, '${owner}')`)

            ownerId = res[0]
        } else {
            ownerId = isOwnerExist[0][0].id
        }
        return ownerId
    }

    const addEmailType = async function (type) {
        let emailId
        const isEmailExist = await sequelize
            .query(`SELECT id FROM email_type WHERE type = '${type}'`)
        if (isEmailExist[0].length === 0) {
            const res = await sequelize
                .query(`INSERT INTO email_type VALUES(null, '${type}')`)

            emailId = res[0]
        } else {
            emailId = isEmailExist[0][0].id
        }
        return emailId
    }

    const addCountry = async function (country) {
        let countryId
        const isCountryExist = await sequelize
            .query(`SELECT id FROM country WHERE name = '${country}'`)
        if (isCountryExist[0].length === 0) {
            const res = await sequelize
                .query(`INSERT INTO country VALUES(null, '${country}')`)

            countryId = res[0]
        } else {
            countryId = isCountryExist[0][0].id
        }
        return countryId
    }

    const addClient = async function () {
        for (let c of clients) {
            const ownerId = await addOwner(c.owner)
            const emailTypeId = await addEmailType(c.emailType)
            const countryId = await addCountry(c.country)
            const isClientExist = await sequelize
                .query(`SELECT id FROM client WHERE id='${c._id}'`)
            if (isClientExist[0].length === 0) {
                await sequelize
                    .query(`INSERT INTO client
                    VALUES('${c._id}',
                        '${c.name}',
                        '${c.email}',
                        '${c.firstContact.replace('T', ' ').replace('Z', '')}',
                        ${emailTypeId},
                        ${c.sold},
                        ${ownerId},
                        ${countryId}
                    )`)
            }
        }
    }

    const addOneClient = async function (client) {
        const ownerId = await addOwner(client.owner)
        const emailTypeId = await addEmailType(client.emailType)
        const countryId = await addCountry(client.country)
        const isClientExist = await sequelize
            .query(`SELECT id FROM client WHERE id='${client.id}'`)
        if (isClientExist[0].length === 0) {
            await sequelize
                .query(`INSERT INTO client
                        VALUES('${client.id}',
                            '${client.name}',
                            '${client.email}',
                            '${client.firstContact.replace('T', ' ').replace('Z', '')}',
                            ${emailTypeId},
                            ${client.sold},
                            ${ownerId},
                            ${countryId}
                        )`)
        }
    }

    const getTopOwners = async function () {
        const topOwners = await sequelize.query(`
        SELECT  o.name AS name, COUNT(c.id) AS clientNumber
        FROM owner AS o JOIN client AS c on o.id = c.owner
        WHERE c.sold = 1
        GROUP BY o.id
        ORDER BY clientNumber desc
        LIMIT 3;
        `)
        return topOwners[0]
    }

    const getSalseByCountry = async function () {
        const salseByCountry = await sequelize.query(`
        SELECT cu.name AS countyName, COUNT(c.id) AS clientsPerCountry
        FROM client AS c JOIN country AS cu on c.country = cu.id
        WHERE c.sold =1
        group by cu.id
        `)
        return salseByCountry[0]
    }
    const getSalseByDate = async function () {
        const salseByDate = await sequelize.query(`
        SELECT DAY(first_contact) AS day , COUNT(id) AS numOfSales
        FROM client
        where MONTH(first_contact)="10" AND DAY(first_contact) BETWEEN "1" AND  "30"
        GROUP BY DAY(first_contact)
        `)
        return salseByDate[0]
    }

    const updateClient = async (clientName, property, value) => {
        if (property != 'sold' && property != 'name') {
            const condition = property === 'email_type' ? 'type' : 'name';
            await sequelize.query(`
            UPDATE client
            SET ${property} = (SELECT id
                               FROM ${property}
                                WHERE ${condition} = '${value}')
            WHERE name = '${clientName}'
            `)
        } else {
            await sequelize.query(`
            UPDATE client
            SET ${property} = ${value}
            WHERE name = '${clientName}'
            `)
        }
    }


    return { addOwner, addEmailType, addCountry, addClient, addOneClient, getTopOwners, getSalseByCountry, getSalseByDate, updateClient }
}


module.exports = dataBaseService;
