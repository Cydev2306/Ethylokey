var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')
var mailConfig = require('../config.json').mailer;
router.post('/',handleSayHello);
function handleSayHello(req,res){
  // Si le mail est bon => send else -> petit notif
  var transporter = nodemailer.createTransport({
       service: mailConfig.service,
       auth: {
           user: mailConfig.auth[mailConfig.service].user, // Your email id
           pass: mailConfig.auth[mailConfig.service].pass // Your password
       }
   });
   var html = "<h2>L\' équipe d'ethylokey vous remercie de votre intérêt pour le projet.</h2>"+
   "Vous serez donc les procains à être informé des nouvelles avancées d'Ethylokey !";
   var mailOptions = {
    from: 'EthyloTeam<ethylokey@gmail.com>', // sender address
    to: req.body.usermail, // list of receivers
    subject: 'Newsletter', // Subject line
    html: html // You can choose to send an HTML body instead
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
        //res.render('index',{ page:'index',err:true,msg:'Une erreur est survenue, veuillez réessayer'})
        res.status(500).send('Une erreur est survenue, veuillez réessayer');
    }else{
        console.log('Message sent: ' + info.response);
        //res.render('index',{ page:'index',err:true,msg:'Vous avez bien été ajouté a notre Newsletter, merci !'});
        res.send('Vous avez bien été ajouté a notre Newsletter, merci !');
    };
});
// redirect after the mail
}

module.exports = router;
