const express = require('express')
const db = require('../db/db')
const router = express.Router()


/**
*@api {post} /city Add city
*@apiVersion 0.1.0
*@apiName AddCity
*@apiGroup Cities
*
*@apiParam {String} Name City Name, not unique
*@apiParam {String} CountryCode Country Code, not unique
*@apiParam {String} District District, not unique
*@apiParam {Number} Population Population, not unique
*
*@apiParamExample Example Body:
*{
*    "Name":"Sherpur",
*    "CountryCode": "BGD",
*    "District":"Sherpur",
*    "Population":1543000
*}
*
*@apiSuccess {Number} id City ID
*@apiSuccess {String} Name City Name
*@apiSuccess {String} CountryCode Country Code
*@apiSuccess {String} District District
*@apiSuccess {Number} Population Population
*
*@apiSuccessExample Success:
*HTTP/1.1 201 OK
*[
*    {
*        "ID": 4089,
*        "Name": "Sherpur",
*        "CountryCode": "BGD",
*        "District": "Sherpur",
*        "Population": 1543000
*    }
*]
*
*@apiError {Boolean} success false
*@apiError {String} message You must fill all the fields!
*
*@apiErrorExample {json} Error-Response:
*HTTP/1.1 400 Bad Request
*{
*    "success": false,
*    "message": "You must fill all the fields!"
*}
*/
router.post('/city', async (req,res) => {
    try{
        const data = await db.select().table('city')
        const myID = data[data.length-1].ID+1
        const newCity = {
            ID: myID,
            Name: req.body.Name,
            CountryCode: req.body.CountryCode,
            District: req.body.District,
            Population: req.body.Population
        }
        const {ID,Name,CountryCode,District,Population} = newCity

        if(ID && Name && CountryCode && District && Population){
            const id = await db('city')
            .insert(newCity)
            const city = await db('city').where({ID: myID})
            res.status(201).json(city)
        }else{
            res.status(400).json({success: false, message: 'You must fill all the fields!'})
        }
    }catch(e){
        res.status(500).json({success: false, message: 'Error 500'})
    }
})


/**
 * @api {get} /city/:city Request City information
 * @apiName GetCity
 * @apiGroup Cities
 *
 * @apiParam {String} city City Name
 *
 * @apiSuccess {String} Name City Name
 * @apiSuccess {String} CountryCode Country Code of the City
 * @apiSuccess {String} District District of the City
 * @apiSuccess {Number} Population Population of the City
 * 
 * @apiSuccessExample Success:
 * HTTP/1.1 200 OK
 * {
 *   "Name": "Sherpur",
 *   "CountryCode": "BGD",
 *   "District": "Sherpur",
 *   "Population": 1543000
 * }
 * 
 * @apiError {Boolean} success false
 * @apiError {String} message City Not Found
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "success": false,
 *   "message": "City Not Found"
 * }
 */

router.get('/city/:city', async (req,res) => {
    try{
        const [city] = await db('city').where({Name: req.params.city})
        if(!city){
            res.status(404).json({success: false, message: 'City Not Found'})
        }else{
            const theCity = {
            Name: city.Name,
            CountryCode: city.CountryCode,
            District: city.District,
            Population: city.Population
        }
        res.status(200).send(theCity)
        }
        
    }catch(e){
        res.status(400).json({success: false, message: 'Not Found'})
    }
})

/**
 * @api {put} /city/:id Update City Population
 * @apiName UpdateCityPopulation
 * @apiGroup Cities
 *
 * @apiParam {Number} id City ID
 *
 * @apiSuccess {Number} ID City ID
 * @apiSuccess {String} Name City Name
 * @apiSuccess {String} CountryCode Country Code of the City
 * @apiSuccess {String} District District of the City
 * @apiSuccess {Number} Population Population of the City
 * 
 * @apiSuccessExample Success:
 * HTTP/1.1 200 OK
 * {
 *   "ID": 4085,
 *   "Name": "Sherpur",
 *   "CountryCode": "BGD",
 *   "District": "Sherpur",
 *   "Population": 1543000
 * }
 * 
 * @apiError {Boolean} success false
 * @apiError {String} message City Not Found
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "success": false,
 *   "message": "City Not Found"
 * }
 */

router.put('/city/:id', async (req,res) => {
    try{
        const city = await db('city').where({ID: req.params.id}).update({Population: req.body.Population})
        if(!city){
            res.status(404).json({success: false, message: 'No City Found'})
        }else{
            const theCity = await db('city').where({ID: req.params.id})
            res.status(201).json(theCity)
        }
    }catch(e){
        res.status(400).json({success: false, message: 'City Not Found'})
    }
})


/**
 * @api {delete} /city/:id Delete a City
 * @apiName DeleteCity
 * @apiGroup Cities
 *
 * @apiParam {Number} id City ID
 *
 * @apiSuccess {Boolean} success true
 * 
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *   "success": true
 * }
 * 
 * @apiError {Boolean} success false
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "success": false,
 * }
 */
router.delete('/city/:id', async (req,res) => {
    try{
        const city = await db('city').where({ID: req.params.id}).del()
        if(!city){
            res.status(404).json({success: false})
        }else{
            res.status(200).json({success: true})
        }
    }catch(e){
        res.status(400).json({success: false})
    }
})

module.exports = router