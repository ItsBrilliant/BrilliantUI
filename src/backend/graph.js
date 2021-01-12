// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { callingPattern } from './graph_utils.js';
var GRAPH = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

export const graph = {
  getUserDetails: async function (accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
  },


  getEvents: async function (accessToken) {
    const client = getAuthenticatedClient(accessToken);
    const events = await callingPattern(client, (client) =>
      client.api('/me/events')
        .top(100)
        .select('subject,organizer,start,end,location,attendees')
        .orderby('createdDateTime DESC')
        .get());
    ;
    return events;
  },

  getMailFolders: async function (accessToken) {
    const client = getAuthenticatedClient(accessToken);
    const folders = await callingPattern(client, (client) =>
      client.api('/me/mailFolders')
        .top(100)
        .get());
    ;
    return folders;
  },

  getMail: async function (accessToken, update_function) {
    const select_params = "subject,sender,body,toRecipients,ccRecipients,bccRecipients"
    const client = getAuthenticatedClient(accessToken);
    const emails = await callingPattern(client, (client) =>
      client.api('/me/messages')
        .top(100)
        //        .select(select_params)
        .orderby('createdDateTime DESC')
        .get(), update_function);
    return emails;
  },

  sendMail: async function (accessToken, email) {
    const client = getAuthenticatedClient(accessToken);
    const res = await client.api('/me/sendMail').post(email);
    return res;
  }

};

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = GRAPH.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}