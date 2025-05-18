import * as admin from "firebase-admin";

admin.initializeApp();

export {createUser} from "./auth/createUser";
export {generateUploadUrl} from "./storage/generateUploadUrl";
