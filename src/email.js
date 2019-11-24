// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

AWS.config.update({region: 'REGION'});

var name = 'Quyen' ;
var email = 'lemaiquyen93@gmail.com' ;
var subject = 'Quyen Le Model - Enquiry'
var salutation = 'Hi ' + name + ',\n' ;
var body = 'Thank you for your enquiry at quyen-le-model.com. I will get back to you as soon as possible\n Kind Regards,\n Quyen' ;

// Create sendEmail params 
var params = {
  Destination: { /* required */
//    CcAddresses: [
//      'EMAIL_ADDRESS',
//    ],
    ToAddresses: [
      email
    ]
  },
  Message: { /* required */
    Body: { /* required */
//      Html: {
//       Charset: "UTF-8",
//       Data: "HTML_FORMAT_BODY"
//      },
      Text: {
       Charset: "UTF-8",
       Data: salutation + body 
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: subject
     }
    },
  Source: 'no-reply@quyen-le-module.com', /* required */
//  ReplyToAddresses: [
//     'EMAIL_ADDRESS',
//    /* more items */
//  ],
};

// Create the promise and SES service object
var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });