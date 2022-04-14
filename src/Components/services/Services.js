import axios from 'axios'
import qs from 'qs'
// export api funcations constant
export const Services = {
  servicesPost,
  servicesGet,
  createSeminar,
  deleteSeminar
};
const Prefix = "http://test-api.endpoints.talk-speech.cloud.goog"

// login call function
async function servicesPost(data, endpoint) {
  const { data: response } = await axios.post(
    `${Prefix}${endpoint}`, {
    ...data
  });
  return response;
}
async function servicesGet(endpoint, token) {
  const options = {
    headers: {
      'x-access-tokens': token,
    }

  }
  const { data: response } = await axios.get(
    `${Prefix}${endpoint}`, options);
  return response;
}
async function createSeminar(data, endpoint) {
  const { data: response } = await fetch(`${Prefix}${endpoint}`, data);
  return response;
}

async function deleteSeminar(endpoint, token) {
  const options = {
    headers: {
      'x-access-tokens': token
    }
  }
  const { data: response } = await axios.delete(`${Prefix}${endpoint}`, options);
  return response;
}

