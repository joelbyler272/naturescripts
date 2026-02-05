'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthContext';
import { getUserProfile, resetDailyUsage, clearAllConsultations, toggleUserTier } from '@/lib/supabase/database';
import { isDevUser } from '@/lib/constants/devAccess';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import {
  User, CreditCard, Shield, AlertTriangle, Loader2, Check,
  RotateCcw, Wrench, Trash2, ArrowUpDown,
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/constants/routes';

// Common weak passwords to check against
const COMMON_PASSWORDS = ['123456', 'password', 'qwerty', '123456789', 'abc123', 'password1'];

export function SettingsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dev tools state
  const [resettingUsage, setResettingUsage] = useState(false);
  const [resetUsageDone, setResetUsageDone] = useState(false);
  const [clearingConsultations, setClearingConsultations] = useState(false);
  const [clearConsultationsDone, setClearConsultationsDone] = useState(false);
  const [togglingTier, setTogglingTier] = useState(false);

  // Subscription management state
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  const isDev = isDevUser(user?.email);

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || '');
      setLastName(user.user_metadata?.last_name || '');
      setEmail(user.email || '');
      setEmailVerified(!!user.email_confirmed_at);

      // Fetch profile with error handling
      getUserProfile(user.id)
        .then((profile) => {
          if (profile) setUserTier(profile.tier as 'free' | 'pro');
        })
        .catch((err) => {
          logger.error('Failed to fetch user profile:', err);
          // Keep default 'free' tier on error
        });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName },
      });
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      logger.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Enhanced password validation
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    if (COMMON_PASSWORDS.includes(newPassword.toLowerCase())) {
      setPasswordMessage({ type: 'error', text: 'This password is too common. Please choose a stronger password.' });
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPasswordMessage({ type: 'error', text: 'Password must contain both letters and numbers.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      // Handle Supabase-specific error structure
      const supabaseError = err as { message?: string; error_description?: string };
      const message = supabaseError.message || supabaseError.error_description || 'Failed to update password.';
      setPasswordMessage({ type: 'error', text: message });
    } finally {
      setPasswordSaving(false);
    }
  };

  // Subscription management handlers
  const handleManageSubscription = async () => {
    setManagingSubscription(true);
    setSubscriptionError(null);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to open subscription portal');
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setSubscriptionError(err instanceof Error ? err.message : 'Something went wrong');
      setManagingSubscription(false);
    }
  };

  // Dev tool handlers
  const handleResetUsage = async () => {
    if (!user) return;
    setResettingUsage(true);
    setResetUsageDone(false);
    try {
      await resetDailyUsage(user.id);
      setResetUsageDone(true);
      setTimeout(() => setResetUsageDone(false), 3000);
    } catch (err) {
      logger.error('Failed to reset usage:', err);
    } finally {
      setResettingUsage(false);
    }
  };

  const handleClearConsultations = async () => {
    if (!user) return;
    setClearingConsultations(true);
    setClearConsultationsDone(false);
    try {
      await clearAllConsultations(user.id);
      setClearConsultationsDone(true);
      setTimeout(() => setClearConsultationsDone(false), 3000);
    } catch (err) {
      logger.error('Failed to clear consultations:', err);
    } finally {
      setClearingConsultations(false);
    }
  };

  const handleToggleTier = async () => {
    if (!user) return;
    setTogglingTier(true);
    try {
      const newTier = await toggleUserTier(user.id, userTier);
      if (newTier) setUserTier(newTier);
    } catch (err) {
      logger.error('Failed to toggle tier:', err);
    } finally {
      setTogglingTier(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
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
                <User className="w-5 h-5 text-accent mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input id="email" type="email" value={email} disabled />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-accent hover:bg-accent/90"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : saved ? (
                  <><Check className="w-4 h-4 mr-2" /> Saved</>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 text-accent mr-2" />
                Subscription
              </CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">Current Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {userTier === 'pro' ? 'Pro — $9/month' : 'Free — $0/month'}
                  </p>
                </div>
                <Badge variant={userTier === 'pro' ? 'secondary' : 'outline'}>
                  {userTier.toUpperCase()}
                </Badge>
              </div>
              {userTier === 'free' ? (
                <Link href={routes.upgrade}>
                  <Button className="w-full bg-accent hover:bg-accent/90">Upgrade to Pro</Button>
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={managingSubscription}
                    >
                      {managingSubscription ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Opening...</>
                      ) : (
                        'Manage Subscription'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="text-destructive"
                      onClick={handleManageSubscription}
                      disabled={managingSubscription}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                  {subscriptionError && (
                    <p className="text-xs text-destructive">{subscriptionError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Both options open Stripe&apos;s secure portal to manage your subscription.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 text-accent mr-2" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Email Verification</h4>
                <Badge variant={emailVerified ? 'secondary' : 'destructive'}>
                  {emailVerified ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-foreground mb-4">Change Password</h4>
                <div className="space-y-3 max-w-sm">
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters with letters and numbers"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  {passwordMessage && (
                    <p className={`text-sm ${
                      passwordMessage.type === 'success' ? 'text-accent' : 'text-destructive'
                    }`}>
                      {passwordMessage.text}
                    </p>
                  )}
                  <Button
                    onClick={handleChangePassword}
                    disabled={passwordSaving || !newPassword || !confirmPassword}
                    variant="outline"
                  >
                    {passwordSaving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dev Tools */}
          {isDev && (
            <Card className="border-amber-200/50 bg-amber-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Wrench className="w-4 h-4 text-amber-500 mr-2" />
                  Dev Tools
                </CardTitle>
                <CardDescription>Testing utilities — only visible to dev accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reset Daily Usage */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Reset Daily Usage</p>
                    <p className="text-xs text-muted-foreground">Sets today&apos;s consultation count back to 0</p>
                  </div>
                  <Button
                    onClick={handleResetUsage}
                    disabled={resettingUsage}
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                  >
                    {resettingUsage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : resetUsageDone ? (
                      <><Check className="w-3.5 h-3.5" /> Done</>
                    ) : (
                      <><RotateCcw className="w-3.5 h-3.5" /> Reset</>
                    )}
                  </Button>
                </div>

                {/* Clear All Consultations */}
                <div className="flex items-center justify-between border-t border-amber-200/50 pt-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Clear All Consultations</p>
                    <p className="text-xs text-muted-foreground">Marks all as abandoned, clears protocol data</p>
                  </div>
                  <Button
                    onClick={handleClearConsultations}
                    disabled={clearingConsultations}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive"
                  >
                    {clearingConsultations ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : clearConsultationsDone ? (
                      <><Check className="w-3.5 h-3.5" /> Cleared</>
                    ) : (
                      <><Trash2 className="w-3.5 h-3.5" /> Clear</>
                    )}
                  </Button>
                </div>

                {/* Toggle Tier */}
                <div className="flex items-center justify-between border-t border-amber-200/50 pt-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Toggle Tier
                      <Badge variant="outline" className="ml-2 text-[10px]">
                        {userTier.toUpperCase()}
                      </Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">Switch between free and pro for testing</p>
                  </div>
                  <Button
                    onClick={handleToggleTier}
                    disabled={togglingTier}
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                  >
                    {togglingTier ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <><ArrowUpDown className="w-3.5 h-3.5" /> Switch to {userTier === 'free' ? 'Pro' : 'Free'}</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" size="sm">Delete My Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
