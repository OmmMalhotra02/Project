import {v2 as cloudinary} from 'cloudinary'

const uploadOnCloudinary = (fileBuffer, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return resolve(null);

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

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

        // console.log("Deletion result:", result);

        if (result.result === "ok") {
            // console.log(`Deleted ${resourceType}: ${publicId}`);
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