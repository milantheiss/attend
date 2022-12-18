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
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "groups"].join('/'), {
    credentials: 'include',
    mode: 'cors'
  })).json());
}

async function fetchGroup(groupID) {
  console.debug(`Fetching for group by ID: ${groupID}`)
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "groups", groupID].join('/'), {
    credentials: 'include',
    mode: 'cors'
  })).json());
}

async function fetchAttendance(groupID) {
  console.debug(`Fetching for attendance by ID ${groupID}`)
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID].join('/'),{
    credentials: 'include',
    mode: 'cors'
  })).json());
}

async function fetchAttendanceByDate(groupID, date) {
  console.debug(`Fetching for attendance by ID ${groupID} and date ${date}`)
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'),{
    credentials: 'include',
    mode: 'cors'
  })).json());
}

async function updateTrainingssession(groupID, date, body) {
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'), {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    credentials: 'include',
    mode: 'cors'
  })).json())
}

//WARNING Wird nicht benutzt. --> Kann gelöscht werden wenn kein Fehler entsteht. API Endpoint ist deaktiviert!!
// async function addTrainingssession(groupID, body) {
//   await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID].join('/'), {
//     method: 'PATCH',
//     body: JSON.stringify(body),
//     headers: { 'Content-type': 'application/json; charset=UTF-8' },
//     credentials: 'include',
//     mode: 'cors'
//   })).json())
// }

//WARNING Wird nicht benutzt. --> Kann gelöscht werden wenn kein Fehler entsteht. API Endpoint ist deaktiviert!!
// async function deleteTrainingssession(groupID, date) {
//   await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'), {
//     method: 'DELETE',
//     headers: { 'Content-type': 'application/json; charset=UTF-8' },
//     credentials: 'include',
//     mode: 'cors'
//   })).json())
// }

async function fetchAttendanceByDateRange(groupID, startdate, enddate){
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "attendance/getFormattedList", groupID, getShortenedJSONDate(startdate), getShortenedJSONDate(enddate)].join('/'), {
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
  })).json())
}

async function fetchGroupInfo(groupID){
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "groups", groupID, 'getInfo'].join('/'), {
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
  })).json())
}

async function updateMemberInGroup(groupID, body){
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "groups", groupID, 'updateMember'].join('/'), {
    method: "PATCH",
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(body),
    credentials: 'include',
    mode: 'cors'
  })).json())
}

async function removeMemberFromGroup(groupID, memberID) {
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "groups", groupID, 'removeMember', memberID].join('/'), {
    method: 'DELETE',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    credentials: 'include',
    mode: 'cors'
  })).json())
}

async function authenticateSession() {
  return (await fetch([process.env.VUE_APP_API_URL, 'authenticate'].join('/'), {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    credentials: 'include',
    mode: 'cors'
  })).json()
}

async function getLastPatchNotes() {
  return (await fetch([process.env.VUE_APP_API_URL, 'patchNotes'].join('/'), {
    method: 'GET',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    credentials: 'include',
    mode: 'cors'
  })).json()
}

async function fetchDataForInvoice(body){
  return await watchForRedirects((await fetch([process.env.VUE_APP_API_URL, "invoice"].join('/'), {
    method: 'GET',
    body: JSON.stringify(body),
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
  updateTrainingssession,
  fetchAttendanceByDateRange,
  fetchGroupInfo,
  updateMemberInGroup,
  removeMemberFromGroup,
  authenticateSession,
  getLastPatchNotes,
  fetchDataForInvoice
}