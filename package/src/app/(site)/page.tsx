import { homeMetadata } from '@/lib/page-metadata';
import HomePageClient from '../page';

export const metadata = homeMetadata

export default function HomePage() {
  return <HomePageClient />
}