// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
  getUserDetails: async function (accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
  },


  getEvents: async function (accessToken) {
    const client = getAuthenticatedClient(accessToken);
    const events = await client
      .api('/me/events')
      .select('subject,organizer,start,end,location,attendees')
      .orderby('createdDateTime DESC')
      .get();
    return events.value;
  },

  getMail: async function (accessToken) {
    const client = getAuthenticatedClient(accessToken);
    const emails = await client
      .api('/me/messages')
      .orderby('createdDateTime DESC')
      .get();
    return emails.value;
  },

  sendMail: async function (accessToken, email) {
    const client = getAuthenticatedClient(accessToken);
    const res = await client.api('/me/sendMail').post(email);
    return res;
  }

};

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}