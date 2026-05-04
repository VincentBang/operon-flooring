"use strict";

const quoteRequestFunction = require("./save-quote-request");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return quoteRequestFunction.handler(event, context);
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    body = {};
  }

  return quoteRequestFunction.handler(Object.assign({}, event, {
    body: JSON.stringify(Object.assign({}, body, {
      mode: "email_quote"
    }))
  }), context);
};
