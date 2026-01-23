import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/lib/constants/routes';
import { BookOpen, FlaskConical, Leaf, TrendingUp } from 'lucide-react';

// Mock library categories
const categories = [
  {
    title: 'Health Guides',
    description: 'Comprehensive guides on natural health topics',
    icon: BookOpen,
    href: routes.libraryGuides,
    count: 12,
  },
  {
    title: 'Research',
    description: 'Scientific studies and clinical research',
    icon: FlaskConical,
    href: routes.libraryResearch,
    count: 24,
  },
  {
    title: 'Remedy Profiles',
    description: 'In-depth profiles of natural remedies',
    icon: Leaf,
    href: routes.remedies,
    count: 50,
  },
];

// Mock featured articles
const featuredArticles = [
  {
    title: 'Understanding Adaptogens: A Complete Guide',
    category: 'Health Guides',
    readTime: '8 min read',
    slug: 'understanding-adaptogens',
  },
  {
    title: 'The Science Behind Herbal Medicine',
    category: 'Research',
    readTime: '12 min read',
    slug: 'science-herbal-medicine',
  },
  {
    title: 'Natural Support for Stress and Anxiety',
    category: 'Health Guides',
    readTime: '6 min read',
    slug: 'natural-stress-support',
  },
  {
    title: 'Digestive Health: A Naturopathic Approach',
    category: 'Health Guides',
    readTime: '10 min read',
    slug: 'digestive-health-naturopathic',
  },
];

export default function LibraryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Library</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore our collection of health guides, research articles, and evidence-based information on natural remedies and wellness.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {categories.map((category) => (
          <Link key={category.title} href={category.href}>
            <Card className="h-full hover:border-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <category.icon className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {category.title}
                  <Badge variant="secondary">{category.count}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Featured Articles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Articles</h2>
          <Link href={routes.blog} className="text-accent hover:text-accent/80 text-sm font-medium">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map((article) => (
            <Link key={article.slug} href={`/library/${article.slug}`}>
              <Card className="h-full hover:border-accent/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <Badge variant="outline" className="mb-3">{article.category}</Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{article.readTime}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
