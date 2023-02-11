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
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups"].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function fetchGroup(groupID) {
	if(!groupID) throw new Error("No groupID provided")
	if(typeof groupID === "undefined") throw new Error("groupID must be defined")
	if(typeof groupID !== "string") throw new Error("notificationID must be a string")

	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups", groupID].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function fetchAttendance(groupID) {
	if(!groupID) throw new Error("No groupID provided")
	if(typeof groupID === "undefined") throw new Error("groupID must be defined")
	if(typeof groupID !== "string") throw new Error("notificationID must be a string")

	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function fetchAttendanceByDate(groupID, date) {
	if(!groupID) throw new Error("No groupID provided")
	if(typeof groupID === "undefined") throw new Error("groupID must be defined")
	if(typeof groupID !== "string") throw new Error("notificationID must be a string")

	if(!date) throw new Error("No date provided")
	if(typeof date === "undefined") throw new Error("date must be defined")

	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function updateTrainingssession(groupID, date, body) {
	if(!groupID) throw new Error("No groupID provided")
	if(typeof groupID === "undefined") throw new Error("groupID must be defined")
	if(typeof groupID !== "string") throw new Error("notificationID must be a string")

	if(!date) throw new Error("No date provided")
	if(typeof date === "undefined") throw new Error("date must be defined")
	
	if(typeof body === "undefined") throw new Error("body must be defined")
	if(Object.keys(body).length === 0) throw new Error("body must not be empty")

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
	if(!groupID) throw new Error("No groupID provided")
	if(typeof groupID === "undefined") throw new Error("groupID must be defined")
	if(typeof groupID !== "string") throw new Error("notificationID must be a string")

	if(!startdate) throw new Error("No startdate provided")
	if(typeof startdate === "undefined") throw new Error("startdate must be defined")

	if(!enddate) throw new Error("No enddate provided")
	if(typeof enddate === "undefined") throw new Error("enddate must be defined")

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
	if(!groupID) throw new Error("No groupID provided")
	if(typeof groupID === "undefined") throw new Error("groupID must be defined")
	if(typeof groupID !== "string") throw new Error("notificationID must be a string")

	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups", groupID, "getInfo"].join("/"), {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function updateMemberInGroup(groupID, body) {
	if(!groupID) throw new Error("No groupID provided")
	if(typeof groupID === "undefined") throw new Error("groupID must be defined")
	if(typeof groupID !== "string") throw new Error("notificationID must be a string")
	
	if(typeof body === "undefined") throw new Error("body must be defined")
	if(Object.keys(body).length === 0) throw new Error("body must not be empty")

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
	if(!groupID) throw new Error("No groupID provided")
	if(typeof groupID === "undefined") throw new Error("groupID must be defined")
	if(typeof groupID !== "string") throw new Error("notificationID must be a string")

	if(!memberID) throw new Error("No memberID provided")
	if(typeof memberID === "undefined") throw new Error("memberID must be defined")
	if(typeof memberID !== "string") throw new Error("notificationID must be a string")

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
	if(typeof groupIDs === "undefined") throw new Error("groupIDs must be defined")
	if(groupIDs.length === 0) throw new Error("No groupIDs provided")
	
	if(!startdate) throw new Error("No startdate provided")
	if(typeof startdate === "undefined") throw new Error("startdate must be defined")

	if(!enddate) throw new Error("No enddate provided")
	if(typeof enddate === "undefined") throw new Error("enddate must be defined")

	const res = await watchForRedirects(
		fetch(
			`${import.meta.env.VITE_API_URL}/invoice/getDatasetForNewInvoice?startdate=${startdate.toJSON()}&enddate=${enddate.toJSON()}&groups[]=${groupIDs.join(
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
	if(typeof body === "undefined") throw new Error("body must be defined")
	if(Object.keys(body).length === 0) throw new Error("body must not be empty")

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
	if(!notificationID) throw new Error("No notificationID provided")
	if(typeof notificationID === "undefined") throw new Error("notificationID must be defined")
	if(typeof notificationID !== "string") throw new Error("notificationID must be a string")

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
	if(!notificationID) throw new Error("No notificationID provided")
	if(typeof notificationID === "undefined") throw new Error("notificationID must be defined")
	if(typeof notificationID !== "string") throw new Error("notificationID must be a string")

	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/delete?id=${notificationID}`, {
			method: "DELETE",
			credentials: "include",
			mode: "cors",
		}), { raw: true }
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
	if(!notificationID) throw new Error("No notificationID provided")
	if(typeof notificationID === "undefined") throw new Error("notificationID must be defined")
	if(typeof notificationID !== "string") throw new Error("notificationID must be a string")

	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/unread?id=${notificationID}`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		}), { raw: true }
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
	if(typeof notificationIDs === "undefined") throw new Error("notificationIDs must be defined")
	if(notificationIDs.length === 0) throw new Error("No notificationIDs provided")

	let ids = notificationIDs.join("&ids[]=");

	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/deleteMany?ids[]=${ids}`, {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(notificationIDs),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);
}

async function setManyNotificationsAsRead(notificationIDs) {
	if(typeof notificationIDs === "undefined") throw new Error("notificationIDs must be defined")

	if(notificationIDs.length === 0) throw new Error("No notificationIDs provided");

	let ids = notificationIDs.join("&ids[]=");

	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/readMany?ids[]=${ids}`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);
}

async function getAllAssignedInvoices() {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/invoice/assigned`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function getInvoiceById(id) {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/invoice/${id}`, {
			method: "GET",
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
	deleteManyNotifications,
	setManyNotificationsAsRead,
	getAllAssignedInvoices,
	getInvoiceById
};
