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
    'ai_match_analysis': 'AI Match Analysis',
    'based_on_job_desc': 'Based on job description',
    'match_score': 'Match Score',
    'missing_skills': 'Missing Skills',
    'missing_key_skills': 'Missing Key Skills',
    'no_missing_skills': 'Perfect match! No missing skills.',
    'key_strengths': 'Key Strengths',
    'ai_recommendation': 'AI Recommendation',
    
    // Resume Strength
    'resume_strength': 'Profile Completeness',
    'add_full_name': 'Add your full name',
    'add_email': 'Add your email address',
    'add_summary': 'Add a professional summary (50+ characters)',
    'add_experience_tip': 'Add at least one work experience',
    'add_education_tip': 'Add your education details',
    'add_skills_tip': 'Add at least 3 key skills',
    'improve_score': 'Improve your score:',
    'profile_optimized': 'Your profile is optimized!',
    
    // Download
    'download_pdf': 'Download PDF',

    // Auth
    'sign_in': 'Sign In',
    'sign_out': 'Sign Out',
    'create_account': 'Create Account',
    'welcome_back': 'Welcome back to CV-Match. Please enter your details.',
    'join_msg': 'Join CV-Match to sync your Master Profile securely to the cloud.',
    'full_name': 'Full Name',
    'email': 'Email',
    'password': 'Password',
    'signing_in': 'Signing in...',
    'creating_account': 'Creating account...',
    'no_account': 'Don\'t have an account?',
    'have_account': 'Already have an account?',
    'create_pwd': 'Create a strong password',

    // Mock Interview
    'practice_interview': 'Practice AI Mock Interview',
    'interview_desc': 'The AI will ask you questions based on your tailored CV and the target job description.',
    'ai_typing': 'Interviewer is typing...',
    'type_answer': 'Type your answer...'
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
    'ai_match_analysis': 'Análisis de Coincidencia por IA',
    'based_on_job_desc': 'Basado en la descripción del trabajo',
    'match_score': 'Puntuación de Coincidencia',
    'missing_skills': 'Habilidades Faltantes',
    'missing_key_skills': 'Habilidades Clave Faltantes',
    'no_missing_skills': '¡Coincidencia perfecta! Sin habilidades faltantes.',
    'key_strengths': 'Fortalezas Clave',
    'ai_recommendation': 'Recomendación de la IA',
    
    // Resume Strength
    'resume_strength': 'Completitud del Perfil',
    'add_full_name': 'Añade tu nombre completo',
    'add_email': 'Añade tu correo electrónico',
    'add_summary': 'Añade un resumen profesional (50+ caracteres)',
    'add_experience_tip': 'Añade al menos una experiencia laboral',
    'add_education_tip': 'Añade tu educación',
    'add_skills_tip': 'Añade al menos 3 habilidades clave',
    'improve_score': 'Mejora tu puntuación:',
    'profile_optimized': '¡Tu perfil está optimizado!',
    
    // Download
    'download_pdf': 'Descargar PDF',

    // Auth
    'sign_in': 'Iniciar Sesión',
    'sign_out': 'Cerrar Sesión',
    'create_account': 'Crear Cuenta',
    'welcome_back': 'Bienvenido a CV-Match. Por favor, introduce tus datos.',
    'join_msg': 'Únete a CV-Match para sincronizar tu Perfil Maestro de forma segura en la nube.',
    'full_name': 'Nombre Completo',
    'email': 'Correo Electrónico',
    'password': 'Contraseña',
    'signing_in': 'Iniciando sesión...',
    'creating_account': 'Creando cuenta...',
    'no_account': '¿No tienes una cuenta?',
    'have_account': '¿Ya tienes una cuenta?',
    'create_pwd': 'Crea una contraseña segura',

    // Mock Interview
    'practice_interview': 'Practicar Entrevista Falsa con IA',
    'interview_desc': 'La IA te hará preguntas basadas en tu CV adaptado y en la descripción del trabajo objetivo.',
    'ai_typing': 'El entrevistador está escribiendo...',
    'type_answer': 'Escribe tu respuesta...'
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
    'ai_match_analysis': 'Analyse de Correspondance IA',
    'based_on_job_desc': 'Basé sur la description du poste',
    'match_score': 'Score de Correspondance',
    'missing_skills': 'Compétences Manquantes',
    'missing_key_skills': 'Compétences Clés Manquantes',
    'no_missing_skills': 'Correspondance parfaite ! Aucune compétence manquante.',
    'key_strengths': 'Points Forts',
    'ai_recommendation': 'Recommandation de l\'IA',
    
    // Resume Strength
    'resume_strength': 'Complétude du Profil',
    'add_full_name': 'Ajoutez votre nom complet',
    'add_email': 'Ajoutez votre adresse e-mail',
    'add_summary': 'Ajoutez un résumé professionnel (50+ caractères)',
    'add_experience_tip': 'Ajoutez au moins une expérience professionnelle',
    'add_education_tip': 'Ajoutez vos études',
    'add_skills_tip': 'Ajoutez au moins 3 compétences clés',
    'improve_score': 'Améliorez votre score :',
    'profile_optimized': 'Votre profil est optimisé !',

    // Download
    'download_pdf': 'Télécharger le PDF',

    // Auth
    'sign_in': 'Se Connecter',
    'sign_out': 'Se Déconnecter',
    'create_account': 'Créer un Compte',
    'welcome_back': 'Bienvenue sur CV-Match. Veuillez entrer vos informations.',
    'join_msg': 'Rejoignez CV-Match pour synchroniser votre Profil Maître en toute sécurité sur le cloud.',
    'full_name': 'Nom Complet',
    'email': 'E-mail',
    'password': 'Mot de passe',
    'signing_in': 'Connexion en cours...',
    'creating_account': 'Création du compte...',
    'no_account': 'Vous n\'avez pas de compte ?',
    'have_account': 'Vous avez déjà un compte ?',
    'create_pwd': 'Créez un mot de passe fort',

    // Mock Interview
    'practice_interview': 'S\'entraîner à un Entretien avec l\'IA',
    'interview_desc': 'L\'IA vous posera des questions en fonction de votre CV adapté et de la description du poste ciblé.',
    'ai_typing': 'L\'interviewer est en train d\'écrire...',
    'type_answer': 'Tapez votre réponse...'
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
