import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  // Simple check for youtube embeds. In a real app we'd parse it more robustly.
  const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  
  let embedUrl = videoUrl;
  if (isYoutube && videoUrl.includes('watch?v=')) {
    embedUrl = videoUrl.replace('watch?v=', 'embed/');
  }

  return (
    <div className="aspect-w-16 aspect-h-9 w-full bg-black rounded-lg overflow-hidden">
      {isYoutube ? (
        <iframe
          src={embedUrl}
          className="w-full h-[500px]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video lesson"
        ></iframe>
      ) : (
        <div className="flex items-center justify-center h-[500px] text-white">
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
            Watch video externally
          </a>
        </div>
      )}
    </div>
  );
};
