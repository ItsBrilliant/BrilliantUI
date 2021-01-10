import Axios from 'axios';
import { Email } from '../data_objects/Email.js';
import graph from './graph/graph.js';
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";


export async function get_mailbox(callback_func, url) {
    return;
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

export function get_calendar(callback_func) {
    test_graph_helper();
    return;
    Axios.get('/calendar_react').then(res => {
        const events = res.data;
        callback_func(events);
    }).catch((res) => {
        console.log('unable to load events');
    });
}


export function send_email(email) {
    Axios.post('/sendmail_react', email).then(res => console.log(res));
}

export function test_direct_graph() {
    console.log("starting test");
    Axios.get('/v1.0/me/messages', {
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6Imw5SkVDY0hCUHZsYURJWEtIb0RFU0R4amZERkt3RmVIaXRZRk1mVTE3WnciLCJhbGciOiJSUzI1NiIsIng1dCI6IjVPZjlQNUY5Z0NDd0NtRjJCT0hIeEREUS1EayIsImtpZCI6IjVPZjlQNUY5Z0NDd0NtRjJCT0hIeEREUS1EayJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8wYWFkYzkzNy0xZGVmLTRhMTAtOTAzNC0xZWU3NDlhYWU3YTEvIiwiaWF0IjoxNjEwMjcwNjcyLCJuYmYiOjE2MTAyNzA2NzIsImV4cCI6MTYxMDI3NDU3MiwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVNRQTIvOFNBQUFBMHFxOEhyWXFZSlQ0ZjJhMS93RVZwdXl5NTVjQTQwSVQ1aDBRSUU3OE1JOD0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkJyaWxsaWFudFVJIiwiYXBwaWQiOiJlZWM3ZTRkYy05MjYyLTQwMDYtYmMxMC1mODA5YTgyZDU5MzQiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IkJyaWRnZXIiLCJnaXZlbl9uYW1lIjoiRG92IiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTA5LjY1LjE5Ny4yMzgiLCJuYW1lIjoiRG92IEJyaWRnZXIiLCJvaWQiOiI0ZGRjNmQwMi0yZjY4LTRhNzQtYWI1Ni0zOThkMGFiYjdlZDciLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDBGQUNFRjU3NCIsInJoIjoiMC5BQUFBTjhtdEN1OGRFRXFRTkI3blNhcm5vZHpreC01aWtnWkF2QkQ0Q2FndFdUUURBRm8uIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgTWFpbC5SZWFkV3JpdGUgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiU21zSnNGcVFIRkJJWGk2ZmNEMVVUSXl1TXRiWnZmR0htYldHcVdnY21ZayIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjBhYWRjOTM3LTFkZWYtNGExMC05MDM0LTFlZTc0OWFhZTdhMSIsInVuaXF1ZV9uYW1lIjoiZG92YnJpZGdlckBpdHNicmlsbGlhbnQuY29tIiwidXBuIjoiZG92YnJpZGdlckBpdHNicmlsbGlhbnQuY29tIiwidXRpIjoiUzluMmhUMTlOMEtQbGh1Mk9qUUtBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJxLWdYaTRFb2lXY0xhamdOUVduZ0ZDTGpyN0MxY3NiRmViMjZDblAxSEs0In0sInhtc190Y2R0IjoxNTg5ODQ2MjA1fQ.VQVd8B5_7NS-w5q4Z3YLoSkcvq5jX1ntq9OmMb4Edzz34qQOr6V5zWiu_HyFbdI2zrNclvi3YHdPjsrjNSm31X2Cnm5iwUnEWsvaJbPySDss8n0isK2uoTH1bEeNgxyzLWETd19UbRItYkZ5tgRd-N6LQgRYHhDC65s3BRKRKCOoc11Q9Q4BUjjNGBaYtFJQFHHjDTDEBYOGmMQC_EZ21Q7lQ5ZN-M6JcfzdME0wqCJh-PLXanN-k9FLFztyJAtQV5lD84SwRAeUdiEhr2TiV4Fy0s7V11vlKsEAPQ8UkXVyIFLGzH_L5u6mgmdtAUoA4wpua3sRdPRTEdkBPTRoWQ'
        }
    }).then(res => console.log(res)).catch(e => console.log(e));
}

export function test_graph_helper() {
    const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlVzMG5xdlhMcWFuUE03d29pd1kwTTNNLXNqRFhMbmk0NUdjNDVMRy1uUEEiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVPZjlQNUY5Z0NDd0NtRjJCT0hIeEREUS1EayIsImtpZCI6IjVPZjlQNUY5Z0NDd0NtRjJCT0hIeEREUS1EayJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8wYWFkYzkzNy0xZGVmLTRhMTAtOTAzNC0xZWU3NDlhYWU3YTEvIiwiaWF0IjoxNjEwMjgxNTgyLCJuYmYiOjE2MTAyODE1ODIsImV4cCI6MTYxMDI4NTQ4MiwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiRTJKZ1lMaS9TVnJES0NpcDg3Sk8xZjM0ZGYwL1Q4L2dFbGRpWHNiU0g3dnZ0di9jOTlFQSIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiQnJpbGxpYW50VUkiLCJhcHBpZCI6ImVlYzdlNGRjLTkyNjItNDAwNi1iYzEwLWY4MDlhODJkNTkzNCIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiQnJpZGdlciIsImdpdmVuX25hbWUiOiJEb3YiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxMDkuNjUuMTk3LjIzOCIsIm5hbWUiOiJEb3YgQnJpZGdlciIsIm9pZCI6IjRkZGM2ZDAyLTJmNjgtNGE3NC1hYjU2LTM5OGQwYWJiN2VkNyIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMEZBQ0VGNTc0IiwicmgiOiIwLkFBQUFOOG10Q3U4ZEVFcVFOQjduU2Fybm9kemt4LTVpa2daQXZCRDRDYWd0V1RRREFGby4iLCJzY3AiOiJDYWxlbmRhcnMuUmVhZCBNYWlsLlJlYWRXcml0ZSBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJTbXNKc0ZxUUhGQklYaTZmY0QxVVRJeXVNdGJadmZHSG1iV0dxV2djbVlrIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiMGFhZGM5MzctMWRlZi00YTEwLTkwMzQtMWVlNzQ5YWFlN2ExIiwidW5pcXVlX25hbWUiOiJkb3ZicmlkZ2VyQGl0c2JyaWxsaWFudC5jb20iLCJ1cG4iOiJkb3ZicmlkZ2VyQGl0c2JyaWxsaWFudC5jb20iLCJ1dGkiOiJsUEM5RFhEOS1FcTYxUVlNX0w4eUFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6InEtZ1hpNEVvaVdjTGFqZ05RV25nRkNManI3QzFjc2JGZWIyNkNuUDFISzQifSwieG1zX3RjZHQiOjE1ODk4NDYyMDV9.1BJHYmeZ5-otith9H-MKMq_Xj6V2FO8IX0OyOmZsOV4xdjZrXF0jxUen7aGuX4fnTV3y2M7MQ9guSgLwvH1rogMjX7HA1aQE6DNMNVIqvRLaDzkTy43ka9jcrjdSnqvY95BtnSz9Bzp1zOhg9xhzcYSKonvfHKh3rJ9BLiZyxdTOT6eT4vzqw3gdR2Us0nnlSmFL2T2Fibsp4YiPaEaCwR0Qz8Sryt3GTXIneAy5aNfTqTU1QgIjHz5rvL-5SBYoCxDaDZG_3kGM7YOLjJe2TYggpPAsXDugjNvSQPmEJc_RHYa_HUSGcNnSzWulB0h5npWXbmVvU7BQ07RG2AqToQ'
    console.log("starting test graph helper");
    graph.getEvents(token).then(res => console.log(res));

}
