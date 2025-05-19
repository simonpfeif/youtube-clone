import {getFunctions, httpsCallable} from "firebase/functions"
import {app} from "./firebase"

const functions = getFunctions(app, "us-central1");

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");

export async function uploadVideo(file: File) {

    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    })

    // Upload the file via the signed URL
    const uploadResult = await fetch(response?.data?.url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type
        }
    });
    return uploadResult;
}
