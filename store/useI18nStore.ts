import { create } from 'zustand';

type Language = 'en' | 'es' | 'fr';

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & Global
    'app_title': 'CV-Match',
    'new_match': 'New Match',
    'profile_settings': 'Profile Settings',
    'master_profile': 'Master Profile',
    'cloud_sync_active': '● Cloud Sync Active',
    'auto_saved': '● Auto-saved locally',
    
    // Dashboard
    'dashboard_title': 'Member Dashboard',
    'dashboard_subtitle': 'Manage your Master Profile and create tailored CVs for your job applications.',
    'start_new_app': 'Start a New Application',
    'start_new_desc': 'Paste a Job Description, choose a language, and let AI rewrite your CV perfectly.',
    'go_to_editor': 'Go to Match Editor',
    'pro_tips': 'Pro Tips',
    'tip_1': 'Keep your Master Profile updated with all your skills.',
    'tip_2': 'Use bullet points for experience.',
    'tip_3': 'Generate a new CV for every specific job offer.',
    
    // Editor Page
    'match_editor': 'Match Editor',
    'job_details': 'Job Details',
    'target_language': 'Target Language',
    'job_description': 'Job Description',
    'job_description_placeholder': 'Paste the job description here...',
    'tailor_my_cv': 'Tailor My CV',
    'tailoring': 'Tailoring your CV...',
    'based_on_master': 'Based on your Master Profile.',
    'ai_will_rewrite': 'AI will rewrite summary, skills, and experience to match this job.',
    
    // Editor Tabs
    'manual_edit': 'Manual Edit',
    'design': 'Design',
    'pdf_preview': 'PDF Preview',
    
    // Form Sections
    'personal_info': 'Personal Information',
    'full_name': 'Full Name',
    'email': 'Email',
    'phone': 'Phone',
    'location': 'Location',
    'professional_summary': 'Professional Summary',
    'experience': 'Experience',
    'education': 'Education',
    'skills': 'Skills',
    'company': 'Company',
    'role': 'Role',
    'duration': 'Duration',
    'description': 'Description',
    'school': 'School',
    'degree': 'Degree',
    'year': 'Year',
    'add_experience': 'Add Experience',
    'add_education': 'Add Education',
    
    // Design Tab
    'choose_template': 'Choose Template',
    'theme_color': 'Theme Color',
    'typography': 'Typography',
    
    // PDF Button
    'import_pdf': 'Import Old CV (PDF)',
    'importing': 'Importing...',
    'profile_imported': 'Profile imported successfully!',
    
    // Analysis
    'match_analysis': 'Match Analysis',
    'match_score': 'Match Score',
    'missing_skills': 'Missing Skills',
    'key_strengths': 'Key Strengths',
    
    // Download
    'download_pdf': 'Download PDF'
  },
  es: {
    // Header & Global
    'app_title': 'CV-Match',
    'new_match': 'Nuevo CV',
    'profile_settings': 'Ajustes',
    'master_profile': 'Perfil Maestro',
    'cloud_sync_active': '● Sincronizado en la Nube',
    'auto_saved': '● Guardado localmente',
    
    // Dashboard
    'dashboard_title': 'Panel de Control',
    'dashboard_subtitle': 'Gestiona tu Perfil Maestro y crea currículums adaptados a tus ofertas de trabajo.',
    'start_new_app': 'Crear Nueva Aplicación',
    'start_new_desc': 'Pega una descripción de trabajo, elige el idioma y deja que la IA reescriba tu CV perfectamente.',
    'go_to_editor': 'Ir al Editor',
    'pro_tips': 'Consejos Pro',
    'tip_1': 'Mantén tu Perfil Maestro actualizado con todas tus habilidades.',
    'tip_2': 'Usa viñetas para tu experiencia.',
    'tip_3': 'Genera un nuevo CV para cada oferta específica.',
    
    // Editor Page
    'match_editor': 'Editor de CV',
    'job_details': 'Detalles del Empleo',
    'target_language': 'Idioma del CV',
    'job_description': 'Descripción del Puesto',
    'job_description_placeholder': 'Pega la descripción del puesto aquí...',
    'tailor_my_cv': 'Adaptar mi CV',
    'tailoring': 'Adaptando CV...',
    'based_on_master': 'Basado en tu Perfil Maestro.',
    'ai_will_rewrite': 'La IA reescribirá el resumen, habilidades y experiencia para coincidir con este puesto.',
    
    // Editor Tabs
    'manual_edit': 'Edición Manual',
    'design': 'Diseño',
    'pdf_preview': 'Vista Previa PDF',
    
    // Form Sections
    'personal_info': 'Información Personal',
    'full_name': 'Nombre Completo',
    'email': 'Correo',
    'phone': 'Teléfono',
    'location': 'Ubicación',
    'professional_summary': 'Resumen Profesional',
    'experience': 'Experiencia',
    'education': 'Educación',
    'skills': 'Habilidades',
    'company': 'Empresa',
    'role': 'Puesto',
    'duration': 'Duración',
    'description': 'Descripción',
    'school': 'Escuela',
    'degree': 'Título',
    'year': 'Año',
    'add_experience': 'Añadir Experiencia',
    'add_education': 'Añadir Educación',
    
    // Design Tab
    'choose_template': 'Elegir Plantilla',
    'theme_color': 'Color del Tema',
    'typography': 'Tipografía',
    
    // PDF Button
    'import_pdf': 'Importar CV (PDF)',
    'importing': 'Importando...',
    'profile_imported': '¡Perfil importado con éxito!',
    
    // Analysis
    'match_analysis': 'Análisis de Coincidencia',
    'match_score': 'Puntuación',
    'missing_skills': 'Habilidades Faltantes',
    'key_strengths': 'Puntos Fuertes',
    
    // Download
    'download_pdf': 'Descargar PDF'
  },
  fr: {
    // Header & Global
    'app_title': 'CV-Match',
    'new_match': 'Nouveau CV',
    'profile_settings': 'Paramètres',
    'master_profile': 'Profil Principal',
    'cloud_sync_active': '● Synchronisé',
    'auto_saved': '● Sauvegardé localement',
    
    // Dashboard
    'dashboard_title': 'Tableau de Bord',
    'dashboard_subtitle': 'Gérez votre Profil Principal et créez des CV adaptés pour vos candidatures.',
    'start_new_app': 'Nouvelle Candidature',
    'start_new_desc': 'Collez une offre d\'emploi, choisissez la langue, et l\'IA réécrira parfaitement votre CV.',
    'go_to_editor': 'Aller à l\'Éditeur',
    'pro_tips': 'Conseils Pro',
    'tip_1': 'Gardez votre Profil Principal à jour avec toutes vos compétences.',
    'tip_2': 'Utilisez des puces pour votre expérience.',
    'tip_3': 'Générez un nouveau CV pour chaque offre spécifique.',
    
    // Editor Page
    'match_editor': 'Éditeur de CV',
    'job_details': 'Détails du Poste',
    'target_language': 'Langue du CV',
    'job_description': 'Description du Poste',
    'job_description_placeholder': 'Collez la description du poste ici...',
    'tailor_my_cv': 'Adapter mon CV',
    'tailoring': 'Adaptation en cours...',
    'based_on_master': 'Basé sur votre Profil Principal.',
    'ai_will_rewrite': 'L\'IA réécrira le résumé, les compétences et l\'expérience pour correspondre au poste.',
    
    // Editor Tabs
    'manual_edit': 'Édition Manuelle',
    'design': 'Design',
    'pdf_preview': 'Aperçu PDF',
    
    // Form Sections
    'personal_info': 'Informations Personnelles',
    'full_name': 'Nom Complet',
    'email': 'Email',
    'phone': 'Téléphone',
    'location': 'Localisation',
    'professional_summary': 'Résumé Professionnel',
    'experience': 'Expérience',
    'education': 'Éducation',
    'skills': 'Compétences',
    'company': 'Entreprise',
    'role': 'Rôle',
    'duration': 'Durée',
    'description': 'Description',
    'school': 'École',
    'degree': 'Diplôme',
    'year': 'Année',
    'add_experience': 'Ajouter Expérience',
    'add_education': 'Ajouter Éducation',
    
    // Design Tab
    'choose_template': 'Choisir un Modèle',
    'theme_color': 'Couleur du Thème',
    'typography': 'Typographie',
    
    // PDF Button
    'import_pdf': 'Importer un CV (PDF)',
    'importing': 'Importation...',
    'profile_imported': 'Profil importé avec succès !',
    
    // Analysis
    'match_analysis': 'Analyse de Correspondance',
    'match_score': 'Score',
    'missing_skills': 'Compétences Manquantes',
    'key_strengths': 'Points Forts',
    
    // Download
    'download_pdf': 'Télécharger PDF'
  }
};

export const useI18nStore = create<I18nStore>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key: string) => {
    const lang = get().language;
    return translations[lang][key] || key;
  }
}));
