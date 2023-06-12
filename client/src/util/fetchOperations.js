import router from "@/router/index";
import { getShortenedJSONDate } from "./formatter.js";
import { useAuthStore } from "@/store/authStore.js";

/**
 *
 * @param {Promise<Response>} res
 * @returns
 */
async function watchForRedirects(res, { raw = false } = {}) {
	await res.catch( (err) => {
		console.log("Error while fetching: ", err);
		router.push("/server-down")
	})

	if ((await res).status === 401 && await (await res).text() === "Logout") {
		console.log("Server responded with 401, redirecting to logout");
		await useAuthStore().logOut();
		console.log("Logged out");
		router.push("/login");
		return undefined;
	} else if (raw) {
		return await res;
	} else {
		return (await res).json();
	}
}





//INFO Fetch Operations zu /attendance

async function fetchAttendance(groupID) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function fetchAttendanceByDate(groupID, date) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	if (!date) throw new Error("No date provided")
	if (typeof date === "undefined") throw new Error("date must be defined")

	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function updateTrainingssession(groupID, date, body) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	if (!date) throw new Error("No date provided")
	if (typeof date === "undefined") throw new Error("date must be defined")

	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

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

async function fetchAttendanceByDateRange(groupID, startdate, enddate) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	if (!startdate) throw new Error("No startdate provided")
	if (typeof startdate === "undefined") throw new Error("startdate must be defined")

	if (!enddate) throw new Error("No enddate provided")
	if (typeof enddate === "undefined") throw new Error("enddate must be defined")

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





//INFO Fetch Operations /departments
async function getAllDepartments() {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/departments`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}





//INFO Fetch Operations zu /group oder /groups

async function fetchGroups() {
	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups", "assigned"].join("/"), {
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, status: res.status, body: res.status === 204 ? undefined : await res.json() }
}

async function getAllGroups() {
	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups"].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	)
}

async function createNewGroup(body) {
	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups"].join("/"), {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.status === 201, body: res.status === 204 ? undefined : await res.json() }
}

async function deleteGroup(groupID) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID].join("/"), {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function updateGroup(groupID, body) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID].join("/"), {
			method: "PATCH",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function fetchGroup(groupID) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID].join("/"), {
			credentials: "include",
			mode: "cors",
		})
	);
}

async function getGroupName(groupID) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("groupID must be a string")

	return await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "groups", groupID, "getGroupName"].join("/"), {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}

async function updateParticipantInGroup(groupID, memberID, body) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	if (!memberID) throw new Error("No memberID provided")
	if (typeof memberID === "undefined") throw new Error("memberID must be defined")
	if (typeof memberID !== "string") throw new Error("notificationID must be a string")

	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID, "member", memberID].join("/"), {
			method: "PATCH",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function removeParticipantFromGroup(groupID, memberID) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	if (!memberID) throw new Error("No memberID provided")
	if (typeof memberID === "undefined") throw new Error("memberID must be defined")
	if (typeof memberID !== "string") throw new Error("notificationID must be a string")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID, "member", memberID].join("/"), {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.ok ? undefined : await res.json() }
}

async function updateTrainerInGroup(groupID, userID, body) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	if (!userID) throw new Error("No memberID provided")
	if (typeof userID === "undefined") throw new Error("memberID must be defined")
	if (typeof userID !== "string") throw new Error("notificationID must be a string")

	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID, "trainer", userID].join("/"), {
			method: "PATCH",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function removeTrainerFromGroup(groupID, userID) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")
	if (typeof groupID !== "string") throw new Error("notificationID must be a string")

	if (!userID) throw new Error("No memberID provided")
	if (typeof userID === "undefined") throw new Error("memberID must be defined")
	if (typeof userID !== "string") throw new Error("notificationID must be a string")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID, "trainer", userID].join("/"), {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function addMultipleMembersToGroup(groupID, members) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")

	if (typeof members === "undefined") throw new Error("members must be defined")
	if (members.length === 0) throw new Error("members must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID, "multipleMembers"].join("/"), {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(members),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function addMultipleTrainerToGroup(groupID, trainers) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")

	if (typeof trainers === "undefined") throw new Error("trainers must be defined")
	if (trainers.length === 0) throw new Error("trainers must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID, "multipleTrainer"].join("/"), {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(trainers),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function addMemberToGroup(groupID, member) {
	if (!groupID) throw new Error("No groupID provided")
	if (typeof groupID === "undefined") throw new Error("groupID must be defined")

	if (typeof member === "undefined") throw new Error("member must be defined")
	if (Object.keys(member).length === 0) throw new Error("member must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "group", groupID, "member"].join("/"), {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(member),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }

}


//INFO Fetch Operations zu /invoice

/**
 * Fetches the data for a new invoice from the API
 * @param {String} groupIDs ObjectID of the groups
 * @param {Date}} startdate Startdate of the invoice
 * @param {Date} enddate Enddate of the invoice
 * @returns
 */
async function fetchDataForNewInvoice(groupIDs, startdate, enddate) {
	if (typeof groupIDs === "undefined") throw new Error("groupIDs must be defined")
	if (groupIDs.length === 0) throw new Error("No groupIDs provided")

	if (!startdate) throw new Error("No startdate provided")
	if (typeof startdate === "undefined") throw new Error("startdate must be defined")

	if (!enddate) throw new Error("No enddate provided")
	if (typeof enddate === "undefined") throw new Error("enddate must be defined")

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
	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

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

async function approveInvoice(id) {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/invoice/approve/${id}`, {
			method: "POST",
			credentials: "include",
			mode: "cors",
		}),
		{ raw: true }
	);
}

async function rejectInvoice(id) {
	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/invoice/reject/${id}`, {
			method: "POST",
			credentials: "include",
			mode: "cors",
		}),
		{ raw: true }
	);
}

async function getAllInvoicesInYear(year) {
	if (typeof year === "undefined") throw new Error("year must be defined")

	if (typeof year === Number) throw new Error("Year must be a number");

	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/invoice/getAllInYear/${year}`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		})
	);
}





//INFO Fetch Operations zu /issue

async function getIssues() {
	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/issues`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, status: res.status, body: res.status === 204 ? undefined : await res.json() }
}

async function resolveIssue(issueID, action) {
	if (!issueID) throw new Error("No issueID provided")
	if (typeof issueID === "undefined") throw new Error("issueID must be defined")

	if (!action) throw new Error("No action provided")
	if (typeof action === "undefined") throw new Error("action must be defined")

	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/issues/${issueID}/resolve?action=${action}`, {
			method: "POST",
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.ok ? undefined : await res.json() }
}



//INFO Fetch Operations zu /member oder /members

async function createNewMember(body) {
	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "member"].join("/"), {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.status === 201, body: res.status === 204 ? undefined : await res.json() }
}

async function deleteMember(memberId) {
	if (!memberId) throw new Error("No memberId provided")
	if (typeof memberId === "undefined") throw new Error("memberId must be defined")
	if (typeof memberId !== "string") throw new Error("memberId must be a string")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "member", memberId].join("/"), {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function updateMember(body) {
	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch([import.meta.env.VITE_API_URL, "member", body._id].join("/"), {
			method: "PATCH",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function getAllMembers() {
	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/members`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	)
	if (res.ok) {
		return res.json()
	} else {
		return []
	}
}





//INFO Fetch Operations zu /notification

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
	if (!notificationID) throw new Error("No notificationID provided")
	if (typeof notificationID === "undefined") throw new Error("notificationID must be defined")
	if (typeof notificationID !== "string") throw new Error("notificationID must be a string")

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
	if (!notificationID) throw new Error("No notificationID provided")
	if (typeof notificationID === "undefined") throw new Error("notificationID must be defined")
	if (typeof notificationID !== "string") throw new Error("notificationID must be a string")

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
	if (!notificationID) throw new Error("No notificationID provided")
	if (typeof notificationID === "undefined") throw new Error("notificationID must be defined")
	if (typeof notificationID !== "string") throw new Error("notificationID must be a string")

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

async function deleteManyNotifications(notificationIDs) {
	if (typeof notificationIDs === "undefined") throw new Error("notificationIDs must be defined")
	if (notificationIDs.length === 0) throw new Error("No notificationIDs provided")

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
	if (typeof notificationIDs === "undefined") throw new Error("notificationIDs must be defined")

	if (notificationIDs.length === 0) throw new Error("No notificationIDs provided");

	let ids = notificationIDs.join("&ids[]=");

	return await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/notification/readMany?ids[]=${ids}`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);
}





//INFO Fetch Operations zu /user oder /users

async function getAllUsers() {
	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/users`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	)
	if (res.ok) {
		return res.json()
	} else {
		return []
	}
}

async function createNewUser(body) {
	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/user`, {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.status === 201, body: res.status === 204 ? undefined : await res.json() }
}

async function updateUser(body) {
	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/user/${body._id}`, {
			method: "PATCH",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function deleteUser(userID) {
	if (!userID) throw new Error("No userID provided")
	if (typeof userID === "undefined") throw new Error("userID must be defined")

	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/user/${userID}`, {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function resendPassword(userID) {
	if (!userID) throw new Error("No userID provided")
	if (typeof userID === "undefined") throw new Error("userID must be defined")

	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/user/${userID}/resend-password`, {
			method: "GET",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function updateOwnUserData(body) {
	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/user/self`, {
			method: "PATCH",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.ok, body: res.status === 204 ? undefined : await res.json() }
}

async function changePassword(body) {
	if (typeof body === "undefined") throw new Error("body must be defined")
	if (Object.keys(body).length === 0) throw new Error("body must not be empty")

	const res = await watchForRedirects(
		fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
			method: "PATCH",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(body),
			credentials: "include",
			mode: "cors",
		}), { raw: true }
	);

	return { ok: res.status === 204, body: res.status === 204 ? undefined : await res.json() }
}

export {
	fetchAttendance,
	fetchAttendanceByDate,
	updateTrainingssession,
	fetchAttendanceByDateRange,
	fetchGroup,
	fetchGroups,
	getGroupName,
	updateParticipantInGroup,
	removeParticipantFromGroup,
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
	getInvoiceById,
	approveInvoice,
	rejectInvoice,
	getAllInvoicesInYear,
	getAllMembers,
	updateMember,
	createNewMember,
	deleteMember,
	createNewUser,
	getAllUsers,
	updateUser,
	deleteUser,
	resendPassword,
	getAllGroups,
	createNewGroup,
	deleteGroup,
	updateGroup,
	getAllDepartments,
	updateTrainerInGroup,
	removeTrainerFromGroup,
	addMultipleMembersToGroup,
	addMultipleTrainerToGroup,
	addMemberToGroup,
	getIssues,
	resolveIssue,
	updateOwnUserData,
	changePassword
};
