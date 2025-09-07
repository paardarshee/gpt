// At the top of the file (ESM import instead of require)
import { randomUUID } from "crypto";

export function createUUID(): string {
	if (
		typeof window !== "undefined" &&
		window.crypto &&
		window.crypto.getRandomValues
	) {
		// Browser environment
		const bytes = window.crypto.getRandomValues(new Uint8Array(16));

		// RFC4122 v4
		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

		const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0"));

		return [
			hex.slice(0, 4).join(""),
			hex.slice(4, 6).join(""),
			hex.slice(6, 8).join(""),
			hex.slice(8, 10).join(""),
			hex.slice(10, 16).join(""),
		].join("-");
	}

	// Node.js environment
	return randomUUID();
}
