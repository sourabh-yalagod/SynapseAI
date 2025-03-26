import { saveAs } from "file-saver";
export const handleDownload = (url: string, name: string = "Download.pdf") => {
  console.log("🚀 ~ handleDownload ~ url:", url);
  if (!url) return;
  saveAs(url, name);
};
