'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgenteRedirectPage() {
  const params = useParams();
  const router = useRouter();
  useEffect(() => {
    router.replace('/agent/' + params.slug);
  }, [params.slug, router]);
  return null;
}