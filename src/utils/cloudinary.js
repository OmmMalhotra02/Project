import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: 'auto'})

        // console.log("response on uploading file in cloudinary ", response);
        
        // console.log("File uploaded on cloudinary ", response.url);
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
    } finally {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
}

const deleteOldAsset = async (fileUrl) => {
    try {
        if (!fileUrl) return false;

        // Extract filename
        const parts = fileUrl.split('/');
        const filename = parts.pop(); // filename.ext
        const publicId = filename.split('.')[0]; // filename only

        // Detect resource type
        const resourceType = fileUrl.includes("/video/") ? "video" : "image";

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        console.log("Deletion result:", result);

        if (result.result === "ok") {
            console.log(`Deleted ${resourceType}: ${publicId}`);
            return true;
        }

        console.error(`Failed to delete ${resourceType}: ${publicId}`);
        return false;

    } catch (error) {
        console.error("Cloudinary deletion failed:", error);
        return false;
    }
};


export {uploadOnCloudinary, deleteOldAsset}