var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')
var mailConfig = require('../config.json').mailer;
var jade = require('jade');
router.post('/',handleContact);
function handleContact(req,res){
  // Si le mail est bon => send else -> petit notif
  var transporter = nodemailer.createTransport({
       service: mailConfig.service,
       auth: {
           user: mailConfig.auth[mailConfig.service].contact.user, // Your email id
           pass: mailConfig.auth[mailConfig.service].contact.pass // Your password
       }
   });
  var metaData = {
    container: {
      name: req.body.username,
      mail: req.body.usermail,
    }};
   var jadeOutput = jade.renderFile('views/email/contact.jade',metaData);
   var mailOptions = {
    from: req.body.usermail, // sender address
    to: 'EthyloTeam<ethylokey@gmail.com>', // list of receivers
    subject: 'Contact depuis le site web', // Subject line
    html: jadeOutput // You can choose to send an HTML body instead
};
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
            res.status(500).send('Une erreur est survenue, veuillez réessayer');
        }else{
            console.log('Message sent: ' + info.response);
            res.send('Votre mail a bien été envoyé, merci de votre intérêt pour Ethylokey');
        };
    });


}

module.exports = router;
