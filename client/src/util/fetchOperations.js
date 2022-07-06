import router from "@/router/index"
import { getShortenedJSONDate } from "@/util/formatter";

async function watchForRedirects(res) {
  if ((await res).redirect === '/logout') {
    console.log('Forcing log out')
    router.push('/logout')
    return undefined
  }
  return res
}

async function fetchGroups() {
  console.debug("Fetching for all groups")
  return watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "groups"].join('/'), {
    credentials: 'include',
    mode: 'cors'
  })).json());
}

async function fetchGroup(groupID) {
  console.debug(`Fetching for group by ID: ${groupID}`)
  return watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "groups", groupID].join('/'), {
    credentials: 'include',
    mode: 'cors'
  })).json());
}

async function fetchAttendance(groupID) {
  console.debug(`Fetching for attendance by ID ${groupID}`)
  return watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID].join('/'),{
    credentials: 'include',
    mode: 'cors'
  })).json());
}

async function fetchAttendanceByDate(groupID, date) {
  console.debug(`Fetching for attendance by ID ${groupID} and date ${date}`)
  return watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'),{
    credentials: 'include',
    mode: 'cors'
  })).json());
}

async function updateAttendance(groupID, date, body) {
  await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'), {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    credentials: 'include',
    mode: 'cors'
  })).json())
}

async function addAttendance(groupID, body) {
  await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID].join('/'), {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    credentials: 'include',
    mode: 'cors'
  })).json())
}

async function deleteAttendance(groupID, date) {
  await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'), {
    method: 'DELETE',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    credentials: 'include',
    mode: 'cors'
  })).json())
}

export {
  fetchGroup,
  fetchGroups, 
  fetchAttendance,
  fetchAttendanceByDate,
  deleteAttendance,
  updateAttendance,
  addAttendance
}