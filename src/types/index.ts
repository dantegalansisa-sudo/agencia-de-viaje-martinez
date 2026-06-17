export interface WeeklyOffer {
  id?: string;
  route: string;
  code: string;
  price: string;
  tag: string | null;
  order: number;
  active: boolean;
}

export interface Flight {
  id?: string;
  to: string;
  city: string;
  price: string;
  country: string;
  order: number;
  active: boolean;
}

export interface Hotel {
  id?: string;
  name: string;
  city: string;
  price: string;
  stars: number;
  country: string;
  order: number;
  active: boolean;
}

export interface Package {
  id?: string;
  resort: string;
  detail: string;
  price: string;
  zone: 'este' | 'norte';
  order: number;
  active: boolean;
}

export interface Destination {
  id?: string;
  city: string;
  country: string;
  code: string;
  price: string;
  imageUrl: string;
  tag: string | null;
  category: 'international' | 'national';
  order: number;
  active: boolean;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  instagram: string;
  isLeadership: boolean;
  leadershipGroupImage: string | null;
  order: number;
  active: boolean;
}

export interface ServiceItem {
  id?: string;
  icon: string;
  title: string;
  desc: string;
  order: number;
  active: boolean;
}

export interface GalleryImage {
  id?: string;
  imageUrl: string;
  alt: string;
  order: number;
  active: boolean;
}

export interface Testimonial {
  id?: string;
  name: string;
  initials: string;
  location: string;
  destination: string;
  text: string;
  rating: number;
  order: number;
  active: boolean;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export interface HeroConfig {
  title: string;
  titleAccent: string;
  subtitle: string;
  badgeText: string;
  videoUrl: string;
  trustItems: string[];
}

export interface ContactConfig {
  whatsappPrimary: string;
  whatsappSecondary: string;
  email: string;
  address: string;
  instagram: string;
}

export interface PopularRoute {
  id?: string;
  from: string;
  to: string;
  label: string;
  order: number;
  active: boolean;
}
