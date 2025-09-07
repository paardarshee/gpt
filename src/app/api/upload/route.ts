import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/uploads/cloudinary";
import { Attachment } from "@/lib/models/Attachment";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
	try {
		await connectDB();
		const formData = await req.formData();
		const files = formData.getAll("file") as File[];

		// Upload to Cloudinary
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

				const result = await uploadToCloudinary(fileUri, uniqueFileName);

				return {
					success: result.success,
					secure_url: result.success ? result.result?.secure_url : null,
					file,
				};
			})
		);

		// Build attachments from original File + Cloudinary URL
		const attachmentsData = uploadResults
			.filter((r) => r.success && r.secure_url)
			.map((r) => {
				const fileType = r.file.type.startsWith("image/")
					? "image"
					: "document";
				return {
					url: r.secure_url,
					filename: r.file.name,
					fileType,
					size: r.file.size,
				};
			});

		// Save in DB
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
