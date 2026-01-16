import GalleryGrid from '@/components/GalleryGrid';
import '@/styles/Gallery.css';

export const metadata = {
  title: 'Gallery',
};

export default function GalleryPage() {
  return (
    <div className="gallery-page">
      <GalleryGrid />
    </div>
  );
}