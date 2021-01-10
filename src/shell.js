const APP_SECERET = "n9LkoVoUL1.oR0gKkn~KH.68t32SL-Y9Py";
const secret_id = "a4386622-d401-49e3-8f5c-5d4903eabcaa";
const APP_ID = "eec7e4dc-9262-4006-bc10-f809a82d5934";
const TENANT_ID = "0aadc937-1def-4a10-9034-1ee749aae7a1";
const OBJECT_ID = "793f9132-93af-4eec-a257-2241fa7f360b";
const TOKEN_ENDPOINT = "https://login.microsoftonline.com/" + TENANT_ID + "/oauth2/v2.0/token";
const MS_GRAPH_SCOPE = 'https://graph.microsoft.com/.default';

const axios = require('axios');
const qs = require('qs');

const postData = {
    client_id: APP_ID,
    scope: MS_GRAPH_SCOPE,
    client_secret: APP_SECERET,
    grant_type: 'client_credentials'
};
console.log(postData);
post_data_str = qs.stringify(postData)
console.log(post_data_str)
axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded';

let token = '';

axios
    .post(TOKEN_ENDPOINT, post_data_str)
    .then(response => {
        token = response.data.access_token;
        console.log(token);
    })
    .catch(error => {
        console.log(error);
    });

    

