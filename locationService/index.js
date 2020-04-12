'use strict'
const AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
  console.log(JSON.stringify(`Event: event`))
  // Lambda Code Here
  // context.succeed('Success!')
  // context.fail('Failed!')
}