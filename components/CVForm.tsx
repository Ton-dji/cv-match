'use client';

import React from 'react';
import { MasterProfile, Experience, Education } from '@/store/useProfileStore';
import { useI18nStore } from '@/store/useI18nStore';
import { LANGUAGES_LIST } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, LayoutTemplate, ZoomIn, Wand2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InterviewChat } from './InterviewChat';

const DEFAULT_MAIN_SECTIONS = ['summary', 'experience', 'projects', 'education'];
const DEFAULT_SIDEBAR_SECTIONS = ['contact', 'skills', 'languages', 'certifications'];

const formTranslations: Record<string, Record<string, string>> = {
  English: {
    personalInfo: "Personal Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    location: "Location",
    summary: "Professional Summary",
    skills: "Skills",
    enterSkills: "Enter skills separated by commas",
    workExperience: "Work Experience",
    addPosition: "Add Position",
    jobTitle: "Job Title",
    company: "Company",
    city: "City / Place",
    startDate: "Start Date",
    endDate: "End Date",
    description: "Description",
    education: "Education",
    addEducation: "Add Education",
    degree: "Degree / Major",
    school: "School / University",
    languages: "Languages",
    addLanguage: "Add Language",
    selectLanguage: "Select Language",
    certifications: "Certifications",
    addCertification: "Add Certification",
    certName: "Certification Name",
    issuer: "Issuer",
    date: "Date (e.g. 2023)",
    projects: "Projects",
    addProject: "Add Project",
    projectName: "Project Name",
    projectUrl: "Project URL (Optional)",
    projectDesc: "Project Description",
    socialLinks: "Social Links",
    addLink: "Add Link",
    platform: "Platform (e.g. LinkedIn)",
    url: "URL",
    noExperience: "No work experience listed.",
    noEducation: "No education listed.",
    noLanguages: "No languages listed.",
    noCertifications: "No certifications listed.",
    noProjects: "No projects listed.",
    noLinks: "No social links listed.",
    clearProfile: "Clear Profile",
    clearWarning: "Are you sure you want to clear your entire CV? This cannot be undone.",
    aiInterviewMode: "AI Interview Mode",
    noPhoto: "No Photo",
    layoutConfig: "Layout Configuration",
    layoutDesc: "Arrange sections between the Main Column and Sidebar.",
    layoutNote: 'Note: In "Minimalist" theme, the Sidebar is hidden and its content follows the Main Column content.',
    singleColumnActive: "Single Column Layout Active.",
    singleColumnDesc: 'In Minimalist mode, "Main" and "Sidebar" sections are merged into one single list. You can still order them below.',
    mainColumn: "Main Column",
    sidebarOther: "Sidebar / Other",
    contact: "Contact"
  },
  French: {
    personalInfo: "Informations Personnelles",
    fullName: "Nom Complet",
    email: "Email",
    phone: "Téléphone",
    location: "Lieu",
    summary: "Résumé Professionnel",
    skills: "Compétences",
    enterSkills: "Entrez les compétences séparées par des virgules",
    workExperience: "Expérience Professionnelle",
    addPosition: "Ajouter un Poste",
    jobTitle: "Intitulé du Poste",
    company: "Entreprise",
    city: "Ville / Lieu",
    startDate: "Date de Début",
    endDate: "Date de Fin",
    description: "Description",
    education: "Formation",
    addEducation: "Ajouter une Formation",
    degree: "Diplôme",
    school: "École / Université",
    languages: "Langues",
    addLanguage: "Ajouter une Langue",
    selectLanguage: "Sélectionner une Langue",
    certifications: "Certifications",
    addCertification: "Ajouter une Certification",
    certName: "Nom de la Certification",
    issuer: "Organisme Délivreur",
    date: "Date (ex: 2023)",
    projects: "Projets",
    addProject: "Ajouter un Projet",
    projectName: "Nom du Projet",
    projectUrl: "URL du Projet (Optionnel)",
    projectDesc: "Description du Projet",
    socialLinks: "Liens Sociaux",
    addLink: "Ajouter un Lien",
    platform: "Plateforme (ex: LinkedIn)",
    url: "URL",
    noExperience: "Aucune expérience listée.",
    noEducation: "Aucune formation listée.",
    noLanguages: "Aucune langue listée.",
    noCertifications: "Aucune certification listée.",
    noProjects: "Aucun projet listé.",
    noLinks: "Aucun lien social listé.",
    clearProfile: "Effacer le Profil",
    clearWarning: "Êtes-vous sûr de vouloir effacer tout votre CV ? Cette action est irréversible.",
    aiInterviewMode: "Mode Entretien IA",
    noPhoto: "Pas de Photo",
    layoutConfig: "Configuration de la mise en page",
    layoutDesc: "Organisez les sections entre la colonne principale et la barre latérale.",
    layoutNote: 'Remarque : Dans le thème "Minimaliste", la barre latérale est masquée.',
    singleColumnActive: "Disposition en colonne unique active.",
    singleColumnDesc: 'En mode Minimaliste, les sections "Principale" et "Barre latérale" sont fusionnées.',
    mainColumn: "Colonne Principale",
    sidebarOther: "Barre Latérale / Autre",
    contact: "Contact"
  },
  Spanish: {
    personalInfo: "Información Personal",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono",
    location: "Ubicación",
    summary: "Resumen Profesional",
    skills: "Habilidades",
    enterSkills: "Ingrese habilidades separadas por comas",
    workExperience: "Experiencia Laboral",
    addPosition: "Añadir Puesto",
    jobTitle: "Título del Puesto",
    company: "Empresa",
    city: "Ciudad / Lugar",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Fin",
    description: "Descripción",
    education: "Educación",
    addEducation: "Añadir Educación",
    degree: "Título / Carrera",
    school: "Escuela / Universidad",
    languages: "Idiomas",
    addLanguage: "Añadir Idioma",
    selectLanguage: "Seleccionar Idioma",
    certifications: "Certificaciones",
    addCertification: "Añadir Certificación",
    certName: "Nombre de la Certificación",
    issuer: "Emisor",
    date: "Fecha (ej. 2023)",
    projects: "Proyectos",
    addProject: "Añadir Proyecto",
    projectName: "Nombre del Proyecto",
    projectUrl: "URL del Proyecto (Opcional)",
    projectDesc: "Descripción del Proyecto",
    socialLinks: "Redes Sociales",
    addLink: "Añadir Enlace",
    platform: "Plataforma (ej. LinkedIn)",
    url: "URL",
    noExperience: "No hay experiencia laboral listada.",
    noEducation: "No hay educación listada.",
    noLanguages: "No hay idiomas listados.",
    noCertifications: "No hay certificaciones listadas.",
    noProjects: "No hay proyectos listados.",
    noLinks: "No hay enlaces sociales listados.",
    clearProfile: "Borrar Perfil",
    clearWarning: "¿Estás seguro de que deseas borrar todo tu CV? Esto no se puede deshacer.",
    aiInterviewMode: "Modo Entrevista IA",
    noPhoto: "Sin Foto",
    layoutConfig: "Configuración de Diseño",
    layoutDesc: "Organiza las secciones entre la Columna Principal y la Barra Lateral.",
    layoutNote: 'Nota: En el tema "Minimalista", la Barra Lateral está oculta.',
    singleColumnActive: "Diseño de columna única activo.",
    singleColumnDesc: 'En el modo Minimalista, las secciones "Principal" y "Barra Lateral" se fusionan en una sola lista.',
    mainColumn: "Columna Principal",
    sidebarOther: "Barre Lateral / Otros",
    contact: "Contacto"
  }
};

interface CVFormProps {
  data: MasterProfile;
  onChange: (data: MasterProfile) => void;
  readOnly?: boolean;
  language?: string;
  themeName?: string;
}

export function CVForm({ data, onChange, readOnly = false, language = "English", themeName }: CVFormProps) {
  const { language: uiLanguage } = useI18nStore();
  const langKey = uiLanguage === 'es' ? 'Spanish' : uiLanguage === 'fr' ? 'French' : 'English';
  const t = formTranslations[langKey];
  
  const sectionNames: Record<string, string> = {
    summary: t.summary,
    experience: t.workExperience,
    projects: t.projects,
    education: t.education,
    contact: t.contact,
    skills: t.skills,
    languages: t.languages,
    certifications: t.certifications,
  };
  
  const handleInputChange = (field: keyof MasterProfile, value: string | Experience[] | Education[] | string[]) => {
    onChange({ ...data, [field]: value });
  };

  // AI Suggestions State
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);

  const fetchSuggestions = async (expId: string, jobTitle: string) => {
    if (!jobTitle) return;
    setIsLoadingSuggestions(true);
    setSuggestions([]);

    try {
      const res = await fetch('/api/suggest-tasks', {
        method: 'POST',
        body: JSON.stringify({ jobTitle, language: language }),
      });
      const json = await res.json();
      if (json.suggestions) {
        setSuggestions(json.suggestions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addSuggestion = (expId: string, text: string) => {
      // Find the experience and append to description
      const expIndex = data.experience.findIndex(e => e.id === expId);
      if (expIndex === -1) return;
      
      const currentDesc = data.experience[expIndex].description || '';
      // Ensure we start on a new line if there's text
      const separator = currentDesc.length > 0 && !currentDesc.endsWith('\n') ? '\n' : '';
      const newDesc = currentDesc + separator + text;
      
      const newExperiences = [...data.experience];
      newExperiences[expIndex] = { ...newExperiences[expIndex], description: newDesc };
      onChange({ ...data, experience: newExperiences });
  };

  const addNewExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const removeExperience = (id: string) => {
     onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  }

  const updateExperienceItem = (id: string, field: keyof Experience, value: string) => {
    const updatedExp = data.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ ...data, experience: updatedExp });
  };

  const addNewEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const removeEducation = (id: string) => {
     onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  }

  const updateEducationItem = (id: string, field: keyof Education, value: string) => {
    const updatedEdu = data.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ ...data, education: updatedEdu });
  };

  // Local state for skills text to handle comfortable typing vs external updates
  const [skillsText, setSkillsText] = React.useState(data.skills.join(', '));

  // Sync local text when data.skills changes (e.g. from AI optimization)
  React.useEffect(() => {
    setSkillsText(data.skills.join(', '));
  }, [data.skills]);

  const handleSkillsTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSkillsText(e.target.value);
  };

  const handleSkillsBlur = () => {
    const skills = skillsText.split(',').map(s => s.trim()).filter(s => s);
    onChange({ ...data, skills });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{t.personalInfo}</CardTitle>
          {!readOnly && (
             <div className="flex flex-wrap items-center gap-2">
               <Button 
                 variant="destructive" 
                 size="sm" 
                 onClick={() => {
                   if (confirm(t.clearWarning)) {
                     onChange({
                       fullName: "", title: "", email: "", phone: "", location: "", summary: "",
                       experience: [], education: [], skills: [], languages: [],
                       certifications: [], projects: [], socialLinks: [], picture: "", pictureZoom: 1.0,
                       mainSections: ['summary', 'experience', 'projects', 'education'],
                       sidebarSections: ['contact', 'skills', 'languages', 'certifications'],
                     });
                   }
                 }}
               >
                 <Trash2 className="w-4 h-4 mr-2" /> {t.clearProfile}
               </Button>
               <Dialog>
                 <DialogTrigger asChild>
                   <Button variant="outline" size="sm" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                     <Wand2 className="w-4 h-4 mr-2" /> {t.aiInterviewMode}
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-0">
                   <InterviewChat 
                     currentProfile={data}
                     onUpdateCV={(parsedData) => {
                       const newData = { ...data };
                       
                       // Merge simple string fields
                       if (parsedData.fullName) newData.fullName = parsedData.fullName;
                       if (parsedData.title) newData.title = parsedData.title;
                       if (parsedData.email) newData.email = parsedData.email;
                       if (parsedData.phone) newData.phone = parsedData.phone;
                       if (parsedData.location) newData.location = parsedData.location;
                       if (parsedData.summary) {
                         newData.summary = newData.summary ? `${newData.summary}\n\n${parsedData.summary}` : parsedData.summary;
                       }
                       
                       // Merge arrays by appending and adding IDs
                       if (parsedData.experience && Array.isArray(parsedData.experience)) {
                         const newExps = parsedData.experience.map(exp => ({ ...exp, id: crypto.randomUUID() }));
                         newData.experience = [...newData.experience, ...newExps];
                       }
                       if (parsedData.education && Array.isArray(parsedData.education)) {
                         const newEdus = parsedData.education.map(edu => ({ ...edu, id: crypto.randomUUID() }));
                         newData.education = [...newData.education, ...newEdus];
                       }
                       if (parsedData.skills && Array.isArray(parsedData.skills)) {
                         const combinedSkills = Array.from(new Set([...newData.skills, ...parsedData.skills]));
                         newData.skills = combinedSkills;
                       }
                       
                       onChange(newData);
                     }}
                   />
                 </DialogContent>
               </Dialog>
             </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-full bg-slate-100 border flex items-center justify-center overflow-hidden relative">
              {data.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.picture} alt="Profile" className="h-full w-full object-cover"/>
              ) : (
                <span className="text-slate-400 text-xs">{t.noPhoto}</span>
              )}
            </div>
            {!readOnly && (
              <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                       <Input 
                        type="file" 
                        accept="image/*"
                        className="text-sm cursor-pointer file:cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              onChange({ ...data, picture: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {data.picture && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onChange({ ...data, picture: '' })}
                        >
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      )}
                  </div>
                  {data.picture && (
                     <div className="flex items-center gap-2">
                        <ZoomIn className="w-4 h-4 text-slate-400" />
                        <input 
                            type="range" 
                            min="0.5" 
                            max="3" 
                            step="0.1"
                            value={data.pictureZoom || 1}
                            onChange={(e) => onChange({ ...data, pictureZoom: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-xs text-slate-500 w-8">{(data.pictureZoom || 1).toFixed(1)}x</span>
                     </div>
                  )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder={t.fullName}
              value={data.fullName} 
              onChange={(e) => handleInputChange('fullName', e.target.value)} 
              disabled={readOnly}
            />
            <Input 
              placeholder="Target Job Title (Optional)"
              value={data.title || ''} 
              onChange={(e) => handleInputChange('title', e.target.value)} 
              disabled={readOnly}
            />
            <Input 
              placeholder={t.email} 
              value={data.email} 
              onChange={(e) => handleInputChange('email', e.target.value)} 
              disabled={readOnly}
            />
            <Input 
              placeholder={t.phone} 
              value={data.phone} 
              onChange={(e) => handleInputChange('phone', e.target.value)} 
              disabled={readOnly}
            />
            <Input 
              placeholder={t.location} 
              value={data.location} 
              onChange={(e) => handleInputChange('location', e.target.value)} 
              disabled={readOnly}
            />
          </div>
          <Textarea 
            placeholder={t.summary} 
            value={data.summary} 
            onChange={(e) => handleInputChange('summary', e.target.value)} 
            className="h-32"
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.skills}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder={t.enterSkills} 
            value={skillsText} 
            onChange={handleSkillsTextChange}
            onBlur={handleSkillsBlur} 
            className="h-24"
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{t.workExperience}</CardTitle>
          {!readOnly && (
            <Button onClick={addNewExperience} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2"/> {t.addPosition}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-4 border rounded-md space-y-3 relative bg-slate-50/50">
              {!readOnly && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      disabled={data.experience.indexOf(exp) === 0}
                      onClick={() => {
                        const idx = data.experience.indexOf(exp);
                        if (idx > 0) {
                            const newExp = [...data.experience];
                            [newExp[idx - 1], newExp[idx]] = [newExp[idx], newExp[idx - 1]];
                            onChange({ ...data, experience: newExp });
                        }
                      }}
                    >
                      ↑
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      disabled={data.experience.indexOf(exp) === data.experience.length - 1}
                      onClick={() => {
                        const idx = data.experience.indexOf(exp);
                        if (idx < data.experience.length - 1) {
                            const newExp = [...data.experience];
                            [newExp[idx + 1], newExp[idx]] = [newExp[idx], newExp[idx + 1]];
                            onChange({ ...data, experience: newExp });
                        }
                      }}
                    >
                      ↓
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 h-8 w-8"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <div className="relative">
                    <Input 
                      placeholder={t.jobTitle} 
                      value={exp.role} 
                      onChange={(e) => updateExperienceItem(exp.id, 'role', e.target.value)}
                      disabled={readOnly}
                      className="pr-10"
                    />
                     {!readOnly && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute right-1 top-1 h-8 w-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                    onClick={() => fetchSuggestions(exp.id, exp.role)}
                                    title="Get AI Suggestions"
                                >
                                    <Wand2 className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                             <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                <DialogTitle>AI Task Suggestions</DialogTitle>
                                <DialogDescription>
                                    Reviewing tasks for: <span className="font-semibold">{exp.role}</span>
                                </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                                    {isLoadingSuggestions ? (
                                        <div className="flex justify-center p-4">
                                            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map((sug, i) => (
                                            <div 
                                                key={i} 
                                                className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer text-sm group transition-colors"
                                                onClick={() => addSuggestion(exp.id, sug)}
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <span>{sug}</span>
                                                    <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 text-green-600 shrink-0 mt-0.5" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-sm text-muted-foreground p-4">
                                            No suggestions found. Try refining the job title.
                                        </p>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                 </div>
                <Input 
                  placeholder={t.company} 
                  value={exp.company} 
                  onChange={(e) => updateExperienceItem(exp.id, 'company', e.target.value)}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.city} 
                  value={exp.location || ''} 
                  onChange={(e) => updateExperienceItem(exp.id, 'location', e.target.value)}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.startDate} 
                  value={exp.startDate || ''} 
                  onChange={(e) => updateExperienceItem(exp.id, 'startDate', e.target.value)}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.endDate} 
                  value={exp.endDate || ''} 
                  onChange={(e) => updateExperienceItem(exp.id, 'endDate', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              <Textarea 
                placeholder={t.description} 
                value={exp.description} 
                onChange={(e) => updateExperienceItem(exp.id, 'description', e.target.value)}
                className="h-24 mb-2"
                disabled={readOnly}
              />
              
              {/* Highlights Section */}
              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Key Tasks / Highlights</label>
                    {!readOnly && (
                       <Button 
                         variant="outline" 
                         size="sm" 
                         onClick={() => {
                            const currentHighlights = exp.highlights || [];
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            updateExperienceItem(exp.id, 'highlights' as any, [...currentHighlights, ''] as any);
                         }}
                       >
                         <Plus className="w-3 h-3 mr-1"/> Add Task
                       </Button>
                    )}
                 </div>
                 {(exp.highlights || []).map((highlight, hIdx) => (
                    <div key={hIdx} className="flex gap-2 items-center">
                        <Input 
                           value={highlight}
                           placeholder="Accompished X by doing Y..."
                           onChange={(e) => {
                             const newHighlights = [...(exp.highlights || [])];
                             newHighlights[hIdx] = e.target.value;
                             // eslint-disable-next-line @typescript-eslint/no-explicit-any
                             updateExperienceItem(exp.id, 'highlights' as any, newHighlights as any);
                           }}
                           disabled={readOnly}
                        />
                         {!readOnly && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                                const newHighlights = (exp.highlights || []).filter((_, i) => i !== hIdx);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                updateExperienceItem(exp.id, 'highlights' as any, newHighlights as any);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500"/>
                          </Button>
                        )}
                    </div>
                 ))}
              </div>
            </div>
          ))}
          {data.experience.length === 0 && <p className="text-center text-muted-foreground">{t.noExperience}</p>}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{t.education}</CardTitle>
          {!readOnly && (
            <Button onClick={addNewEducation} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2"/> {t.addEducation}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-4 border rounded-md space-y-3 relative bg-slate-50/50">
              {!readOnly && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      disabled={data.education.indexOf(edu) === 0}
                      onClick={() => {
                        const idx = data.education.indexOf(edu);
                        if (idx > 0) {
                            const newEdu = [...data.education];
                            [newEdu[idx - 1], newEdu[idx]] = [newEdu[idx], newEdu[idx - 1]];
                            onChange({ ...data, education: newEdu });
                        }
                      }}
                    >
                      ↑
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      disabled={data.education.indexOf(edu) === data.education.length - 1}
                      onClick={() => {
                         const idx = data.education.indexOf(edu);
                         if (idx < data.education.length - 1) {
                            const newEdu = [...data.education];
                            [newEdu[idx + 1], newEdu[idx]] = [newEdu[idx], newEdu[idx + 1]];
                            onChange({ ...data, education: newEdu });
                         }
                      }}
                    >
                      ↓
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 h-8 w-8"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <Input 
                  placeholder={t.degree} 
                  value={edu.degree} 
                  onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value)}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.school} 
                  value={edu.school} 
                  onChange={(e) => updateEducationItem(edu.id, 'school', e.target.value)}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.city} 
                  value={edu.location || ''} 
                  onChange={(e) => updateEducationItem(edu.id, 'location', e.target.value)}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.startDate} 
                  value={edu.startDate || ''} 
                  onChange={(e) => updateEducationItem(edu.id, 'startDate', e.target.value)}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.endDate} 
                  value={edu.endDate || ''} 
                  onChange={(e) => updateEducationItem(edu.id, 'endDate', e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>
          ))}
          {data.education.length === 0 && <p className="text-center text-muted-foreground">{t.noEducation}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{t.languages}</CardTitle>
          {!readOnly && (
            <Button onClick={() => onChange({ ...data, languages: [...(data.languages || []), { language: '', proficiency: 'Fluent' }] })} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2"/> {t.addLanguage}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.languages || []).map((lang, idx) => (
             <div key={idx} className="flex gap-2 items-center">
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={lang.language} 
                  onChange={(e) => {
                    const newLangs = [...(data.languages || [])];
                    newLangs[idx].language = e.target.value;
                    onChange({ ...data, languages: newLangs });
                  }}
                  disabled={readOnly}
                >
                  <option value="" disabled>{t.selectLanguage}</option>
                  {LANGUAGES_LIST.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={lang.proficiency}
                  onChange={(e) => {
                    const newLangs = [...(data.languages || [])];
                    newLangs[idx].proficiency = e.target.value;
                    onChange({ ...data, languages: newLangs });
                  }}
                  disabled={readOnly}
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
                {!readOnly && (
                  <Button variant="ghost" size="icon" onClick={() => onChange({ ...data, languages: (data.languages || []).filter((_, i) => i !== idx) })}>
                    <Trash2 className="w-4 h-4 text-red-500"/>
                  </Button>
                )}
             </div>
          ))}
          {(!data.languages || data.languages.length === 0) && <p className="text-sm text-muted-foreground">{t.noLanguages}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{t.certifications}</CardTitle>
          {!readOnly && (
            <Button onClick={() => onChange({ ...data, certifications: [...(data.certifications || []), { name: '', issuer: '', date: '' }] })} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2"/> {t.addCertification}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.certifications || []).map((cert, idx) => (
             <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 border p-3 rounded-md relative bg-slate-50/50">
                 {!readOnly && (
                  <Button variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => onChange({ ...data, certifications: (data.certifications || []).filter((_, i) => i !== idx) })}>
                    <Trash2 className="w-4 h-4 text-red-500"/>
                  </Button>
                )}
                <Input 
                  placeholder={t.certName} 
                  value={cert.name} 
                  onChange={(e) => {
                    const newCerts = [...(data.certifications || [])];
                    newCerts[idx].name = e.target.value;
                    onChange({ ...data, certifications: newCerts });
                  }}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.issuer} 
                  value={cert.issuer} 
                  onChange={(e) => {
                    const newCerts = [...(data.certifications || [])];
                    newCerts[idx].issuer = e.target.value;
                    onChange({ ...data, certifications: newCerts });
                  }}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.date} 
                  value={cert.date} 
                  onChange={(e) => {
                    const newCerts = [...(data.certifications || [])];
                    newCerts[idx].date = e.target.value;
                    onChange({ ...data, certifications: newCerts });
                  }}
                  disabled={readOnly}
                />
             </div>
          ))}
          {(!data.certifications || data.certifications.length === 0) && <p className="text-sm text-muted-foreground">{t.noCertifications}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{t.projects}</CardTitle>
          {!readOnly && (
            <Button onClick={() => onChange({ ...data, projects: [...(data.projects || []), { name: '', description: '', url: '' }] })} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2"/> {t.addProject}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.projects || []).map((proj, idx) => (
             <div key={idx} className="space-y-2 border p-3 rounded-md relative bg-slate-50/50">
                 {!readOnly && (
                  <Button variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => onChange({ ...data, projects: (data.projects || []).filter((_, i) => i !== idx) })}>
                    <Trash2 className="w-4 h-4 text-red-500"/>
                  </Button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-8">
                  <Input 
                    placeholder={t.projectName} 
                    value={proj.name} 
                    onChange={(e) => {
                      const newProjs = [...(data.projects || [])];
                      newProjs[idx].name = e.target.value;
                      onChange({ ...data, projects: newProjs });
                    }}
                    disabled={readOnly}
                  />
                  <Input 
                    placeholder={t.projectUrl} 
                    value={proj.url || ''} 
                    onChange={(e) => {
                      const newProjs = [...(data.projects || [])];
                      newProjs[idx].url = e.target.value;
                      onChange({ ...data, projects: newProjs });
                    }}
                    disabled={readOnly}
                  />
                </div>
                <Textarea 
                  placeholder={t.projectDesc} 
                  value={proj.description} 
                  onChange={(e) => {
                    const newProjs = [...(data.projects || [])];
                    newProjs[idx].description = e.target.value;
                    onChange({ ...data, projects: newProjs });
                  }}
                  disabled={readOnly}
                />
             </div>
          ))}
          {(!data.projects || data.projects.length === 0) && <p className="text-sm text-muted-foreground">{t.noProjects}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{t.socialLinks}</CardTitle>
          {!readOnly && (
            <Button onClick={() => onChange({ ...data, socialLinks: [...(data.socialLinks || []), { platform: '', url: '' }] })} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2"/> {t.addLink}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.socialLinks || []).map((link, idx) => (
             <div key={idx} className="flex gap-2 items-center">
                <Input 
                  placeholder={t.platform} 
                  value={link.platform} 
                  onChange={(e) => {
                    const newLinks = [...(data.socialLinks || [])];
                    newLinks[idx].platform = e.target.value;
                    onChange({ ...data, socialLinks: newLinks });
                  }}
                  disabled={readOnly}
                />
                <Input 
                  placeholder={t.url} 
                  value={link.url} 
                  onChange={(e) => {
                    const newLinks = [...(data.socialLinks || [])];
                    newLinks[idx].url = e.target.value;
                    onChange({ ...data, socialLinks: newLinks });
                  }}
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button variant="ghost" size="icon" onClick={() => onChange({ ...data, socialLinks: (data.socialLinks || []).filter((_, i) => i !== idx) })}>
                    <Trash2 className="w-4 h-4 text-red-500"/>
                  </Button>
                )}
             </div>
          ))}
          {(!data.socialLinks || data.socialLinks.length === 0) && <p className="text-sm text-muted-foreground">{t.noLinks}</p>}
        </CardContent>
      </Card>

      {/* Layout Configuration */}
      <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5" />
                {t.layoutConfig}
             </CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                  {t.layoutDesc} 
                  <br/>
                  <span className="italic text-xs">{t.layoutNote}</span>
              </p>

              {themeName === 'Minimalist' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm text-amber-800 flex gap-2 items-start">
                     <span className="text-lg">ℹ️</span>
                     <div>
                        <strong>{t.singleColumnActive}</strong>
                        <p>{t.singleColumnDesc}</p>
                     </div>
                  </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Column */}
                  <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">{t.mainColumn}</h3>
                      <div className="space-y-2 min-h-[100px] p-2 bg-slate-50 rounded-lg border border-dashed">
                          {(data.mainSections || DEFAULT_MAIN_SECTIONS).map((section, idx, arr) => (
                              <div key={section} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm">
                                  <span className="capitalize font-medium text-sm">{sectionNames[section] || section}</span>
                                  {!readOnly && (
                                      <div className="flex gap-1">
                                          <Button 
                                            variant="ghost" size="icon" className="h-7 w-7"
                                            disabled={idx === 0}
                                            onClick={() => {
                                                const currentMain = data.mainSections || DEFAULT_MAIN_SECTIONS;
                                                const newOrder = [...currentMain];
                                                [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                                                onChange({ ...data, mainSections: newOrder });
                                            }}
                                          >
                                              <ArrowUp className="w-3 h-3" />
                                          </Button>
                                          <Button 
                                            variant="ghost" size="icon" className="h-7 w-7"
                                            disabled={idx === arr.length - 1}
                                            onClick={() => {
                                                const currentMain = data.mainSections || DEFAULT_MAIN_SECTIONS;
                                                const newOrder = [...currentMain];
                                                [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                                                onChange({ ...data, mainSections: newOrder });
                                            }}
                                          >
                                              <ArrowDown className="w-3 h-3" />
                                          </Button>
                                          <Button 
                                            variant="ghost" size="icon" className="h-7 w-7 text-blue-600"
                                            title="Move to Sidebar"
                                            onClick={() => {
                                                const currentMain = data.mainSections || DEFAULT_MAIN_SECTIONS;
                                                const currentSidebar = data.sidebarSections || DEFAULT_SIDEBAR_SECTIONS;
                                                const newMain = currentMain.filter(s => s !== section);
                                                const newSidebar = [...currentSidebar, section];
                                                onChange({ ...data, mainSections: newMain, sidebarSections: newSidebar });
                                            }}
                                          >
                                              <ArrowRight className="w-3 h-3" />
                                          </Button>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">{t.sidebarOther}</h3>
                      <div className="space-y-2 min-h-[100px] p-2 bg-slate-50 rounded-lg border border-dashed">
                          {(data.sidebarSections || DEFAULT_SIDEBAR_SECTIONS).map((section, idx, arr) => (
                              <div key={section} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm">
                                  <span className="capitalize font-medium text-sm">{sectionNames[section] || section}</span>
                                  {!readOnly && (
                                      <div className="flex gap-1">
                                           <Button 
                                            variant="ghost" size="icon" className="h-7 w-7 text-blue-600"
                                            title="Move to Main"
                                            onClick={() => {
                                                const currentMain = data.mainSections || DEFAULT_MAIN_SECTIONS;
                                                const currentSidebar = data.sidebarSections || DEFAULT_SIDEBAR_SECTIONS;
                                                const newSidebar = currentSidebar.filter(s => s !== section);
                                                const newMain = [...currentMain, section];
                                                onChange({ ...data, mainSections: newMain, sidebarSections: newSidebar });
                                            }}
                                          >
                                              <ArrowLeft className="w-3 h-3" />
                                          </Button>
                                          <Button 
                                            variant="ghost" size="icon" className="h-7 w-7"
                                            disabled={idx === 0}
                                            onClick={() => {
                                                const currentSidebar = data.sidebarSections || DEFAULT_SIDEBAR_SECTIONS;
                                                const newOrder = [...currentSidebar];
                                                [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                                                onChange({ ...data, sidebarSections: newOrder });
                                            }}
                                          >
                                              <ArrowUp className="w-3 h-3" />
                                          </Button>
                                          <Button 
                                            variant="ghost" size="icon" className="h-7 w-7"
                                            disabled={idx === arr.length - 1}
                                            onClick={() => {
                                                const currentSidebar = data.sidebarSections || DEFAULT_SIDEBAR_SECTIONS;
                                                const newOrder = [...currentSidebar];
                                                [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                                                onChange({ ...data, sidebarSections: newOrder });
                                            }}
                                          >
                                              <ArrowDown className="w-3 h-3" />
                                          </Button>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

