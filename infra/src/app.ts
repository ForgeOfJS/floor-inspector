import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Queue, QueueEncryption } from "aws-cdk-lib/aws-sqs";

const app = new App({ analyticsReporting: false });
const stack = new Stack(app, "FloorInspectorFoundation", {
  description:
    "Floor Inspector foundation — archive and import queue boundaries",
});

new Bucket(stack, "ReportArchive", {
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  enforceSSL: true,
  encryption: BucketEncryption.S3_MANAGED,
  removalPolicy: RemovalPolicy.RETAIN,
});

const deadLetterQueue = new Queue(stack, "ImportDeadLetterQueue", {
  encryption: QueueEncryption.SQS_MANAGED,
  enforceSSL: true,
});

new Queue(stack, "ImportQueue", {
  encryption: QueueEncryption.SQS_MANAGED,
  enforceSSL: true,
  deadLetterQueue: { queue: deadLetterQueue, maxReceiveCount: 5 },
});

app.synth();
