import { AttachmentType } from "@/app/api/chat/route";
import { cloudinary } from "../cloudinary_config"; // your config path
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

type UploadResponse =
  | { success: true; result: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUrl: string,
  filename: string,
  msg_id: string,
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUrl, {
        public_id: msg_id + "/" + filename,
        resource_type: "auto",
        filename_override: filename.replace(/\.[^/.]+$/, ""),
        folder: "gpt-files",
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

const bulkUploadToCloudinary = (
  fileUrls: AttachmentType[],
  msg_id: string,
): Promise<UploadResponse[]> => {
  return Promise.all(
    fileUrls.map(({ url, filename }) =>
      uploadToCloudinary(url, filename, msg_id),
    ),
  );
};
export { uploadToCloudinary, bulkUploadToCloudinary };
