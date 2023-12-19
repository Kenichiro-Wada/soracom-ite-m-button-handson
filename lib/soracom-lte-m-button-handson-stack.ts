import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct} from 'constructs';

export class SoracomLteMButtonHandsonStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      // Secret Manager
    const secretSlackUrl = new secretsmanager.Secret(this, 'Secret', {
      secretObjectValue: {
        slackUrl: cdk.SecretValue.unsafePlainText('<Your Use Slack Webhook Url>')
      },
    })
    
    // Secret Manager Lambda Layer
    // Set Deploy Region Same Layer ARN(ex. APN1: arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:11)
    // https://docs.aws.amazon.com/systems-manager/latest/userguide/ps-integration-lambda-extensions.html#ps-integration-lambda-extensions-add
    const lambdaLayer = lambda.LayerVersion.fromLayerVersionArn(this, "LambdaLayer", '<Deploy Region AWS-Parameters-and-Secrets-Lambda-Extension ARN>');
    
    // AWS Lambda
    const soracomIotMButtonFunction = new lambdaNodeJs.NodejsFunction(
      this,
      "SoracomIotmButtonFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: "lambda/index.ts",
        handler: "handler",
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        description: "From SORACOM Funk",
        layers: [lambdaLayer],
        environment:{
          SINGLE_MESSAGE:"シングルクリック",
          DOUBLE_MESSAGE:"ダブルクリック",
          LONG_MESSAGE:"長押し",
          SECRET_SLACK_URL: secretSlackUrl.secretName
        }
      }
    );
    secretSlackUrl.grantRead(soracomIotMButtonFunction);
    new cdk.CfnOutput(this, "SORACOM LTE-M Button Slack Post Function ARN", {
      value: soracomIotMButtonFunction.functionArn,
    });
  }
}
