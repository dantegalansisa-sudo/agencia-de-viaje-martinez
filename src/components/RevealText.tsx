import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode, type ElementType } from 'react';

interface RevealTextProps {
  children: ReactNode;
  tag?: ElementType;
  className?: string;
  delay?: number;
}

export default function RevealText({
  children,
  tag: Tag = 'div',
  className = '',
  delay = 0,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const MotionTag = motion.create(Tag as 'div');

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <MotionTag
        className={className}
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </MotionTag>
    </div>
  );
}
