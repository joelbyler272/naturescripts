import Link from 'next/link';
import { routes } from '@/lib/constants/routes';
import { ArrowLeft } from 'lucide-react';

export default function LibraryArticlePage({ params }: { params: { slug: string } }) {
  // In a real app, fetch article by slug
  const article = {
    title: 'Understanding Adaptogens: A Complete Guide',
    category: 'Health Guides',
    readTime: '8 min read',
    content: `
      Adaptogens are a unique class of herbs that help the body adapt to stress and maintain balance.
      These remarkable plants have been used for centuries in traditional medicine systems around the world.
      
      In this guide, we'll explore what makes adaptogens special, how they work, and how to incorporate
      them into your wellness routine.
    `,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={routes.library}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Library
      </Link>

      <article>
        <header className="mb-8">
          <p className="text-sm text-accent font-medium mb-2">{article.category}</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">{article.title}</h1>
          <p className="text-muted-foreground">{article.readTime}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {article.content}
          </p>
          
          <div className="mt-8 p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is placeholder content. In the full version,
              this page would display the complete article content fetched from a database.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
