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

  const renderTemplate = () => {
      const props = { data, themeColor, fontFamily, translations: t, language };
      
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
