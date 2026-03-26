'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { type SubdomainType, type PractitionerBranding } from '@/lib/subdomain/types';

interface SubdomainContextValue {
  type: SubdomainType;
  subdomain: string | null;
  practitionerBranding: PractitionerBranding | null;
  isCustomSubdomain: boolean;
}

const SubdomainContext = createContext<SubdomainContextValue>({
  type: 'marketing',
  subdomain: null,
  practitionerBranding: null,
  isCustomSubdomain: false,
});

export function SubdomainProvider({
  type,
  subdomain,
  practitionerBranding,
  children,
}: {
  type: SubdomainType;
  subdomain: string | null;
  practitionerBranding: PractitionerBranding | null;
  children: ReactNode;
}) {
  return (
    <SubdomainContext.Provider
      value={{
        type,
        subdomain,
        practitionerBranding,
        isCustomSubdomain: type === 'custom',
      }}
    >
      {children}
    </SubdomainContext.Provider>
  );
}

export function useSubdomain() {
  return useContext(SubdomainContext);
}
