import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useVideos } from '../../hooks/useVideos';
import styles from '../../styles/video.module.css';
import Link from 'next/link';

export default function VideoPage() {
  const router = useRouter();
  const { videoId } = router.query;
  const { getVideoById, fetchVideos, loading, error } = useVideos();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    if (videoId) {
      const fetchVideoAndRelated = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          const fetchedVideo = await getVideoById(videoId, token);
          setVideo(fetchedVideo);
          if (fetchedVideo && fetchedVideo.categoryId) {
            const fetchedRelatedVideos = await fetchVideos(token, fetchedVideo.categoryId, '');
            // 現在のビデオを除外
            setRelatedVideos(fetchedRelatedVideos.filter(v => v.youtubeVideoId !== videoId));
          }
        }
      };
      fetchVideoAndRelated();
    }
  }, [videoId, getVideoById, fetchVideos]);

  if (loading) return <p>動画を読み込み中...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (!video) return <p>動画が見つかりません。</p>;

  return (
    <div className={styles.container}>
      <Link href="/">
        <button className={styles.backButton}>← 戻る</button>
      </Link>

      <div className={styles.videoPlayerWrapper}>
        <iframe
          className={styles.videoPlayer}
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        ></iframe>
      </div>

      <h1 className={styles.videoTitle}>{video.title}</h1>
      <p className={styles.channelName}>{video.channelTitle}</p>
      <p className={styles.publishedAt}>投稿日時: {new Date(video.publishedAt).toLocaleDateString()}</p>

      <h2 className={styles.relatedVideosTitle}>関連動画</h2>
      <div className={styles.relatedVideosGrid}>
        {relatedVideos.length > 0 ? (
          relatedVideos.map((relatedVideo) => (
            <Link key={relatedVideo.youtubeVideoId} href={`/video/${relatedVideo.youtubeVideoId}`}>
              <div className={styles.videoCard}>
                <img src={relatedVideo.thumbnailUrl} alt={relatedVideo.title} />
                <h4>{relatedVideo.title}</h4>
                <p>{relatedVideo.channelTitle}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>関連動画はありません。</p>
        )}
      </div>
    </div>
  );
}
