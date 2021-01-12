import Axios from 'axios';
import { Email } from '../data_objects/Email.js';
import { graph } from './graph.js';
import { sleep } from '../utils.js';
const https = require('https');
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

export async function get_mailbox(callback_func, url) {
    while (true) {
        try {
            var res = await Axios.get(url);
            console.log(res)
            const emails = res.data.emails;
            callback_func(emails.map(e => new Email(e)));
            if (res.data.done) {
                break;
            }
        }
        catch (error) {
            console.log('unable to load emails');
            console.log(error);
            return;
        }
    }
}

export async function get_all_mail(callback_func, user) {
    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const emails = await graph.getMail(ACCESS_TOKEN)
        callback_func(emails.map(e => new Email(e)), user);
        //      const update_func = (data => callback_func([new Email(data)], user))
        await graph.getMail(ACCESS_TOKEN)
    }
    catch (e) {
        console.log("Error getting email messages:");
        console.log(e);
        check_reauthenticate(e, user)
    }
}

export async function get_calendar(callback_func, user) {
    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const events = await graph.getEvents(ACCESS_TOKEN);
        callback_func(events, user);
    } catch (e) {
        console.log("Error getting events:");
        console.log(e);
    }
}

export async function get_mail_folders(callback_func, user) {
    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const folders = await graph.getMailFolders(ACCESS_TOKEN);
        callback_func(folders, user);
    } catch (e) {
        console.log("Error getting mail folders:");
        console.log(e);
    }
}

export async function send_email(email, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("sending email");
    const res = await graph.sendMail(ACCESS_TOKEN, email);
    console.log(res)
}

async function get_access_token(user) {
    var ACCESS_TOKEN = window.localStorage.getItem(get_user_token_key(user));
    if (!ACCESS_TOKEN) {
        console.log("getting token");
        try {
            const res = await Axios.post('/token/auth/get_token',
                { email_address: user.get_address() },
                {
                    httpsAgent: new https.Agent(
                        {
                            strictSSL: false,
                            rejectUnauthorized: false,
                            ca: cert
                        }
                    )
                });
            ACCESS_TOKEN = res.data;
            window.localStorage.setItem(get_user_token_key(user), ACCESS_TOKEN);
            console.log("got token:");
            console.log(res);
        } catch (e) {
            console.log("Error getting token:");
            console.log(e);
            // Set an invalid token
            ACCESS_TOKEN = "e123"
            //          open_popup_login_window();
        }
    }
    return ACCESS_TOKEN;
}

function check_reauthenticate(e, user) {
    try {
        if (e.body && JSON.parse(e.body).code === "InvalidAuthenticationToken") {
            window.localStorage.removeItem(get_user_token_key(user));
            open_popup_login_window();
        }
    }
    catch {
        console.log(e)
    }
}

function open_popup_login_window() {
    //  window.open('/token', "token_window")
    sleep(2000);
}

function get_user_token_key(user) {
    return "ACCESS_TOKEN";
}

const cert = "-----BEGIN CERTIFICATE-----MIIF0TCCA7mgAwIBAgIUXfakTMQqrz0mvzL0PG4jiyqmUbIwDQYJKoZIhvcNAQELBQAweDELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxEjAQBgNVBAoMCUJyaWxsaWFudDEUMBIGA1UEAwwLQnJpbGxpYW50VUkxKjAoBgkqhkiG9w0BCQEWG2RvdmJyaWRnZXJAaXRzYnJpbGxpYW50LmNvbTAeFw0yMTAxMTIxNjA4MDVaFw0yMjAxMTIxNjA4MDVaMHgxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMRIwEAYDVQQKDAlCcmlsbGlhbnQxFDASBgNVBAMMC0JyaWxsaWFudFVJMSowKAYJKoZIhvcNAQkBFhtkb3ZicmlkZ2VyQGl0c2JyaWxsaWFudC5jb20wggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDIuTcC3sbPw7TBKCbmV6NnnUpDbj + zS4u8i1e9RtoMI66PEEWeNPrfD + qaBLfS77naSSnUWB6WgGLUdWHEPs5eu5uj9KOrJDROXvSaJNWELw7jWXLf4imrDD / 5Mpi0qE / 98Qm2La67qhIOxxpWY + wy75bCekiA7IK3g5hUd3yosu / 7IKS2DPGpZazWTB8X0 + ZQvm + otdnD3OIObW4cSLa2ctvBEoRu5TBj4xeXNagLQAaSXvk / BBfdQ / m + gE9LiH + QZ6XWowD0CyJzAL / GT54uHHR6lLRmU6YgVuAAua4aHpqQGpUUnJHSb2JwVaF0JC9IdBnHWhX9prBTmsL6tokTsrZbXnwWf3MzzWzPbFLNggwIQJN4DBBIULJu2 + oIz3Vv0lynjKxusKsVobtQh1QWfRob + Fri01LksdUEMQwEZPFyM7PytUF0us1yM2pMaR8 + Q0GQdar5djRJ8yZI + MoHRjW7vgk + 4FZYnnoLIqIM8U3uO8nQsvE0H1k + 3G6VJ4StitRSqIQTE29N8xvExLTtoVN00CY0GDRJEh7siVsFx96P + uCdWcpxdBFduSYD7s0GsbY9fHUHiWRNi9IhMTZFDUGjkobii + xzY3KsFJudnINzt1hV76QiiI1Yi8G2uskJbRrew0boqn2PBbu0U8JN9cGznAPjGITaCeFp8ujukQIDAQABo1MwUTAdBgNVHQ4EFgQUyQadsA7HDctMsP4zDpUwJnEZxuQwHwYDVR0jBBgwFoAUyQadsA7HDctMsP4zDpUwJnEZxuQwDwYDVR0TAQH / BAUwAwEB/ zANBgkqhkiG9w0BAQsFAAOCAgEAONPrRYWpeUF1TLIZgR2MNYoN1RS0DvI4OrfGA9Sx8qMnZzl7O + p + 7F4fEBTjxYxWke9nICZm / WDnCk4g / bJQ5Eazx68Bw0Tafk3W6SiLA4n / HR4ztfo + xuCJljE8tRVf0KnZJSStsXrgrR6rlBsQWfwdJnyLz + QOAwdTDamAVNrsQHDE + 25YsdtXZEM / aMrKDRx / o2xd1GPsnur6XYPrpliU6zcPxyqfPKQ6oXZyOPIFhBn7LTnj8W3Uv3 + HCtdJNw07xqrPAVNwYbtRbbVIoIBLhe801hsugEavbRhXM8XvE9OvvPOBHxpzgqwtdblWEWn4sXE9l3w26JZtsuZvJ5hE0b + vu / P9c26fSnNUdKKG5bwGAasj + sZFj7Ay71RS7YFFU5Sm5hziY03SDl5JR8O6TsQeol / oMLSqbzsLpyMujiWtAJQJqHk7Yb7SoRYxfOBQuLRVQr9Om2FwS / rse1z2gDeqVDukU43xKaE5JNt + iC3XFr4v + e8I3u0Km + t / CaY2LdAfdCUPOm4viTrhisba23Yj03cyOIE91MCu4BDe + C9 + cg51ZV53pfX//bM7+ZGBvcecYEXLsMIvcBdgP4yA850jVpVsUj1EelBz7usbcVwV9UtHoRUBR2qIiQ + UT9Y6wQ + mZeboCYHxDz7PcV7Ehp8a + JalF7lRxSzL0v8 =----- END CERTIFICATE----- "