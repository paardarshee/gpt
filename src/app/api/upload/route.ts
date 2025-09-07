import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/uploads/cloudinary";
import { Attachment } from "@/lib/models/Attachment";
import { connectDB } from "@/lib/db";
export async function POST(req: NextRequest) {
	// your auth check here if required
	try {
		await connectDB();
		const formData = await req.formData();
		const files = formData.getAll("file") as File[];

		const uploadResults = await Promise.all(
			files.map(async (file) => {
				const fileBuffer = await file.arrayBuffer();
				const mimeType = file.type;
				const encoding = "base64";
				const base64Data = Buffer.from(fileBuffer).toString("base64");
				const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

				const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
				const uniqueFileName = `${file.name.replace(
					/\.[^/.]+$/,
					""
				)}_${timestamp}${file.name.match(/\.[^/.]+$/) || ""}`;
				return uploadToCloudinary(fileUri, uniqueFileName);
			})
		);

		type UploadResult = {
			success: boolean;
			result?: {
				secure_url?: string;
				filename?: string;
				mimeType?: string;
				size?: number;
			};
		};

		const successfulUploads = (uploadResults as UploadResult[]).filter(
			(r) =>
				r && r.success && r.result && typeof r.result.secure_url === "string"
		);
		const attachmentsData = successfulUploads.map((upload) => ({
			url: upload.result?.secure_url,
			filename: upload.result?.filename,
			mimeType: upload.result?.mimeType,
			size: upload.result?.size,
		}));

		const attachments = await Attachment.insertMany(attachmentsData);

		if (attachments.length > 0) {
			return NextResponse.json({
				message: "success",
				attachments,
			});
		} else {
			return NextResponse.json(
				{ message: "failure", error: "No attachments created" },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ message: "failure", error: "Upload failed" },
			{ status: 500 }
		);
	}
}
