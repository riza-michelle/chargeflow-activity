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
  return event;
}

module.exports = {
  parse,
};
