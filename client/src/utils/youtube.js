// utils/youtube.js
export const getEmbedUrl = (url) => {
    if (url.includes("embed")) return url;
    const id = url.split("v=")[1];
    return `https://www.youtube.com/embed/${id}`;
};
