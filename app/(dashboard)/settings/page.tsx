'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_USER } from '@/lib/data/hardcoded';
import { User, CreditCard, Shield, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Settings</h1>
        <p className="text-charcoal/60">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 text-primary mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-charcoal">
                  First Name
                </label>
                <Input id="firstName" defaultValue={MOCK_USER.first_name} />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-charcoal">
                  Email
                </label>
                <Input id="email" type="email" defaultValue={MOCK_USER.email} disabled />
                <p className="text-xs text-charcoal/60">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 text-primary mr-2" />
                Subscription
              </CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
                <div>
                  <p className="font-semibold text-charcoal">Current Plan</p>
                  <p className="text-sm text-charcoal/60">
                    {MOCK_USER.tier === 'pro' ? 'Pro - $9/month' : 'Free - $0/month'}
                  </p>
                </div>
                <Badge variant={MOCK_USER.tier === 'pro' ? 'secondary' : 'outline'}>
                  {MOCK_USER.tier.toUpperCase()}
                </Badge>
              </div>

              {MOCK_USER.tier === 'free' ? (
                <Button className="w-full bg-primary hover:bg-primary/90">Upgrade to Pro</Button>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-charcoal/70">Next billing date: February 22, 2025</p>
                    <p className="text-sm text-charcoal/70">Payment method: •••• 4242</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Update Payment</Button>
                    <Button variant="outline" className="text-destructive">
                      Cancel Subscription
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal/60">No billing history available</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 text-primary mr-2" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-charcoal mb-2">Password</h4>
                <Button variant="outline">Change Password</Button>
              </div>

              <div>
                <h4 className="font-medium text-charcoal mb-2">Email Verification</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant={MOCK_USER.email_verified ? 'secondary' : 'destructive'}>
                    {MOCK_USER.email_verified ? 'Verified' : 'Not Verified'}
                  </Badge>
                  {!MOCK_USER.email_verified && (
                    <Button variant="link" size="sm">
                      Resend Verification
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-charcoal mb-2">Delete Account</h4>
                <p className="text-sm text-charcoal/60 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
