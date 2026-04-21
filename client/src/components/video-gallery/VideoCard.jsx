import { getEmbedUrl } from "../../utils/youtube";

const VideoCard = ({ video }) => {
    // Convert YouTube URL to embed format if needed
    const embedUrl = getEmbedUrl(video.videoUrl);

    return (
        <div className="bg-white rounded-xl     transition overflow-hidden p-0">
            <div className="aspect-video">
                <iframe
                    src={embedUrl}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            <div className="p-4">
                <h4 className="text-sm md:text-base font-medium text-black leading-snug">
                    {video.title}
                </h4>
            </div>
        </div>
    );
};

export default VideoCard;
