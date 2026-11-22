const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

export function hasImgbbKey() {
  return Boolean(IMGBB_KEY);
}

export async function uploadToImgbb(file: File) {
  if (!IMGBB_KEY) {
    throw new Error("Add NEXT_PUBLIC_IMGBB_API_KEY to enable image upload.");
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", IMGBB_KEY);

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData
  });
  const data = await response.json() as {
    success?: boolean;
    data?: { url?: string; display_url?: string };
    error?: { message?: string };
  };

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Image upload failed.");
  }

  const url = data.data?.display_url || data.data?.url;
  if (!url) throw new Error("imgbb did not return an image URL.");
  return url;
}
