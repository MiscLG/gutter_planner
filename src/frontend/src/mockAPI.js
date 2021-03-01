const apiHost = () => {};

mock_graphQL_query = {
    "data": {
      "clients": [
        {
          "id": "3",
          "name": "Gus Sto"
        },
        {
          "id": "2",
          "name": "Mark DeSouza"
        },
        {
          "id": "1",
          "name": "Rose Jimenez"
        }
      ]
    }
  }
  
const searchClients = () => Promise.resolve(mock_graphQL_query)

const callAPI = async () => searchClients();
export {callAPI}