import axios from 'axios';

const address = process.env.REACT_APP_BACKEND_ADDRESS

const default_queries= {
    // clients: `query clientQuery {clients{ id name}}`,
    users : `query userQuery{users{edges{node{id,username,archived,verified,email,secondaryEmail}}}}`
}
const default_mutations = {
    register :`mutation addUser($email:String!,$username:String!, $password1:String!, $password2:String!){ register( email: $email, password1: $password1, password2: $password2, username: $username,) { success, errors, token, refreshToken } }`,
    social_auth:`mutation SocialAuth($provider:String!, $accessToken:String!){socialAuth(provider:$provider, accessToken: $accessToken){social{uid extraData}}}`,
}

const callAPI = async (query,variables={}) => {
    let options = {
        url: `${address}graphql/`,
        method: "POST",
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        data: {query,variables}
    }
    let response = await axios(options);
    return response.data;
}

let testUser = {username:"test", email:"me@example.com", password1:"HelloWorld$", password2:"HelloWorld$"}
// const getClients = async () =>  await callAPI(default_queries.clients)
const getUsers = async () => await callAPI(default_queries.users)
const register = async (variables) => await callAPI(default_mutations.register,variables)
const test_register = async () => await callAPI(default_mutations.register,testUser)
const social_auth = async (variables) => await callAPI(default_mutations.social_auth,variables)
export {callAPI, register, getUsers, social_auth}