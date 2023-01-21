const { SQS } = require("aws-sdk");

async function sendSQSMessage(queueUrl, message) {
  const sqs = new SQS();
  const payload = {
    MessageAttributes: {},
    MessageBody: message,
    QueueUrl: queueUrl,
  };
  return sqs.sendMessage(payload).promise();
}

exports.sendSQSMessage = sendSQSMessage;
