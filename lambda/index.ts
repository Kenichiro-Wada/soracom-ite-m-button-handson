
import axios from "axios";

const secretId = String(process.env.SECRET_SLACK_URL);
const requestEndpoint = "http://localhost:2773/secretsmanager/get?secretId=" + secretId;
const requestOptions = {
  headers: {
    "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN,
  }
};

async function getSecret() {
  const response = await axios.get(requestEndpoint, requestOptions);
  const jsonSecret = JSON.parse(response.data["SecretString"]);
  return jsonSecret
}

async function postSlack(url: string, message: string) {
  const param = {
    text: message
  }
  const res = await axios.post(url, JSON.stringify(param));
  console.log(res);
}

exports.handler = async function (
  event: any,
  context: any
) {
  console.log(JSON.stringify(event, null, 2));
  console.log(JSON.stringify(context, null, 2));
  
  const detectType = event.detect_type;
  let message = 'No Message!';
  if (detectType == 'Single short click') {
    message = String(process.env.SINGLE_MESSAGE);
  } else if (detectType == 'Double short click') {
    message = String(process.env.DOUBLE_MESSAGE);
  } else if (detectType == 'Single long click') {
    message = String(process.env.LONG_MESSAGE);
  }
  const secret = await getSecret();
  await postSlack(secret.slackUrl, message)
};
