import React from 'react';
import { Document, Font } from '@react-pdf/renderer';
import { MasterProfile } from '@/store/useProfileStore';

// Disable hyphenation (prevent words from being cut and moved to the next line)
Font.registerHyphenationCallback(word => [word]);
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';

interface CVDocumentProps {
  data: MasterProfile;
  language?: string;
  themeName?: 'Modern' | 'Classic' | 'Minimalist';
}

const translations: Record<string, Record<string, string>> = {
  English: {
    workExperience: "WORK EXPERIENCE",
    education: "EDUCATION",
    skills: "SKILLS",
    languages: "LANGUAGES",
    certifications: "CERTIFICATIONS",
    projects: "PROJECTS",
    contact: "CONTACT"
  },
  French: {
    workExperience: "EXPÉRIENCE PROFESSIONNELLE",
    education: "FORMATION",
    skills: "COMPÉTENCES",
    languages: "LANGUES",
    certifications: "CERTIFICATIONS",
    projects: "PROJETS",
    contact: "CONTACT"
  },
  Spanish: {
    workExperience: "EXPERIENCIA LABORAL",
    education: "EDUCACIÓN",
    skills: "HABILIDADES",
    languages: "IDIOMAS",
    certifications: "CERTIFICACIONES",
    projects: "PROYECTOS",
    contact: "CONTACTO"
  }
};

// Default Theme Settings
const defaultThemes = {
  Modern: { color: '#2563eb', font: 'Helvetica' },
  Classic: { color: '#854d0e', font: 'Times-Roman' },
  Minimalist: { color: '#000000', font: 'Helvetica' }
};

export const CVDocument = ({ data, language = "English", themeName = "Modern" }: CVDocumentProps) => {
  const t = translations[language] || translations["English"];
  
  // Use user selected color/font or fallback to theme defaults
  const themeColor = data.themeColor || defaultThemes[themeName]?.color || defaultThemes.Modern.color;
  const fontFamily = data.fontFamily || defaultThemes[themeName]?.font || defaultThemes.Modern.font;

  const translateLevel = (level: string, targetLang: string) => {
    if (!level) return '';
    const l = level.toLowerCase();
    let key = 'native';
    if (l.includes('native') || l.includes('nativ') || l.includes('natif')) key = 'native';
    else if (l.includes('fluent') || l.includes('fluid') || l.includes('courant') || l.includes('biling')) key = 'fluent';
    else if (l.includes('intermediate') || l.includes('intermedio') || l.includes('intermédiaire')) key = 'intermediate';
    else if (l.includes('basic') || l.includes('básico') || l.includes('basiq') || l.includes('begin')) key = 'basic';
    else return level;

    if (targetLang === 'French') {
        const map: any = { native: 'Natif', fluent: 'Courant', intermediate: 'Intermédiaire', basic: 'Basique' };
        return map[key];
    }
    if (targetLang === 'Spanish') {
        const map: any = { native: 'Nativo', fluent: 'Fluido', intermediate: 'Intermedio', basic: 'Básico' };
        return map[key];
    }
    const map: any = { native: 'Native', fluent: 'Fluent', intermediate: 'Intermediate', basic: 'Basic' };
    return map[key] || level;
  };

  const translateLanguageName = (name: string, targetLang: string) => {
    if (!name) return '';
    const n = name.toLowerCase().trim();
    let key = 'english';
    if (n === 'english' || n === 'inglés' || n === 'anglais') key = 'english';
    else if (n === 'spanish' || n === 'español' || n === 'espagnol') key = 'spanish';
    else if (n === 'french' || n === 'francés' || n === 'français') key = 'french';
    else if (n === 'german' || n === 'alemán' || n === 'allemand') key = 'german';
    else if (n === 'italian' || n === 'italiano' || n === 'italien') key = 'italian';
    else if (n === 'portuguese' || n === 'portugués' || n === 'portugais') key = 'portuguese';
    else return name;

    if (targetLang === 'French') {
        const map: any = { english: 'Anglais', spanish: 'Espagnol', french: 'Français', german: 'Allemand', italian: 'Italien', portuguese: 'Portugais' };
        return map[key];
    }
    if (targetLang === 'Spanish') {
        const map: any = { english: 'Inglés', spanish: 'Español', french: 'Francés', german: 'Alemán', italian: 'Italiano', portuguese: 'Portugués' };
        return map[key];
    }
    const map: any = { english: 'English', spanish: 'Spanish', french: 'French', german: 'German', italian: 'Italian', portuguese: 'Portuguese' };
    return map[key] || name;
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.match(/^\+\d{11}$/)) {
        return cleaned.replace(/(\+\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    }
    return phone;
  };

  const formatDate = (date: string, targetLang: string) => {
    if (!date) return '';
    const d = date.trim().toLowerCase();
    
    // Intercept present keywords
    if (d === 'present' || d === 'presente' || d === 'présent' || d === 'actualidad') {
        if (targetLang === 'Spanish') return 'Actualidad';
        if (targetLang === 'French') return 'Présent';
        return 'Present';
    }

    const parts = date.split('-');
    if (parts.length === 2 && parts[0].length === 4) {
       return `${parts[1]}/${parts[0]}`;
    }
    return date;
  };

  const formatDescription = (desc: string) => {
     if (!desc) return '';
     return desc.split('\n').map(line => {
         let clean = line.trim();
         if (!clean) return '';
         const firstChar = clean.charAt(0);
         // only capitalize if it's a letter to avoid messing up bullet formats if any slip through
         if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(firstChar)) {
             clean = firstChar.toUpperCase() + clean.slice(1);
         }
         return clean;
     }).join('\n');
  };

  const translatedData = {
    ...data,
    phone: formatPhone(data.phone || ''),
    experience: data.experience?.map(exp => ({
       ...exp,
       startDate: formatDate(exp.startDate, language),
       endDate: formatDate(exp.endDate, language),
       description: formatDescription(exp.description)
    })) || [],
    education: data.education?.map(edu => ({
       ...edu,
       startDate: formatDate(edu.startDate, language),
       endDate: formatDate(edu.endDate, language),
       description: formatDescription(edu.description)
    })) || [],
    languages: data.languages?.map(lang => ({
      ...lang,
      language: translateLanguageName(lang.language, language),
      proficiency: translateLevel(lang.proficiency, language)
    })) || []
  };

  const renderTemplate = () => {
      const props = { data: translatedData, themeColor, fontFamily, translations: t, language };
      
      switch (themeName) {
          case 'Classic':
              return <ClassicTemplate {...props} />;
          case 'Minimalist':
              return <MinimalistTemplate {...props} />;
          case 'Executive':
              return <ExecutiveTemplate {...props} />;
          case 'Creative':
              return <CreativeTemplate {...props} />;
          case 'Modern':
          default:
              return <ModernTemplate {...props} />;
      }
  };

  return (
    <Document>
      {renderTemplate()}
    </Document>
  );
};
