/**
 * create a downloadable file
 * @param filename The name of the file
 * @param data The data
 * @param contentType The content-type, default is `application/json`
 */
export function download(filename: string, data: string, contentType = "application/json") {
  const element = document.createElement("a");
  element.setAttribute("href", `data:${contentType};charset=utf-8,${encodeURIComponent(data)}`);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
