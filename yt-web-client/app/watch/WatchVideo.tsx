'use client';

import { useSearchParams } from 'next/navigation';

export default function WatchVideo() {
  const videoPrefix = 'https://storage.googleapis.com/simonpfeif-yt-processed-videos/';
  const videoSrc = useSearchParams().get('v');

  if (!videoSrc) {
    return <div>Missing video ID</div>;
  }

  return (
    <video controls src={videoPrefix + videoSrc} width="100%" />
  );
}
