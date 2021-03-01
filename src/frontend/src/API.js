import axios from 'axios';

const address = process.env.REACT_APP_BACKEND_ADDRESS

const default_queries= {
    clients: `query clientQuery {clients{ id name}}`
}

const callAPI = async (query) => {
    let options = {
        url: `${address}graphql/`,
        method: "POST",
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        // body: JSON.stringify({query}),
        data: {query}
    }
    // let response = await window.fetch(`${address}graphql/`,options);
    let response = await axios(options);
    return response.data;
}

const getClients = async () =>  await callAPI(default_queries.clients)

export {callAPI, getClients}