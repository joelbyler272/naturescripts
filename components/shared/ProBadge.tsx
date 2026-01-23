import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

export function ProBadge() {
  return (
    <Badge variant="secondary" className="bg-earth/10 text-earth border-earth/20">
      <Crown className="w-3 h-3 mr-1" />
      Pro
    </Badge>
  );
}
