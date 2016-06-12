var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')
var mailConfig = require('../config.json').mailer;
var dbConfig = require('../config.json').dataBase;
var jade = require('jade');
var validator = require('validator');
var MongoClient = require('mongodb').MongoClient;

router.post('/',handleSendMail);
function handleSendMail(req,res){
  // Si le mail est bon => send else -> petit notif
  var transporter = nodemailer.createTransport({
       service: mailConfig.service,
       auth: {
           user: mailConfig.auth[mailConfig.service].subscribe.user, // Your email id
           pass: mailConfig.auth[mailConfig.service].subscribe.pass // Your password
       }
   });
   var mailOptions = {
    from: 'EthyloTeam<subscribe@ethylokey.ovh>', // sender address
    to: req.body.usermail, // list of receivers
    subject: 'Newsletter', // Subject line
    html: jade.renderFile('views/email/subscribe.jade') // You can choose to send an HTML body instead
};
if(validator.isEmail(mailOptions.to)){
  var d = new Date();
  var n = d.toDateString();
  console.log(n);
  var urlConnect = dbConfig.service+"://"+ dbConfig.auth[dbConfig.service].username+":"+dbConfig.auth[dbConfig.service].password;
  urlConnect+="@"+dbConfig.auth[dbConfig.service].address+"/"+dbConfig.auth[dbConfig.service].dataBase;

  MongoClient.connect(urlConnect, function(error, db) {
      if (error) throw error;
      var objNew = { date_subscribe: n , mail: mailOptions.to };
      db.collection("subscribe").insert(objNew, null, function (error, results) {
        if (error) throw error;
        console.log("Le document a bien été inséré");
      });
  });
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
}else {
    console.log('mail non valide');
    res.status(500).send('Votre mail n\'est pas valide, veuillez réessayer');
  }
// redirect after the mail
}

module.exports = router;
