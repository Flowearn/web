
import request from "@/utils/request";

export async function sendGroupMsg(data) {
  return request.post("/iim/group/send", {
    data,
  });
}

export async function queryGroupMembers(id) {
  return request.get(`/iim/group/members/${id}`);
}

export async function pullOfflineMessage(data) {
  return request.get("/iim/group/pullOfflineMessage", {
    data,
  });
}

export async function uploadImage(data) {
  return request.post("/iim/image/upload", {
    data,
  });
}

export async function recallMsg(id) {
  return request.delete(`/iim/group/recall/${id}`);
}


