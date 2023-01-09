import router from "@/router/index";
import { getShortenedJSONDate } from "./formatter.js";

/**
 *
 * @param {Promise<Response>} res
 * @returns
 */
async function watchForRedirects(res, { raw = false } = {}) {
	if ((await res).status === 401 && await (await res).text() === "Logout") {
		console.log("Server responded with 401, redirecting to logout");
		router.push("/logout");
		return undefined;
	} else if (raw) {
		return await res;
	} else {
		return (await res).json();
	}
}

async function fetchGroups() {
	console.debug("Fetching for all groups");
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups"].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function fetchGroup(groupID) {
	console.debug(`Fetching for group by ID: ${groupID}`);
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups", groupID].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function fetchAttendance(groupID) {
	console.debug(`Fetching for attendance by ID ${groupID}`);
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function fetchAttendanceByDate(groupID, date) {
	console.debug(`Fetching for attendance by ID ${groupID} and date ${date}`);
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function updateTrainingssession(groupID, date, body) {
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join("/"), {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		})
	);
}

//WARNING Wird nicht benutzt. --> Kann gelöscht werden wenn kein Fehler entsteht. API Endpoint ist deaktiviert!!
// async function addTrainingssession(groupID, body) {
//   await watchForRedirects((await fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID].join('/'), {
//     method: 'PATCH',
//     body: JSON.stringify(body),
//     headers: { 'Content-type': 'application/json; charset=UTF-8' },
//     credentials: 'include',
//     mode: 'cors'
//   })))
// }

//WARNING Wird nicht benutzt. --> Kann gelöscht werden wenn kein Fehler entsteht. API Endpoint ist deaktiviert!!
// async function deleteTrainingssession(groupID, date) {
//   await watchForRedirects((await fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'), {
//     method: 'DELETE',
//     headers: { 'Content-type': 'application/json; charset=UTF-8' },
//     credentials: 'include',
//     mode: 'cors'
//   })))
// }

async function fetchAttendanceByDateRange(groupID, startdate, enddate) {
	return await watchForRedirects(
		fetch(
			[import.meta.env.VITE_API_URL, "attendance/getFormattedList", groupID, getShortenedJSONDate(startdate), getShortenedJSONDate(enddate)].join(
				"/"
			),
			{
				method: "GET",
				credentials: "include",
				mode: "cors",
			}
		)
	);
}

async function fetchGroupInfo(groupID) {
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups", groupID, "getInfo"].join("/"), {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function updateMemberInGroup(groupID, body) {
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups", groupID, "updateMember"].join("/"), {
			method: "PATCH",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		})
	);
}

async function removeMemberFromGroup(groupID, memberID) {
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups", groupID, "removeMember", memberID].join("/"), {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		})
	);
}

/**
 * Authenticates the session and returns the user object
 * @returns {Object} {showPatchNotesDialog: Boolean, user: {username: String, _id: ObjectID}}
 */
async function authenticateSession() {
	return (
		await fetch([import.meta.env.VITE_API_URL, "authenticate"].join("/"), {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		})
	).json();
}

/**
 * Fetches the last patch notes from the API
 * @returns {Object} {patchNotes: String, version: String, date: Date, text: String, title: String}
 */
async function getLastPatchNotes() {
	return (
		await fetch([import.meta.env.VITE_API_URL, "patchNotes"].join("/"), {
			method: "GET",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		})
	).json();
}

/**
 * Fetches the data for a new invoice from the API
 * @param {String} groupIDs ObjectID of the groups
 * @param {Date}} startdate Startdate of the invoice
 * @param {Date} enddate Enddate of the invoice
 * @returns
 */
async function fetchDataForNewInvoice(groupIDs, startdate, enddate) {
	const res = await watchForRedirects(
		fetch(
			`${import.meta.env.VITE_API_URL}/invoice/create?startdate=${startdate.toJSON()}&enddate=${enddate.toJSON()}&groups[]=${groupIDs.join(
				"&groups[]="
			)}`,
			{
				method: "GET",
				credentials: "include",
				mode: "cors",
			}
		)
	);

	return res;
}

/**
 * Submits an invoice to the backend
 * @param {Object} body
 * @returns
 */
async function sendInvoice(body) {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/invoice/submit`, {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}),
		{ raw: true }
	);
}

async function getNotifications() {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function setNotificationAsRead(notificationID) {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/read?id=${notificationID}`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function setAllNotificationsAsRead() {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/readAll`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function deleteNotification(notificationID) {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/delete?id=${notificationID}`, {
			method: "DELETE",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function deleteAllNotifications() {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/deleteAll`, {
			method: "DELETE",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function setNotificationAsUnread(notificationID) {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/unread?id=${notificationID}`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function setAllNotificationsAsUnread() {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/unreadAll`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function deleteManyNotifications(notificationIDs){
	let ids = notificationIDs.join("&ids[]=");

	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/deleteMany?ids[]=${ids}`, {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(notificationIDs),
			credentials: "include",
			mode: "cors",
		})
	);
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
	fetchDataForNewInvoice,
	sendInvoice,
	getNotifications,
	setNotificationAsRead,
	setAllNotificationsAsRead,
	setNotificationAsUnread,
	setAllNotificationsAsUnread,
	deleteNotification,
	deleteAllNotifications,
	deleteManyNotifications
};
