import {httpsCallable} from "firebase/functions"
import { functions } from './firebase';

// const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
// const getVideosFunction = httpsCallable(functions, "getVideos");
const getVideosFunction = httpsCallable<undefined, Video[]>(functions, "getVideos");
const generateUploadUrl = httpsCallable<{ fileExtension: string }, { url: string }>(functions, "generateUploadUrl");

export async function uploadVideo(file: File) {
    const response = await generateUploadUrl({
        fileExtension: file.name.split('.').pop() || ''
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

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

export async function getVideos() {
    const response = await getVideosFunction();
    return response.data;
}