import axios from 'axios';

const address = process.env.REACT_APP_BACKEND_ADDRESS

const default_queries= {
    // clients: `query clientQuery {clients{ id name}}`,
    users : `query userQuery{users{edges{node{id,username,archived,verified,email,secondaryEmail}}}}`,
    user:`query getUser($email:String!){ user(email:$email){ uid email username isStaff }}`,
    user_items: `query addressTest($uid:String) { addresses(uid:$uid){ addressLine1 addressLine2 zipCode jobs{ jid depositPaid dateStarted dateFinished }}}`
}
const default_mutations = {
    register :`mutation addUser($email:String!,$username:String!, $password1:String!, $password2:String!){ register( email: $email, password1: $password1, password2: $password2, username: $username,) { success, errors, token, refreshToken } }`,
    social_auth:`mutation SocialAuth($provider:String!, $accessToken:String!){socialAuth(provider:$provider, accessToken: $accessToken){social{id uid extraData}}}`,
    add_address:`mutation addAddress($addressLine1:String!, $addressLine2:String!,$city:String!,$zipCode:String!,$isGated:Boolean,$username:String!){
        createAddress(
          addressData:{
            addressLine1:$addressLine1, 
            addressLine2:$addressLine2,
            city:$city,
            zipCode:$zipCode,
            isGated:$isGated
            user:{
              username:$username
            }
          }){
          ok
          address{
            addressLine1
            addressLine2
            city
            zipCode
            isGated
            users{
              uid
              username
            }
          }
        }
      }`,
      add_job: `mutation addJob($email:String!,$username:String!){
        createJob(jobData:{
          depositPaid:false
          client:{
            username: $username
            email: $email
          }
        }){
          ok,
          job{
            jid
            dateStarted
            dateFinished
            clients{
              uid
              username
            }
          }
        }
      }`,
      add_estimate:`mutation addEstimate($roofType:String!,$ftGutter:Int!,$qtyDownspout:Int!,$numFloors:Int,$spaciousGround:Boolean,$notes:String, $addressLine1:String!, $jid:String!,$uid:String!){
        createEstimate(
          estimateData:{
            roofType:$roofType,
            ftGutter:$ftGutter,
            qtyDownspout:$qtyDownspout,
            roofInclination:C,
            numFloors:$numFloors,
            spaciousGround:$spaciousGround,
            notes:$notes,
            address:{addressLine1:$addressLine1}
            job:{jid:$jid},
            estimator:{uid:$uid},
          }){
            ok 
            estimate{
                eid 
                address {
                    addressLine1
                }
                job {
                    jid
                }
                estimator{
                    uid
                }
            }
          }
        }`
}

const callAPI = async (query,variables={}) => {
    let options = {
        url: `${address}graphql/`,
        method: "POST",
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        data: {query,variables}
    }
    // console.log(options)
    let response = await axios(options);
    return response.data;
}

let testUser = {username:"test", email:"me@example.com", password1:"HelloWorld$", password2:"HelloWorld$"}
// const getClients = async () =>  await callAPI(default_queries.clients)
const getUsers = async () => await callAPI(default_queries.users)
const getUser = async (variables) => await callAPI(default_queries.user,variables)
const getUserItems = async(variables) => await callAPI(default_queries.user_items,variables)
const register = async (variables) => await callAPI(default_mutations.register,variables)
const test_register = async () => await callAPI(default_mutations.register,testUser)
const social_auth = async (variables) => await callAPI(default_mutations.social_auth,variables)
const addAddress = async (variables) => await callAPI(default_mutations.add_address,variables)
const addJob = async (variables) => await callAPI(default_mutations.add_job,variables)
const addEstimate = async (variables) => await callAPI(default_mutations.add_estimate,variables)
export {callAPI, register, getUsers, getUser,getUserItems,social_auth,addAddress,addJob,addEstimate}