import React from 'react';
import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { MasterProfile } from '@/store/useProfileStore';

interface TemplateProps {
  data: MasterProfile;
  themeColor: string;
  fontFamily: string;
  translations: Record<string, string>;
  language: string;
}

export const ExecutiveTemplate = ({ data, themeColor, fontFamily, translations: t, language }: TemplateProps) => {
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
    header: {
      backgroundColor: themeColor,
      color: '#FFFFFF',
      padding: sp(30),
      marginTop: sp(-30),
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: 'hidden',
      border: '3px solid #FFFFFF',
      marginRight: sp(20),
    },
    profileImage: {
      objectFit: 'cover',
    },
    headerTextContainer: {
      flex: 1,
    },
    name: {
      fontSize: fs((data.fullName?.length || 0) > 18 ? 24 : 32),
      fontWeight: 'bold', 
      marginBottom: sp(5),
      textTransform: 'uppercase', 
      letterSpacing: 1.5,
    },
    jobTitle: {
      fontSize: fs(14),
      fontWeight: 'light',
      marginBottom: sp(10),
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    headerContact: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: sp(15),
      marginTop: sp(10),
      paddingTop: sp(10),
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerContactText: {
      fontSize: fs(9),
    },
    body: {
      flexDirection: 'row',
      padding: sp(30),
      paddingTop: sp(20),
    },
    sidebar: {
      width: '32%', 
      paddingRight: sp(20),
    },
    main: {
      width: '68%',
      paddingLeft: sp(20), 
      borderLeftWidth: 1,
      borderLeftColor: '#e2e8f0',
    },
    sectionTitleContainer: {
      borderBottomWidth: 2,
      borderBottomColor: themeColor,
      marginBottom: sp(12),
      paddingBottom: sp(4),
    },
    sectionTitleText: {
      fontSize: fs(13),
      fontWeight: 'bold', 
      color: themeColor,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    sidebarTitleContainer: {
      marginBottom: sp(10),
      paddingBottom: sp(2),
      borderBottomWidth: 1,
      borderBottomColor: '#cbd5e1',
    },
    sidebarTitleText: {
      fontSize: fs(12),
      fontWeight: 'bold',
      color: themeColor,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    experienceBlock: {
      marginBottom: sp(15),
    },
    roleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: sp(3),
      gap: sp(10),
    },
    roleTitle: {
      fontSize: fs(11),
      fontWeight: 'bold',
      color: '#1e293b',
      flex: 1,
      marginRight: sp(10),
    },
    dateText: {
      fontSize: fs(9),
      color: '#64748b',
      minWidth: 85,
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
        marginBottom: sp(3),
    },
    bullet: {
        width: sp(10),
        fontSize: fs(10),
        color: themeColor,
    },
    bulletContent: {
        fontSize: fs(10),
        flex: 1,
        lineHeight: 1.5,
        color: '#475569',
    },
    skillTag: {
      fontSize: fs(9),
      backgroundColor: '#f1f5f9',
      paddingTop: sp(4),
      paddingBottom: sp(4),
      paddingLeft: sp(8),
      paddingRight: sp(8),
      marginBottom: sp(6),
      marginRight: sp(6),
      color: '#334155',
      borderRadius: 4,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    descriptionText: {
      fontSize: fs(10),
      lineHeight: 1.5,
      color: '#475569',
      marginBottom: sp(4),
    },
    mainSection: {
      marginBottom: sp(20),
    },
    summaryText: {
      fontSize: fs(10),
      lineHeight: 1.6,
      color: '#334155',
      textAlign: 'justify',
    },
    sidebarSection: {
      marginBottom: sp(20), 
    },
    sidebarItem: {
      marginBottom: sp(8),
    },
    sidebarItemTitle: {
      fontSize: fs(10),
      fontWeight: 'bold',
      color: '#334155',
      marginBottom: sp(2),
    },
    sidebarItemSubtitle: {
      fontSize: fs(9),
      color: '#64748b',
    },
  });

  const breakString = (str: string) => str.replace(/([@./_-])/g, '$1\u200B');
  const hasText = (str: string | undefined | null) => str && str.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '').length > 0;

  const renderSection = (sectionName: string, isSidebar: boolean) => {
      const containerStyle = isSidebar ? styles.sidebarSection : styles.mainSection;
      const titleContainerStyle = isSidebar ? styles.sidebarTitleContainer : styles.sectionTitleContainer;
      const titleTextStyle = isSidebar ? styles.sidebarTitleText : styles.sectionTitleText;

       switch (sectionName) {
          case 'summary':
              return data.summary ? (
                <View style={containerStyle} key="summary">
                    {isSidebar && (
                      <View style={titleContainerStyle}>
                        <Text style={titleTextStyle}>{t.summary || "PROFILE"}</Text>
                      </View>
                    )}
                    <Text style={styles.summaryText}>{data.summary}</Text>
                </View>
              ) : null;
          case 'experience':
              if (!data.experience || data.experience.length === 0) return null;
              return (
                <View style={containerStyle} key="experience">
                  <View style={titleContainerStyle}>
                      <Text style={titleTextStyle}>{t?.workExperience || "WORK EXPERIENCE"}</Text>
                  </View>
                  {data.experience.map((exp, i) => (
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
                          const lines = exp.description
                            .replace(/\r\n|\r|\n/g, '\n')
                            .split(/(?:\r\n|\r|\n)|(?:\.\s+)/)
                            .map(l => {
                                let clean = l.trim().replace(/^[\u2022\u00b7\u2023\u2043\u25E6\u204C\u2219\-\*]\s*/, '');
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
                  ))}
                </View>
              );
          case 'projects':
              if (!data.projects || data.projects.length === 0) return null;
              return (
                <View style={containerStyle} key="projects">
                    <View style={titleContainerStyle}>
                        <Text style={titleTextStyle}>{t.projects}</Text>
                    </View>
                    {data.projects.map((proj, i) => (
                        <View key={i} style={styles.experienceBlock}>
                            <View style={styles.roleRow} wrap={false}>
                                <Text style={styles.roleTitle}>{proj.name}</Text>
                                {proj.url && <Text style={styles.dateText}>{breakString(proj.url)}</Text>}
                            </View>
                            <Text style={styles.descriptionText}>{proj.description}</Text>
                        </View>
                    ))}
                </View>
              );
          case 'education':
              if (!data.education || data.education.length === 0) return null;
              return (
                <View style={containerStyle} key="education">
                  <View style={titleContainerStyle}>
                      <Text style={titleTextStyle}>{t.education}</Text>
                  </View>
                  {data.education.map((edu, i) => (
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
                  ))}
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
                         <View key={i} style={styles.sidebarItem}>
                             <Text style={styles.sidebarItemTitle}>{lang.language}</Text>
                             <Text style={styles.sidebarItemSubtitle}>{lang.proficiency}</Text>
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
                         <View style={styles.skillsContainer}>
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
                             <View key={i} style={styles.sidebarItem}>
                                 <Text style={styles.sidebarItemTitle}>{cert.name}</Text>
                                 <Text style={styles.sidebarItemSubtitle}>{cert.issuer} {cert.date ? `(${cert.date})` : ''}</Text>
                             </View>
                         ))}
                     </View>
                 );
           case 'contact':
                // Handled in header for Executive Template
               return null;
          default:
              return null;
      }
  }

  const mainSections = data.mainSections || ['summary', 'experience', 'projects', 'education'];
  const sidebarSections = data.sidebarSections || ['contact', 'languages', 'skills', 'certifications'];

  // Filter out contact from sidebar since we render it in the header
  const sidebarToRender = sidebarSections.filter(s => s !== 'contact');

  return (
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
             {data.picture && (
                <View style={styles.profileImageContainer}>
                    <Image 
                        src={data.picture} 
                        style={[styles.profileImage, {
                            width: 100 * (data.pictureZoom || 1),
                            height: 100 * (data.pictureZoom || 1),
                        }]} 
                        // @ts-expect-error - Image alt prop requirement conflict with PDF renderer
                        alt="Profile Picture"
                    />
                </View>
            )}
            <View style={styles.headerTextContainer}>
                <Text style={styles.name}>{data.fullName}</Text>
                <Text style={styles.jobTitle}>
                    {data.title || data.experience?.[0]?.role || "Professional Profile"}
                </Text>
                <View style={styles.headerContact}>
                    {data.email && <Text style={styles.headerContactText}>{data.email}</Text>}
                    {data.phone && <Text style={styles.headerContactText}>{data.phone}</Text>}
                    {data.location && <Text style={styles.headerContactText}>{data.location}</Text>}
                    {data.socialLinks && data.socialLinks.map((link, i) => (
                        <Text key={i} style={styles.headerContactText}>{breakString(link.url)}</Text>
                    ))}
                </View>
            </View>
        </View>

        <View style={styles.body}>
            <View style={styles.sidebar}>
                {sidebarToRender.map(section => renderSection(section, true))}
            </View>
            <View style={styles.main}>
                {mainSections.map(section => renderSection(section, false))}
            </View>
        </View>
    </Page>
  );
};
