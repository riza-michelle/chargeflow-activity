function parseHTTP(event) {
  let body = {};
  try {
    body = JSON.parse(event.body);
  } catch (err) {}
  if (body === null) {
    body = {};
  }
  // Merge path parameters
  if (event.pathParameters) {
    body = {
      ...body,
      ...event.pathParameters,
    };
  }
  // Merge query string parameters
  if (event.queryStringParameters) {
    body = {
      ...body,
      ...event.queryStringParameters,
    };
  }

  return body;
}

function parse(event) {
  if (event.Records) {
    const len = event.Records.length;
    if (len < 1) {
      return {};
    }
    const record = event.Records[0];
    if (record.eventSource.split(":")[1] === "sqs" && record.body) {
      return JSON.parse(record.body);
    }
  }
  if (event.httpMethod) {
    return parseHTTP(event);
  }
  return event;
}

async function handleEvent(event, handler) {
  const payload = parse(event);
  let statusCode = 200;
  let body = {};
  let message = "";
  try {
    body = await handler(payload);
  } catch (ex) {
    message = ex.message;
    statusCode = ex.statusCode || 500;
  }
  return { statusCode, body: JSON.stringify(body) };
}

module.exports = {
  parse,
  handleEvent,
};
