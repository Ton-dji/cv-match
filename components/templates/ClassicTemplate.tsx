
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

export const ClassicTemplate = ({ data, themeColor, fontFamily, translations: t, language }: TemplateProps) => {
  // Classic: Top-down, serif fonts usually (handled by fontFamily prop), centered header, horizontal lines
    const fs = (size: number) => size * (data.fontSizeScale || 1.0);
  const sp = (space: number) => space * (data.lineSpacing || 1.0);
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fdfbf7', // Warm classic paper
      fontFamily: fontFamily, // Times-Roman passed in usually
      paddingTop: sp(40),
      paddingBottom: sp(40),
      paddingLeft: sp(40),
      paddingRight: sp(40),
    },
    header: {
        alignItems: 'center',
        marginBottom: sp(25),
        borderBottomWidth: 2,
        borderBottomColor: themeColor,
        paddingBottom: sp(15),
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        minWidth: 100,
        maxWidth: 100,
        minHeight: 100,
        maxHeight: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: sp(10),
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 50,
    },
    name: {
      fontSize: fs((data.fullName?.length || 0) > 18 ? 22 : 28), // Larger
      fontFamily: fontFamily,
      fontWeight: 'bold', 
      color: '#000000',
      marginBottom: sp(5),
      textTransform: 'uppercase', 
    },
    jobTitle: {
      fontSize: fs(14),
      color: themeColor,
      marginBottom: sp(10),
      fontStyle: 'italic',
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: sp(15),
    },
    contactItem: {
      fontSize: fs(10),
      color: '#333333',
    },
    sectionTitle: {
        fontSize: fs(14),
        fontWeight: 'bold',
        color: themeColor,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        marginBottom: sp(10),
        marginTop: sp(10),
        textTransform: 'uppercase',
        textAlign: 'center', // Classic often centers section titles
        paddingBottom: sp(3),
    },
    sectionContent: {
        marginBottom: sp(5),
    },
    experienceBlock: {
      marginBottom: sp(15),
    },
    roleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: sp(2),
    },
    roleTitle: {
      fontSize: fs(12),
      fontWeight: 'bold',
      color: '#000000',
    },
    dateText: {
      fontSize: fs(10),
      color: '#000000', 
    },
    companyText: {
      fontSize: fs(11),
      color: '#444444', 
      fontStyle: 'italic',
      marginBottom: sp(4),
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: sp(2),
        paddingLeft: sp(10),
    },
    bullet: {
        marginRight: sp(4),
        fontSize: fs(10),
        color: '#000000',
    },
    bulletContent: {
        fontSize: fs(11), // Classic usually slightly readable
        flex: 1,
        lineHeight: 1.4,
        color: '#000000',
    },
    skillTag: {
        fontSize: fs(10),
        marginRight: sp(10),
        color: '#000000',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Center skills in classic? Or left? Let's try centered for distinct look
    },
     summaryText: {
      fontSize: fs(11),
      lineHeight: 1.5,
      color: '#000000',
      textAlign: 'center', // Center summary
      marginBottom: sp(5),
      paddingLeft: sp(20),
      paddingRight: sp(20),
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
                <View key="summary" style={styles.sectionContent}>
                     <Text style={styles.sectionTitle}>Profile Overview</Text>
                    <Text style={styles.summaryText}>{data.summary}</Text>
                </View>
              ) : null;
          case 'experience':
              return (
                <View key="experience" style={styles.sectionContent}>
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
                          if (!cleanHighlight) return null;
                          return (
                            <View key={hIdx} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletContent}>{cleanHighlight}</Text>
                            </View>
                          );
                      })}
                    </View>
                  ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666', textAlign:'center'}}>No experience entries found</Text>}
                </View>
              );
          case 'projects':
              return (
                <View key="projects" style={styles.sectionContent}>
                    <Text style={styles.sectionTitle}>{t.projects}</Text>
                    {data.projects && data.projects.length > 0 ? (
                        data.projects.map((proj, i) => (
                        <View key={i} style={styles.experienceBlock}>
                            <View style={styles.roleRow}>
                                <Text style={styles.roleTitle}>{proj.name}</Text>
                                {proj.url && <Text style={styles.dateText}>{breakString(proj.url)}</Text>}
                            </View>
                            <Text style={{fontSize: fs(11), fontStyle:'italic'}}>{proj.description}</Text>
                        </View>
                    ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666', textAlign:'center'}}>No projects listed</Text>}
                </View>
              );
          case 'education':
              return (
                <View key="education" style={styles.sectionContent}>
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
                  ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666', textAlign:'center'}}>No education listed</Text>}
                </View>
              );
           case 'languages':
                return (
                  <View key="languages" style={styles.sectionContent}>
                     <Text style={styles.sectionTitle}>{t.languages}</Text>
                     <View style={{flexDirection: 'row', justifyContent: 'center', gap: 15}}>
                        {data.languages && data.languages.length > 0 ? (
                            data.languages.map((lang, i) => (
                            <Text key={i} style={{fontSize: 10}}>{lang.language} ({lang.proficiency})</Text>
                        ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666'}}>No languages listed</Text>}
                     </View>
                  </View>
                );
           case 'skills':
                 return (
                     <View key="skills" style={[styles.sectionContent, { marginTop: sp(10), marginBottom: 50 }]}>
                         <Text style={styles.sectionTitle}>{t.skills}</Text>
                         <View style={styles.skillsContainer}>
                             {data.skills && data.skills.length > 0 ? (
                                 data.skills.map((skill, i) => (
                                 <Text key={i} style={styles.skillTag}>{skill}{i < data.skills.length - 1 ? ' • ' : ''}</Text> 
                             ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666'}}>No skills listed</Text>}
                         </View>
                     </View>
                 );
           case 'certifications':
                 return (
                     <View key="certifications" style={[styles.sectionContent, { marginTop: sp(30), marginBottom: 15 }]}>
                         <Text style={styles.sectionTitle}>{t.certifications}</Text>
                         {data.certifications && data.certifications.length > 0 ? (
                             data.certifications.map((cert, i) => (
                             <View key={i} style={{ marginBottom: sp(4), alignItems: 'center' }}>
                                 <Text style={{ fontSize: fs(11), fontWeight: 'bold' }}>{cert.name}</Text>
                                 <Text style={{ fontSize: fs(10), fontStyle: 'italic' }}>{cert.issuer} {cert.date ? `(${cert.date})` : ''}</Text>
                             </View>
                         ))) : <Text style={{fontSize: fs(10), fontStyle:'italic', color:'#666', textAlign:'center'}}>No certifications</Text>}
                     </View>
                 );
           case 'contact':
               return null; // Header
          default:
              return null;
      }
  }

  // Classic is also linear, but centered. 
  const mainSections = ['summary', 'experience', 'projects', 'education'];
  const sidebarSections = ['contact', 'languages', 'skills', 'certifications'];
  const allSections = [...mainSections, ...sidebarSections].filter(s => s !== 'contact');

  return (
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
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
                {data.phone && <Text style={styles.contactItem}>• {data.phone}</Text>}
                {data.location && <Text style={styles.contactItem}>• {data.location}</Text>}
                {data.socialLinks && data.socialLinks.map((link, i) => (
                    <Text key={i} style={styles.contactItem}>• {breakString(link.url)}</Text>
                ))}
             </View>
        </View>

        {allSections.map(section => renderSection(section))}
    </Page>
  );
};
