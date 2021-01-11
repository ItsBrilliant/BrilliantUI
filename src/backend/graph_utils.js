import { PageIterator, PageCollection, PageIteratorCallback } from '@microsoft/microsoft-graph-client'


export async function callingPattern(client, client_call, update_function) {
    var aggregated_data = []
    try {
        // Makes request to fetch mails list. Which is expected to have multiple pages of data.
        let response: PageCollection = await client_call(client);
        // A callback function to be called for every item in the collection. This call back should return boolean indicating whether not to continue the iteration process.
        let callback: PageIteratorCallback = (data) => {
            if (update_function) {
                update_function([data])
            } else {
                aggregated_data.push(data)
            }
            return true;
        };
        // Creating a new page iterator instance with client a graph client instance, page collection response from request and callback
        let pageIterator = new PageIterator(client, response, callback);
        // This iterates the collection until the nextLink is drained out.
        pageIterator.iterate();
        return aggregated_data;
    } catch (e) {
        throw e;
    }
}