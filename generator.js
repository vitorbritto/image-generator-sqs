import "dotenv/config";
import fs from "node:fs";
import request from "request";
import aws from "aws-sdk";
import cron from "node-cron";

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sqs = new aws.SQS();

const generateImage = (fileName) => {
  const url = "https://cataas.com/cat";
  request(url).pipe(fs.createWriteStream(`images/${fileName}.png`));
};

const processMessages = () => {
  sqs.receiveMessage(
    {
      QueueUrl: process.env.SQS_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return err;
      }

      if (data.Messages.length === 0) {
        console.log("No messages in the queue");

        process.exit(0);
      }

      if (data.Messages) {
        console.log("Received messages:", data.Messages.length);

        data.Messages.forEach((message) => {
          const fileName = message.MessageId;

          generateImage(fileName);

          console.log("Generated image:", fileName);

          sqs.deleteMessage(
            {
              QueueUrl: process.env.SQS_URL,
              ReceiptHandle: message.ReceiptHandle,
            },
            (err, data) => {
              if (err) {
                console.log(err);
                return;
              }

              if (data) {
                console.log("Deleted message:", fileName);
              }
            }
          );
        });
      }
    }
  );
};

cron.schedule("*/1 * * * *", () => {
  console.log("Running queue, current time:", new Date());
  processMessages();
});
