import { bulkUploadToCloudinary } from "@/lib/uploads/cloudinary";
import { Attachment } from "@/lib/models/Attachment";

export async function processAttachmentsAndStore(attachments, msgId) {
  if (!attachments || attachments.length === 0) return;
  // Keep the same behavior: run async, but expose as a function so route is not cluttered
  try {
    const uploadResults = await bulkUploadToCloudinary(attachments, msgId);
    const attachmentsData = uploadResults
      .filter((r) => r.success)
      .map((r) => ({
        url: r.result.secure_url,
        filename: r.result.original_filename + "." + r.result.format,
        fileType: r.result.resource_type,
        size: r.result.bytes,
        msgId,
      }));
    if (attachmentsData.length > 0) {
      await Attachment.insertMany(attachmentsData);
    }
  } catch (err) {
    // Logging only — do not change existing behaviour
    console.error("Attachment background upload failed:", err);
  }
}
