
import React from 'react';
import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { MasterProfile } from '@/store/useProfileStore';

// Register standard fonts if needed, but for now relying on defaults or what's in CVDocument
// Ideally, font registration should happen at the root or commonly imported file.

interface TemplateProps {
  data: MasterProfile;
  themeColor: string;
  fontFamily: string;
  translations: Record<string, string>;
  language: string;
}

export const ModernTemplate = ({ data, themeColor, fontFamily, translations: t, language }: TemplateProps) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      fontFamily: fontFamily,
      position: 'relative',
      paddingTop: 30,
      paddingBottom: 30,
    },
    sidebarBackground: {
      position: 'absolute',
      top: -35, 
      left: 0,
      bottom: -35, 
      width: '32%',
      height: '115%', 
      backgroundColor: '#f1f5f9', // Slate-100 check if this should be dynamic? Standard Modern uses this.
      zIndex: -1,
    },
    sidebar: {
      width: '32%', 
      // Removed height: '100%' to allow flow
      paddingLeft: 20, 
      paddingRight: 15,
      // Vertical padding moved to page
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    main: {
      width: '68%',
      // Vertical padding moved to page
      paddingLeft: 20, 
      paddingRight: 35,
    },

    name: {
      fontSize: (data.fullName?.length || 0) > 18 ? 18 : 24,
      fontWeight: 'bold', 
      color: themeColor,
      marginBottom: 5,
      textTransform: 'uppercase', 
      letterSpacing: 1,
    },
    jobTitle: {
      fontSize: 14,
      color: '#475569',
      marginBottom: 20,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sectionTitleContainer: {
      borderBottomWidth: 1.5,
      borderBottomColor: themeColor,
      marginBottom: 15,
      paddingBottom: 5,
    },
    sectionTitleText: {
      fontSize: 12,
      fontWeight: 'heavy', 
      color: themeColor,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    sidebarTitleContainer: {
      borderBottomWidth: 1,
      borderBottomColor: '#d1d5db',
      marginBottom: 10,
      paddingBottom: 4,
    },
    sidebarTitleText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: themeColor,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    // ... Copying other styles relevant to Modern
     contactItem: {
      fontSize: 9,
      marginBottom: 8,
      color: '#1e293b',
      lineHeight: 1.3,
    },
     profileImageContainer: {
        width: 110,
        height: 110,
        minWidth: 110,
        maxWidth: 110,
        minHeight: 110,
        maxHeight: 110,
        borderRadius: 55,
        alignSelf: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: themeColor,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 55, // Explicitly match container
    },
     experienceBlock: {
      marginBottom: 15,
    },
    roleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2,
      gap: 10,
    },
    roleTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000000',
      flex: 1,
      marginRight: 10,
    },
    dateText: {
      fontSize: 9,
      color: '#475569',
      fontStyle: 'italic',
      minWidth: 80,
      textAlign: 'right',
      marginTop: 2,
    },
    companyText: {
      fontSize: 10,
      color: themeColor,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 5,
    },
    bullet: {
        width: 15,
        fontSize: 10,
        color: '#1e293b',
    },
    bulletContent: {
        fontSize: 10,
        flex: 1,
        lineHeight: 1.5,
        color: '#444444',
    },
    skillTag: {
      fontSize: 9,
      backgroundColor: '#e2e8f0',
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 8,
      paddingRight: 8,
      marginBottom: 6,
      marginRight: 6,
      color: '#334155',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
     descriptionText: {
      fontSize: 10,
      lineHeight: 1.5,
      color: '#444444',
      textAlign: 'justify',
      marginBottom: 4,
    },
    mainSection: {
      marginBottom: 15,
    },
     summaryText: {
      fontSize: 10,
      lineHeight: 1.6,
      color: '#444444',
      textAlign: 'justify',
      marginBottom: 5,
    },
     sidebarSection: {
      paddingBottom: 30, 
      flexDirection: 'column',
      width: '100%',
    },
  });

   const breakString = (str: string) => {
    return str.replace(/([@./_-])/g, '$1\u200B');
  };

  const hasText = (str: string | undefined | null) => {
      return str && str.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '').length > 0;
  };

  const renderSection = (sectionName: string, isSidebar: boolean) => {
      const containerStyle = isSidebar ? styles.sidebarSection : styles.mainSection;
      const titleContainerStyle = isSidebar ? styles.sidebarTitleContainer : styles.sectionTitleContainer;
      const titleTextStyle = isSidebar ? styles.sidebarTitleText : styles.sectionTitleText;

       switch (sectionName) {
          case 'summary':
              return data.summary ? (
                <View style={styles.mainSection} key="summary">
                    <Text style={styles.summaryText}>{data.summary}</Text>
                </View>
              ) : null;
          case 'experience':
              if (!data.experience || data.experience.length === 0) return null;
              return (
                <View style={styles.mainSection} key="experience">
                  <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitleText}>{t?.workExperience || "WORK EXPERIENCE"}</Text>
                  </View>
                  {data.experience && data.experience.length > 0 ? (
                      data.experience.map((exp, i) => (
                    <View key={i} style={styles.experienceBlock} wrap={false}>
                      <View style={styles.roleRow}>
                        <Text style={styles.roleTitle}>{exp.role || "No Role"}</Text>
                        <Text style={styles.dateText}>
                          {exp.startDate} - {exp.endDate || (language === 'Spanish' ? 'Actualidad' : language === 'French' ? 'Présent' : 'Present')}
                        </Text>
                      </View>
                      <Text style={styles.companyText}>
                        {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                      </Text>
                      {exp.description && (() => {
                          // Aggressive splitting to auto-bullet tasks separated by periods or newlines
                          const lines = exp.description
                            .replace(/\r\n|\r|\n/g, '\n')
                            // Split by period + space to handle paragraphs like "Task 1. Task 2."
                            .split(/(?:\r\n|\r|\n)|(?:\.\s+)/)
                            .map(l => {
                                // Clean leading bullets or dashes if user typed them
                                let clean = l.trim();
                                clean = clean.replace(/^[\u2022\u00b7\u2023\u2043\u25E6\u204C\u2219\-\*]\s*/, '');
                                // Remove trailing period if it was a sentence split
                                if (clean.endsWith('.')) clean = clean.slice(0, -1);
                                return clean;
                            })
                            .filter(l => l.length > 0);

                          if (lines.length === 0) return null;

                          return lines.map((line, lIdx) => (
                                <View key={lIdx} style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletContent}>{line + (line.endsWith('.') ? '' : '.')}</Text>
                                </View>
                          ));
                      })()}
                      {exp.highlights && exp.highlights.map((highlight, hIdx) => {
                          if (!hasText(highlight)) return null;
                          const cleanHighlight = highlight.trim().replace(/^[-*•]\s+/, '');
                          return (
                            <View key={hIdx} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletContent}>{cleanHighlight}</Text>
                            </View>
                          );
                      })}
                    </View>
                  ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#94a3b8'}}>No experience entries found in data</Text>}
                </View>
              );
          case 'projects':
              if (!data.projects || data.projects.length === 0) return null;
              return (
                <View style={styles.mainSection} key="projects">
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitleText}>{t.projects}</Text>
                    </View>
                    {data.projects && data.projects.length > 0 ? (
                        data.projects.map((proj, i) => (
                        <View key={i} style={styles.experienceBlock} wrap={false}>
                            <View style={styles.roleRow}>
                                <Text style={styles.roleTitle}>{proj.name}</Text>
                                {proj.url && <Text style={styles.dateText}>{breakString(proj.url)}</Text>}
                            </View>
                            <Text style={styles.descriptionText}>{proj.description}</Text>
                        </View>
                    ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#94a3b8'}}>No projects listed</Text>}
                </View>
              );
          case 'education':
              if (!data.education || data.education.length === 0) return null;
              return (
                <View style={styles.mainSection} key="education">
                  <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitleText}>{t.education}</Text>
                  </View>
                  {data.education && data.education.length > 0 ? (
                      data.education.map((edu, i) => (
                    <View key={i} style={styles.experienceBlock} wrap={false}>
                        <View style={styles.roleRow}>
                            <Text style={styles.roleTitle}>{edu.degree}</Text>
                            <Text style={styles.dateText}>
                                {edu.startDate} - {edu.endDate || (language === 'Spanish' ? 'Actualidad' : language === 'French' ? 'Présent' : 'Present')}
                            </Text>
                        </View>
                        <Text style={styles.companyText}>
                            {edu.school}{edu.location ? ` | ${edu.location}` : ''}
                        </Text>
                    </View>
                  ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#94a3b8'}}>No education listed</Text>}
                </View>
              );
           case 'languages':
                if (!data.languages || data.languages.length === 0) return null;
                return (
                  <View style={containerStyle} key="languages" wrap={false}>
                     <View style={titleContainerStyle}>
                         <Text style={titleTextStyle}>{t.languages}</Text>
                     </View>
                     {data.languages.map((lang, i) => (
                         <View key={i} style={{ marginBottom: 4 }}>
                             <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>{lang.language}</Text>
                             <Text style={{ fontSize: 9, color: '#666' }}>{lang.proficiency}</Text>
                         </View>
                     ))}
                  </View>
                );
           case 'skills':
                 if (!data.skills || data.skills.length === 0) return null;
                 return (
                     <View style={containerStyle} key="skills" wrap={false}>
                         <View style={titleContainerStyle}>
                             <Text style={titleTextStyle}>{t.skills}</Text>
                         </View>
                         <View style={[styles.skillsContainer, { marginBottom: 10 }]}>
                             {data.skills.map((skill, i) => (
                                 <Text key={i} style={styles.skillTag}>{skill}</Text>
                             ))}
                         </View>
                     </View>
                 );
           case 'certifications':
                 if (!data.certifications || data.certifications.length === 0) return null;
                 return (
                     <View style={containerStyle} key="certifications" wrap={false}>
                         <View style={titleContainerStyle}>
                             <Text style={titleTextStyle}>{t.certifications}</Text>
                         </View>
                         {data.certifications.map((cert, i) => (
                             <View key={i} style={{ marginBottom: 4 }}>
                                 <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{cert.name}</Text>
                                 <Text style={{ fontSize: 9, color: '#666' }}>{cert.issuer} {cert.date ? `(${cert.date})` : ''}</Text>
                             </View>
                         ))}
                     </View>
                 );
           case 'contact':
                // For Modern, contact is in Sidebar usually
                // Only return null if absolutely no contact info... but usually name/email are required.
                // Keeping it always rendered for now unless user really blanked everything.
                if (!data.email && !data.phone && !data.location && (!data.socialLinks || data.socialLinks.length === 0)) return null;
               return (
                   <View style={containerStyle} key="contact" wrap={false}>
                     <View style={titleContainerStyle}>
                         <Text style={titleTextStyle}>{t.contact}</Text>
                     </View>
                     {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
                     {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
                     {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
                     {data.socialLinks && data.socialLinks.map((link, i) => (
                         <Text key={i} style={styles.contactItem}>{breakString(link.url)}</Text>
                     ))}
                  </View>
                );
          default:
              return null;
      }
  }

  // Force static sections to avoid missing content due to bad AI data
  const mainSections = ['summary', 'experience', 'projects', 'education'];
  const sidebarSections = ['contact', 'languages', 'skills', 'certifications'];

  return (
    <Page size="A4" style={styles.page}>
         <View style={styles.sidebarBackground} fixed />
        <View style={styles.sidebar}>
            {data.picture && (
                <View style={styles.profileImageContainer}>
                    <Image 
                        src={data.picture} 
                        style={[
                            styles.profileImage, 
                            { transform: `scale(${data.pictureZoom || 1})` }
                        ]} 
                        // @ts-expect-error - Image alt prop requirement conflict with PDF renderer
                        alt="Profile Picture"
                    />
                </View>
            )}
            {sidebarSections.map(section => renderSection(section, true))}
        </View>
        <View style={styles.main}>
            <Text style={styles.name}>{data.fullName}</Text>
            <Text style={styles.jobTitle}>
                {data.title || data.experience?.[0]?.role || "Professional Profile"}
            </Text>
            {mainSections.map(section => renderSection(section, false))}
        </View>
    </Page>
  );
};
