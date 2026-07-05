
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

export const MinimalistTemplate = ({ data, themeColor, fontFamily, translations: t, language }: TemplateProps) => {
    const fs = (size: number) => size * (data.fontSizeScale || 1.0);
  const sp = (space: number) => space * (data.lineSpacing || 1.0);
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      fontFamily: fontFamily,
      paddingTop: sp(35),
      paddingBottom: sp(35),
      paddingLeft: sp(35), // Balanced padding for minimalist
      paddingRight: sp(35),
      position: 'relative', 
    },
    main: {
      width: '100%',
    },
    name: {
      fontSize: (data.fullName?.length || 0) > 18 ? 18 : 24,
      fontWeight: 'bold', 
      color: themeColor,
      marginBottom: sp(5),
      textTransform: 'uppercase', // Often minimalists like clean uppercase or sentence case, stick to existing
      letterSpacing: 1,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        minWidth: 100,
        maxWidth: 100,
        minHeight: 100,
        maxHeight: 100,
        borderRadius: 50,
        alignSelf: 'center', // Or flex-start depending on minimalist layout? Center is safer for now.
        marginBottom: sp(10),
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 50,
    },
    jobTitle: {
      fontSize: fs(14),
      color: '#666666',
      marginBottom: sp(10),
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: sp(15),
        marginBottom: sp(20),
        borderBottomWidth: 1, // Separator
        borderBottomColor: '#eeeeee',
        paddingBottom: sp(15),
    },
    contactItem: {
      fontSize: fs(9),
      color: '#444444',
    },
    sectionTitle: { // Minimalist title
      fontSize: fs(16), // Slightly larger
      fontWeight: 'bold', 
      color: themeColor,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: sp(10),
      marginTop: sp(10),
    },
    experienceBlock: {
      marginBottom: sp(20),
    },
    roleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: sp(4),
    },
    roleTitle: {
      fontSize: fs(12),
      fontWeight: 'bold',
      color: '#000000',
    },
    dateText: {
      fontSize: fs(10),
      color: '#666666',
    },
    companyText: {
      fontSize: fs(10),
      color: '#333333',
      fontStyle: 'italic',
      marginBottom: sp(8),
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: sp(3),
        paddingLeft: sp(0), 
    },
    bullet: {
        marginRight: sp(4),
        fontSize: fs(10),
        color: themeColor, // Use theme color for bullets
        textAlign: 'center',
    },
    bulletContent: {
        fontSize: fs(10),
        flex: 1,
        lineHeight: 1.6,
        color: '#333333',
    },
    skillTag: {
      fontSize: fs(9),
      marginRight: sp(10),
      marginBottom: sp(6),
      color: '#333333',
      borderBottomWidth: 1, // Underline instead of box for minimalist
      borderBottomColor: '#ddd',
      paddingBottom: sp(2),
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    summaryText: {
      fontSize: fs(10),
      lineHeight: 1.6,
      color: '#333333',
      textAlign: 'justify',
      marginBottom: sp(5),
    },
  });

   const breakString = (str: string) => {
    return str.replace(/([@./_-])/g, '$1\u200B');
  };

  const hasText = (str: string | undefined | null) => {
      return str && str.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '').length > 0;
  };

  const renderSection = (sectionName: string) => {
       switch (sectionName) {
          case 'summary':
              return data.summary ? (
                <View key="summary" style={{ marginBottom: 10 }}>
                    <Text style={styles.sectionTitle}>Profile</Text> {/* Often called Profile in minimalist */}
                    <Text style={styles.summaryText}>{data.summary}</Text>
                </View>
              ) : null;
          case 'experience':
              return (
                <View key="experience" style={{ marginBottom: 20 }}>
                  <Text style={styles.sectionTitle}>{t?.workExperience || "WORK EXPERIENCE"}</Text>
                  {data.experience && data.experience.length > 0 ? (
                      data.experience.map((exp, i) => (
                    <View key={i} style={styles.experienceBlock}>
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
                          const lines = exp.description
                            .replace(/\r\n|\r|\n/g, '\n')
                            .split(/(?:\r\n|\r|\n)|(?:\.\s+)/)
                            .map(l => {
                                let clean = l.trim();
                                clean = clean.replace(/^[\u2022\u00b7\u2023\u2043\u25E6\u204C\u2219\-\*]\s*/, '');
                                if (clean.endsWith('.')) clean = clean.slice(0, -1);
                                return clean;
                            })
                            .filter(l => l.length > 0);

                          if (lines.length === 0) return null;

                          return lines.map((line, lIdx) => (
                                <View key={lIdx} style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletContent}>{line + '.'}</Text>
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
                  ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666'}}>No experience entries found</Text>}
                </View>
              );
          case 'projects':
              return (
                <View key="projects" style={{ marginBottom: 20 }}>
                    <Text style={styles.sectionTitle}>{t.projects}</Text>
                    {data.projects && data.projects.length > 0 ? (
                        data.projects.map((proj, i) => (
                        <View key={i} style={styles.experienceBlock}>
                            <View style={styles.roleRow}>
                                <Text style={styles.roleTitle}>{proj.name}</Text>
                                {proj.url && <Text style={styles.dateText}>{breakString(proj.url)}</Text>}
                            </View>
                            <Text style={{fontSize: fs(10), lineHeight: 1.6, color: '#333'}}>{proj.description}</Text>
                        </View>
                    ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666'}}>No projects listed</Text>}
                </View>
              );
          case 'education':
              return (
                <View key="education" style={{ marginBottom: 20 }}>
                  <Text style={styles.sectionTitle}>{t.education}</Text>
                  {data.education && data.education.length > 0 ? (
                      data.education.map((edu, i) => (
                    <View key={i} style={styles.experienceBlock}>
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
                  ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666'}}>No education listed</Text>}
                </View>
              );
           case 'languages':
                return (
                  <View key="languages" style={{ marginBottom: 20 }}>
                     <Text style={styles.sectionTitle}>{t.languages}</Text>
                     <View style={{ flexDirection: 'row', gap: sp(20), flexWrap: 'wrap' }}>
                        {data.languages && data.languages.length > 0 ? (
                            data.languages.map((lang, i) => (
                            <View key={i}>
                                <Text style={{ fontSize: fs(10), fontWeight: 'bold' }}>{lang.language}: <Text style={{fontWeight: 'normal', color: '#666'}}>{lang.proficiency}</Text></Text>
                            </View>
                        ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666'}}>No languages listed</Text>}
                     </View>
                  </View>
                );
           case 'skills':
                 return (
                     <View key="skills" style={{ marginBottom: 50 }}>
                         <Text style={styles.sectionTitle}>{t.skills}</Text>
                         <View style={styles.skillsContainer}>
                             {data.skills && data.skills.length > 0 ? (
                                 data.skills.map((skill, i) => (
                                 <Text key={i} style={styles.skillTag}>{skill}</Text>
                             ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666'}}>No skills listed</Text>}
                         </View>
                     </View>
                 );
           case 'certifications':
                 return (
                     <View key="certifications" style={{ marginBottom: sp(25), marginTop: 20 }}>
                         <Text style={styles.sectionTitle}>{t.certifications}</Text>
                         {data.certifications && data.certifications.length > 0 ? (
                             data.certifications.map((cert, i) => (
                             <View key={i} style={{ marginBottom: 6 }}>
                                 <Text style={{ fontSize: fs(10), fontWeight: 'bold' }}>{cert.name}</Text>
                                 <Text style={{ fontSize: fs(10), color: '#666' }}>{cert.issuer} {cert.date ? `(${cert.date})` : ''}</Text>
                             </View>
                         ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666'}}>No certifications</Text>}
                     </View>
                 );
           case 'contact':
               // No-op, handled in header
               return null;
          default:
              return null;
      }
  }

  // Minimalist uses a linear flow, merging main/sidebar into one list
  // excluding contact which is in header
  const mainSections = ['summary', 'experience', 'projects', 'education'];
  const sidebarSections = ['contact', 'languages', 'skills', 'certifications'];
  const allSections = [...mainSections, ...sidebarSections].filter(s => s !== 'contact');

  return (
    <Page size="A4" style={styles.page}>
        <View style={styles.main}>
           {/* Minimalist Header */}
           <View style={{ marginBottom: 20 }}>
                {data.picture && (
                     <View style={styles.profileImageContainer}>
                         <Image 
                            src={data.picture} 
                            style={styles.profileImage}
                            // @ts-expect-error - Image alt prop requirement conflict with PDF renderer
                            alt="Profile Picture"
                        />
                    </View>
                )}
                <Text style={styles.name}>{data.fullName}</Text>
                <Text style={styles.jobTitle}>
                    {data.title || data.experience?.[0]?.role || "Professional Profile"}
                </Text>
                
                <View style={styles.contactRow}>
                    {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
                    {data.phone && (
                        <>
                             <Text style={{ fontSize: fs(9), color: '#ddd' }}>|</Text>
                             <Text style={styles.contactItem}>{data.phone}</Text>
                        </>
                    )}
                    {data.location && (
                        <>
                            <Text style={{ fontSize: fs(9), color: '#ddd' }}>|</Text>
                            <Text style={styles.contactItem}>{data.location}</Text>
                        </>
                    )}
                    {data.socialLinks && data.socialLinks.map((link, i) => (
                         <React.Fragment key={i}>
                            <Text style={{ fontSize: fs(9), color: '#ddd' }}>|</Text>
                            <Text style={styles.contactItem}>{breakString(link.url)}</Text>
                         </React.Fragment>
                     ))}
                </View>
           </View>

            {allSections.map(section => renderSection(section))}
        </View>
    </Page>
  );
};
