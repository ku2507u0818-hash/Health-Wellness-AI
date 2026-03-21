import React, { useEffect, useState } from 'react';
import { User, Loader2, Save } from 'lucide-react';
import { useGetProfile, useUpdateProfile } from '@workspace/api-client-react';
import { useAppState } from '@/hooks/use-app-state';
import { t } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { language, setLanguage } = useAppState();
  const { toast } = useToast();
  
  const { data: profile, isLoading } = useGetProfile();
  const updateMutation = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Update Failed", description: "Could not save your profile." });
      }
    }
  });

  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState('');
  const [prefLang, setPrefLang] = useState<string>('en');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age ? String(profile.age) : '');
      setGender(profile.gender || '');
      setPrefLang(profile.language || 'en');
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      data: {
        name,
        age: age ? Number(age) : null,
        gender: gender || null,
        language: prefLang as any
      }
    });
    setLanguage(prefLang as any); // Sync global language setting
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          {t('Profile', language)}
        </h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
            <input
              type="email"
              disabled
              value={profile?.email || ''}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-border text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Gender</label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Preferred Content Language</label>
            <div className="relative">
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This language will be used for your health analysis and tips.</p>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6"
          >
            {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
