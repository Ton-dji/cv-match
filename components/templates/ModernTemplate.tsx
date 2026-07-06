
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
    const fs = (size: number) => size * (data.fontSizeScale || 1.0);
  const sp = (space: number) => space * (data.lineSpacing || 1.0);
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      fontFamily: fontFamily,
      position: 'relative',
      paddingTop: sp(30),
      paddingBottom: sp(30),
    },
    sidebarBackground: {
      position: 'absolute',
      top: -35, 
      left: 0,
      bottom: -35, 
      width: '32%',
      height: 900, // Hardcoded to cover the full A4 page height
      backgroundColor: '#f1f5f9', // Slate-100 check if this should be dynamic? Standard Modern uses this.
      zIndex: -1,
    },
    sidebar: {
      position: 'absolute',
      left: 0,
      top: sp(30),
      width: '32%', 
      paddingLeft: sp(20), 
      paddingRight: sp(15),
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    main: {
      marginLeft: '32%',
      width: '68%',
      paddingLeft: sp(20), 
      paddingRight: sp(35),
    },

    name: {
      fontSize: fs((data.fullName?.length || 0) > 18 ? 18 : 24),
      fontWeight: 'bold', 
      color: themeColor,
      marginBottom: sp(5),
      textTransform: 'uppercase', 
      letterSpacing: 1,
    },
    jobTitle: {
      fontSize: fs(14),
      color: '#475569',
      marginBottom: sp(20),
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sectionTitleContainer: {
      borderBottomWidth: 1.5,
      borderBottomColor: themeColor,
      marginBottom: sp(15),
      paddingBottom: sp(5),
    },
    sectionTitleText: {
      fontSize: fs(12),
      fontWeight: 'heavy', 
      color: themeColor,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    sidebarTitleContainer: {
      borderBottomWidth: 1,
      borderBottomColor: '#d1d5db',
      marginBottom: sp(10),
      paddingBottom: sp(4),
    },
    sidebarTitleText: {
      fontSize: fs(11),
      fontWeight: 'bold',
      color: themeColor,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    // ... Copying other styles relevant to Modern
     contactItem: {
      fontSize: fs(9),
      marginBottom: sp(8),
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
        marginBottom: sp(20),
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
      marginBottom: sp(8),
    },
    roleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: sp(2),
      gap: sp(10),
    },
    roleTitle: {
      fontSize: fs(12),
      fontWeight: 'bold',
      color: '#000000',
      flex: 1,
      marginRight: sp(10),
    },
    dateText: {
      fontSize: fs(9),
      color: '#475569',
      fontStyle: 'italic',
      minWidth: 80,
      textAlign: 'right',
      marginTop: sp(2),
    },
    companyText: {
      fontSize: fs(10),
      color: themeColor,
      fontWeight: 'bold',
      marginBottom: sp(6),
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: sp(2),
        paddingLeft: sp(4),
    },
    bullet: {
        width: sp(10),
        fontSize: fs(10),
        color: '#1e293b',
    },
    bulletContent: {
        fontSize: fs(10),
        flex: 1,
        lineHeight: 1.5,
        color: '#444444',
    },
    skillTag: {
      fontSize: fs(9),
      backgroundColor: '#e2e8f0',
      paddingTop: sp(4),
      paddingBottom: sp(4),
      paddingLeft: sp(8),
      paddingRight: sp(8),
      marginBottom: sp(6),
      marginRight: sp(6),
      color: '#334155',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
     descriptionText: {
      fontSize: fs(10),
      lineHeight: 1.5,
      color: '#444444',
      textAlign: 'justify',
      marginBottom: sp(4),
    },
    mainSection: {
      marginBottom: sp(10),
    },
    summaryText: {
      fontSize: fs(10),
      lineHeight: 1.6,
      color: '#444444',
      textAlign: 'justify',
      marginBottom: sp(5),
    },
     sidebarSection: {
      paddingBottom: sp(30), 
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
                    <View key={i} style={styles.experienceBlock}>
                      <View style={styles.roleRow} wrap={false}>
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
                                <View key={lIdx} style={styles.bulletPoint} wrap={false}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletContent}>{line + (line.endsWith('.') ? '' : '.')}</Text>
                                </View>
                          ));
                      })()}
                      {exp.highlights && exp.highlights.map((highlight, hIdx) => {
                          if (!hasText(highlight)) return null;
                          const cleanHighlight = highlight.trim().replace(/^[-*•]\s+/, '');
                          if (!cleanHighlight) return null;
                          return (
                            <View key={hIdx} style={styles.bulletPoint} wrap={false}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletContent}>{cleanHighlight}</Text>
                            </View>
                          );
                      })}
                    </View>
                  ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#94a3b8'}}>No experience entries found in data</Text>}
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
                        <View key={i} style={styles.experienceBlock}>
                            <View style={styles.roleRow} wrap={false}>
                                <Text style={styles.roleTitle}>{proj.name}</Text>
                                {proj.url && <Text style={styles.dateText}>{breakString(proj.url)}</Text>}
                            </View>
                            <Text style={styles.descriptionText}>{proj.description}</Text>
                        </View>
                    ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#94a3b8'}}>No projects listed</Text>}
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
                    <View key={i} style={styles.experienceBlock}>
                        <View style={styles.roleRow} wrap={false}>
                            <Text style={styles.roleTitle}>{edu.degree}</Text>
                            <Text style={styles.dateText}>
                                {edu.startDate} - {edu.endDate || (language === 'Spanish' ? 'Actualidad' : language === 'French' ? 'Présent' : 'Present')}
                            </Text>
                        </View>
                        <Text style={styles.companyText}>
                            {edu.school}{edu.location ? ` | ${edu.location}` : ''}
                        </Text>
                    </View>
                  ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#94a3b8'}}>No education listed</Text>}
                </View>
              );
           case 'languages':
                if (!data.languages || data.languages.length === 0) return null;
                return (
                  <View style={containerStyle} key="languages">
                     <View style={titleContainerStyle}>
                         <Text style={titleTextStyle}>{t.languages}</Text>
                     </View>
                     {data.languages.map((lang, i) => (
                         <View key={i} style={{ marginBottom: 4 }}>
                             <Text style={{ fontSize: fs(9), fontWeight: 'bold', marginBottom: 2 }}>{lang.language}</Text>
                             <Text style={{ fontSize: fs(9), color: '#666' }}>{lang.proficiency}</Text>
                         </View>
                     ))}
                  </View>
                );
           case 'skills':
                 if (!data.skills || data.skills.length === 0) return null;
                 return (
                     <View style={containerStyle} key="skills">
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
                     <View style={containerStyle} key="certifications">
                         <View style={titleContainerStyle}>
                             <Text style={titleTextStyle}>{t.certifications}</Text>
                         </View>
                         {data.certifications.map((cert, i) => (
                             <View key={i} style={{ marginBottom: 4 }}>
                                 <Text style={{ fontSize: fs(9), fontWeight: 'bold' }}>{cert.name}</Text>
                                 <Text style={{ fontSize: fs(9), color: '#666' }}>{cert.issuer} {cert.date ? `(${cert.date})` : ''}</Text>
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
                   <View style={containerStyle} key="contact">
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
