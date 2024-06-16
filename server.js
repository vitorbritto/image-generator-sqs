import "dotenv/config";
import express from "express";
import aws from "aws-sdk";

const app = express();
const folder = process.env.PWD;

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sqs = new aws.SQS();

app.use(express.static(folder));
app.use(express.json());

app.post("/request_images", (req, res) => {
  const quantity = parseInt(req.body.quantity);

  for (let i = 0; i < quantity; i++) {
    const params = {
      MessageBody: JSON.stringify({ index: i }),
      QueueUrl: process.env.SQS_URL,
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
  }

  res.json({ body: req.body, status: "success" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
