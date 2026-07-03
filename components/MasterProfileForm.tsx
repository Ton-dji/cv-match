'use client';

import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { CVForm } from './CVForm';

export function MasterProfileForm() {
  const { profile, setProfile } = useProfileStore();

  return (
    <CVForm 
      data={profile} 
      onChange={(updatedProfile) => setProfile(updatedProfile)} 
    />
  );
}
