import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>We sent a verification link to your email address</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-charcoal/70">
          Click the link in the email to verify your account and get started with NatureScripts.
        </p>

        <div className="pt-4">
          <p className="text-xs text-charcoal/60 mb-3">Didn&apos;t receive the email?</p>
          <Button variant="outline" size="sm" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Resend Verification Email
          </Button>
        </div>

        <p className="text-xs text-charcoal/60 pt-4">
          Make sure to check your spam folder. The email should arrive within a few minutes.
        </p>
      </CardContent>
    </Card>
  );
}
