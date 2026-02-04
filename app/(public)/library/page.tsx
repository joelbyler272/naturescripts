import { BookOpen, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LibraryPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Library</h1>
        <p className="text-lg text-accent font-medium mb-2">Coming Soon</p>
        <p className="text-muted-foreground mb-8">
          We&apos;re building a comprehensive collection of health guides, herbal monographs, and research-backed articles to support your natural wellness journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/remedies">
            <Button variant="outline" className="w-full sm:w-auto">
              Browse Remedies
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90">
              Start a Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
