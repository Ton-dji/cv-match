import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights?: string[]; // Add highlights array
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Project {
  name: string;
  description: string;
  url?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface MasterProfile {
  fullName: string;
  title?: string; // Target Job Title / Headline
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages?: Language[];
  certifications?: Certification[];
  projects?: Project[];
  socialLinks?: SocialLink[];
  picture?: string; // Base64 string
  pictureZoom?: number; // Zoom level, default 1.0
  mainSections: string[]; // e.g. ['summary', 'experience', 'projects', 'education']
  sidebarSections: string[]; // e.g. ['contact', 'skills', 'languages', 'certifications']
  sectionOrder?: string[]; // Deprecated, keeping for migration if needed
  themeColor?: string; // Hex code
  fontFamily?: string; // Font family name

}

interface ProfileState {
  profile: MasterProfile;
  setProfile: (profile: Partial<MasterProfile>) => void;
  clearProfile: () => void;
  // ... existing actions
  setMainSections: (sections: string[]) => void;
  setSidebarSections: (sections: string[]) => void;
  // Deprecated but keeping signature to avoid immediate breakages if called elsewhere
  reorderSections: (newOrder: string[]) => void;
  addExperience: (exp: Experience) => void;
  reorderExperience: (newExp: Experience[]) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  reorderEducation: (newEdu: Education[]) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  // New actions
  addLanguage: (lang: Language) => void;
  removeLanguage: (idx: number) => void;
  addCertification: (cert: Certification) => void;
  removeCertification: (idx: number) => void;
  addProject: (proj: Project) => void;
  removeProject: (idx: number) => void;
  addSocialLink: (link: SocialLink) => void;
  removeSocialLink: (idx: number) => void;
  setThemeColor: (color: string) => void;
  setFontFamily: (font: string) => void;
}

// Helper to sort by date descending
const sortItemsByDate = <T extends { startDate: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    // Check for "Present" or "Actualidad" etc -> Treat as now
    const isPresent = (date: string) => /present|actual|current|aujourd/i.test(date);
    
    // Simple year parsing (e.g. "2023", "Sept 2023", "09/2023")
    // We try to extract the last 4 digits as year
    const getYear = (date: string) => {
        if (isPresent(date)) return new Date().getFullYear() + 1; // Future to keep at top
        const match = date.match(/\d{4}/);
        return match ? parseInt(match[0]) : 0;
    };

    return getYear(b.startDate) - getYear(a.startDate);
  });
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
        socialLinks: [],
        picture: "",
        pictureZoom: 1.0,
        sectionOrder: [], // Deprecated
        mainSections: ['summary', 'experience', 'projects', 'education'],
        sidebarSections: ['contact', 'skills', 'languages', 'certifications'],
      },
      setProfile: (newProfile) => set((state) => ({ profile: { ...state.profile, ...newProfile } })),
      clearProfile: () => set(() => ({
        profile: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
          experience: [],
          education: [],
          skills: [],
          languages: [],
          certifications: [],
          projects: [],
          socialLinks: [],
          picture: "",
          pictureZoom: 1.0,
          sectionOrder: [], 
          mainSections: ['summary', 'experience', 'projects', 'education'],
          sidebarSections: ['contact', 'skills', 'languages', 'certifications'],
        }
      })),
      setMainSections: (sections) => set((state) => ({
        profile: { ...state.profile, mainSections: sections }
      })),
      setSidebarSections: (sections) => set((state) => ({
        profile: { ...state.profile, sidebarSections: sections }
      })),
      reorderSections: (newOrder) => set((state) => ({ 
        profile: { ...state.profile, mainSections: newOrder } 
      })),
      addExperience: (exp) => set((state) => {
        const experience = sortItemsByDate([...state.profile.experience, exp]);
        return { profile: { ...state.profile, experience } };
      }),
      reorderExperience: (newExp) => set((state) => ({ 
        profile: { ...state.profile, experience: newExp } 
      })),
      removeExperience: (id) => set((state) => ({ 
        profile: { ...state.profile, experience: state.profile.experience.filter(e => e.id !== id) } 
      })),
      addEducation: (edu) => set((state) => {
         const education = sortItemsByDate([...state.profile.education, edu]);
         return { profile: { ...state.profile, education } };
      }),
      reorderEducation: (newEdu) => set((state) => ({ 
        profile: { ...state.profile, education: newEdu } 
      })),
      removeEducation: (id) => set((state) => ({ 
        profile: { ...state.profile, education: state.profile.education.filter(e => e.id !== id) } 
      })),
      updateSkills: (skills) => set((state) => ({ 
        profile: { ...state.profile, skills } 
      })),
      // New implementations
      addLanguage: (lang) => set((state) => ({
        profile: { ...state.profile, languages: [...(state.profile.languages || []), lang] }
      })),
      removeLanguage: (idx) => set((state) => ({
        profile: { ...state.profile, languages: (state.profile.languages || []).filter((_, i) => i !== idx) }
      })),
      addCertification: (cert) => set((state) => ({
        profile: { ...state.profile, certifications: [...(state.profile.certifications || []), cert] }
      })),
      removeCertification: (idx) => set((state) => ({
        profile: { ...state.profile, certifications: (state.profile.certifications || []).filter((_, i) => i !== idx) }
      })),
      addProject: (proj) => set((state) => ({
        profile: { ...state.profile, projects: [...(state.profile.projects || []), proj] }
      })),
      removeProject: (idx) => set((state) => ({
        profile: { ...state.profile, projects: (state.profile.projects || []).filter((_, i) => i !== idx) }
      })),
      addSocialLink: (link) => set((state) => ({
        profile: { ...state.profile, socialLinks: [...(state.profile.socialLinks || []), link] }
      })),
      removeSocialLink: (idx) => set((state) => ({
        profile: { ...state.profile, socialLinks: (state.profile.socialLinks || []).filter((_, i) => i !== idx) }
      })),
      setThemeColor: (color) => set((state) => ({
        profile: { ...state.profile, themeColor: color }
      })),
      setFontFamily: (font) => set((state) => ({
        profile: { ...state.profile, fontFamily: font }
      })),
    }),
    {
      name: 'cv-match-profile',
    }
  )
)
