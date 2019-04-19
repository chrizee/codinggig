const express = require('express');
const router = express.Router();
const Gig = require('../models/Gigs');
const {body, validationResult} = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Op = require('sequelize').Op;

//get all gigs
router.get('/', (req,res) => {
    Gig.findAll()
        .then(gigs => {           
            res.render("gigs", {gigs});
        })
        .catch(err => console.log(err))
});

router.get('/add', (req, res) => res.render('add'));

router.post('/add',[ 
    body('title').isLength({min: 3}).withMessage("title is too short").trim(),
    body('technologies').isLength({min: 3}).trim().withMessage("technologies is too short").trim(),
    body('budget').not().isEmpty().withMessage("budget is too short").isAlphanumeric().withMessage("budget must be alphabet").trim(),
    body('description').isLength({min: 3}).withMessage("description is too short").isAlphanumeric().withMessage("description must be alphabet").trim(),
    body('contact_email').isEmail().withMessage("Contact email must be an email").trim(),

    sanitizeBody('*').escape(),
    (req, res, next) => {
        
        console.log(req.body);
        let {title, technologies, budget, description, contact_email} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render('add', {errors: errors.array(), title, technologies, budget, description, contact_email});
            return;
        }
        budget = `$${budget}`;
        technologies = technologies.toLowerCase().replace(/, /g, ',');
        Gig.create({
            title, technologies, description, budget, contact_email
        })
        .then(gig => res.redirect('/gigs'))
        .catch(err => console.log(err));
    }
]);

router.get('/search', (req, res, next) => {
    let {term} = req.query;
    term = term.toLowerCase();

    Gig.findAll({where: {technologies: {[Op.like]: '%'+ term+ '%'}}})
        .then(gigs => res.render('gigs', {gigs}))
        .catch(err => console.log(err))
})
module.exports = router;