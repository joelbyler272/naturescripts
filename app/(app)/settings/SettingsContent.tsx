'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthContext';
import { getUserProfile, resetDailyUsage, clearAllConsultations, toggleUserTier, updateHealthProfile } from '@/lib/supabase/database';
import { isDevUser } from '@/lib/constants/devAccess';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal';
import {
  User, CreditCard, Shield, AlertTriangle, Loader2, Check,
  RotateCcw, Wrench, Trash2, ArrowUpDown, Heart, Plus, X
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/constants/routes';
import { Medication, Supplement } from '@/lib/consultation/types';

// Common weak passwords to check against
const COMMON_PASSWORDS = [
  '123456', 'password', 'qwerty', '123456789', 'abc123', 'password1',
  'letmein', 'iloveyou', 'admin', 'welcome', 'monkey', 'dragon',
  'master', 'login', 'passw0rd', 'trustno1', 'shadow', 'sunshine',
  'princess', 'football'
];

// Common health conditions for suggestions
const SUGGESTED_CONDITIONS = [
  'Anxiety', 'Insomnia', 'Digestive Issues', 'Fatigue', 'Headaches',
  'Joint Pain', 'Allergies', 'High Blood Pressure', 'Diabetes', 'Thyroid Issues'
];

export function SettingsContent() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClient());

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Health profile state
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [healthNotes, setHealthNotes] = useState('');
  const [healthSaving, setHealthSaving] = useState(false);
  const [healthSaved, setHealthSaved] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

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

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isDev = isDevUser(user?.email);

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || '');
      setLastName(user.user_metadata?.last_name || '');
      setEmail(user.email || '');
      setEmailVerified(!!user.email_confirmed_at);

      // Fetch profile with health data
      getUserProfile(user.id)
        .then((profile) => {
          if (profile) {
            const tier = ['free', 'pro'].includes(profile.tier) ? profile.tier as 'free' | 'pro' : 'free';
            setUserTier(tier);
            setHealthConditions(profile.health_conditions || []);
            setMedications(profile.medications || []);
            setSupplements(profile.supplements || []);
            setHealthNotes(profile.health_notes || '');
          }
        })
        .catch((err) => {
          logger.error('Failed to fetch user profile:', err);
        });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setProfileError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName },
      });
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      logger.error('Failed to save profile:', err);
      setProfileError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Health profile handlers
  const handleAddCondition = () => {
    if (newCondition.trim() && !healthConditions.includes(newCondition.trim())) {
      setHealthConditions([...healthConditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (condition: string) => {
    setHealthConditions(healthConditions.filter(c => c !== condition));
  };

  const handleAddSuggestedCondition = (condition: string) => {
    if (!healthConditions.includes(condition)) {
      setHealthConditions([...healthConditions, condition]);
    }
  };

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const handleUpdateMedication = (index: number, field: keyof Medication, value: string) => {
    setMedications(medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    ));
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleAddSupplement = () => {
    setSupplements([...supplements, { name: '', dosage: '', frequency: '' }]);
  };

  const handleUpdateSupplement = (index: number, field: keyof Supplement, value: string) => {
    setSupplements(supplements.map((supp, i) =>
      i === index ? { ...supp, [field]: value } : supp
    ));
  };

  const handleRemoveSupplement = (index: number) => {
    setSupplements(supplements.filter((_, i) => i !== index));
  };

  const handleSaveHealthProfile = async () => {
    if (!user) return;
    setHealthSaving(true);
    setHealthSaved(false);
    setHealthError(null);
    try {
      // Filter out empty entries
      const filteredMeds = medications.filter(m => m.name.trim());
      const filteredSupps = supplements.filter(s => s.name.trim());

      await updateHealthProfile(user.id, {
        health_conditions: healthConditions,
        medications: filteredMeds,
        supplements: filteredSupps,
        health_notes: healthNotes
      });

      setHealthSaved(true);
      setTimeout(() => setHealthSaved(false), 3000);
    } catch (err) {
      logger.error('Failed to save health profile:', err);
      setHealthError('Failed to save health profile. Please try again.');
    } finally {
      setHealthSaving(false);
    }
  };

  const handleChangePassword = async () => {
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
      const supabaseError = err as { message?: string; error_description?: string };
      const message = supabaseError.message || supabaseError.error_description || 'Failed to update password.';
      setPasswordMessage({ type: 'error', text: message });
    } finally {
      setPasswordSaving(false);
    }
  };

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
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
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
                    Last Name <span className="text-muted-foreground text-xs">(optional)</span>
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
              {profileError && (
                <p className="text-sm text-destructive">{profileError}</p>
              )}
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

        {/* Health Profile Tab */}
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 text-accent mr-2" />
                Health Profile
              </CardTitle>
              <CardDescription>
                This information helps personalize your consultation recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Health Conditions */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Health Conditions & Concerns
                </label>
                <div className="flex flex-wrap gap-2">
                  {healthConditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="gap-1 pr-1">
                      {condition}
                      <button
                        onClick={() => handleRemoveCondition(condition)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add a condition..."
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCondition(); } }}
                  />
                  <Button variant="outline" onClick={handleAddCondition}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Suggestions:</span>
                  {SUGGESTED_CONDITIONS.filter(c => !healthConditions.includes(c)).slice(0, 5).map((condition) => (
                    <button
                      key={condition}
                      onClick={() => handleAddSuggestedCondition(condition)}
                      className="text-xs text-accent hover:underline"
                    >
                      +{condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Current Medications
                  </label>
                  <Button variant="outline" size="sm" onClick={handleAddMedication}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {medications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No medications added</p>
                ) : (
                  <div className="space-y-3">
                    {medications.map((med, index) => (
                      <div key={`med-${med.name || index}`} className="flex gap-2 items-start">
                        <Input
                          placeholder="Medication name"
                          value={med.name}
                          onChange={(e) => handleUpdateMedication(index, 'name', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={(e) => handleUpdateMedication(index, 'dosage', e.target.value)}
                          className="w-24"
                        />
                        <Input
                          placeholder="Frequency"
                          value={med.frequency}
                          onChange={(e) => handleUpdateMedication(index, 'frequency', e.target.value)}
                          className="w-28"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMedication(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Supplements */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Current Supplements
                  </label>
                  <Button variant="outline" size="sm" onClick={handleAddSupplement}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {supplements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No supplements added</p>
                ) : (
                  <div className="space-y-3">
                    {supplements.map((supp, index) => (
                      <div key={`supp-${supp.name || index}`} className="flex gap-2 items-start">
                        <Input
                          placeholder="Supplement name"
                          value={supp.name}
                          onChange={(e) => handleUpdateSupplement(index, 'name', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Dosage"
                          value={supp.dosage}
                          onChange={(e) => handleUpdateSupplement(index, 'dosage', e.target.value)}
                          className="w-24"
                        />
                        <Input
                          placeholder="Frequency"
                          value={supp.frequency}
                          onChange={(e) => handleUpdateSupplement(index, 'frequency', e.target.value)}
                          className="w-28"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSupplement(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Health Notes */}
              <div className="space-y-3 border-t pt-4">
                <label className="text-sm font-medium text-foreground">
                  Additional Notes
                </label>
                <textarea
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  placeholder="Any allergies, sensitivities, or other health information..."
                  className="flex w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                />
              </div>

              {healthError && (
                <p className="text-sm text-destructive">{healthError}</p>
              )}
              <Button
                onClick={handleSaveHealthProfile}
                disabled={healthSaving}
                className="bg-accent hover:bg-accent/90"
              >
                {healthSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : healthSaved ? (
                  <><Check className="w-4 h-4 mr-2" /> Saved</>
                ) : (
                  'Save Health Profile'
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
                  {subscriptionError && (
                    <p className="text-xs text-destructive">{subscriptionError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Opens Stripe&apos;s secure portal where you can update or cancel your subscription.
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
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
      />
    </div>
  );
}
