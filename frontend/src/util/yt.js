export function getIdFromYoutubeUrl(url) {
    // returns the YT video ID from a valid YT url, or null if you're a dumbass
    const match = url.match(/^https?:\/\/(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?v=)(.{11})$/);
    return match[1];
}

export function getYoutubeThumbnail(url) {
    const id = getIdFromYoutubeUrl(url)
    if(id !== null) {
        return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
    }
    return null;
}