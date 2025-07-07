import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useVideos } from '../../hooks/useVideos';
import styles from '../../styles/video.module.css';
import Link from 'next/link';

export default function VideoPage() {
  const router = useRouter();
  const { videoId } = router.query;
  const { getVideoById, loading, error } = useVideos();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (videoId) {
      const fetchVideo = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          const fetchedVideo = await getVideoById(videoId, token);
          setVideo(fetchedVideo);
        }
      };
      fetchVideo();
    }
  }, [videoId, getVideoById]);

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
        {/* TODO: 同じチャンネルの関連動画を表示 */}
        <p>関連動画は現在表示できません。</p>
      </div>
    </div>
  );
}
