import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useCollection } from '../hooks/useCollection';
import type { GalleryImage } from '../types';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './GallerySection.css';

const fallbackImages = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=500&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80',
  'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&q=80',
];

export default function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { data: fbGallery } = useCollection<GalleryImage>('gallery');
  const images = fbGallery.length > 0 ? fbGallery.map(g => g.imageUrl) : fallbackImages;

  return (
    <section className="gallery" ref={ref}>
      <div className="section-container">
        <span className="section-eyebrow">Galería</span>
        <RevealText tag="h2" className="section-title">
          Momentos Que Inspiran
        </RevealText>
        <p className="section-subtitle">
          Sé el próximo en compartir tu experiencia de viaje con nosotros.
        </p>

        <motion.div
          className="gallery__grid"
          variants={staggerChildren(0.08)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {images.map((src, i) => (
            <motion.div
              className="gallery__item"
              key={i}
              variants={fadeInUp}
            >
              <img src={src} alt={`Viaje ${i + 1}`} loading="lazy" />
            </motion.div>
          ))}
          <motion.div className="gallery__item gallery__item--cta" variants={fadeInUp}>
            <div className="gallery__cta-content">
              <span className="gallery__cta-icon">📸</span>
              <p>¿Viajaste con nosotros?</p>
              <MagneticButton
                href="https://instagram.com/agenciadeviajesmartinez"
                className="btn-primary"
                target="_blank"
              >
                @agenciadeviajesmartinez
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
