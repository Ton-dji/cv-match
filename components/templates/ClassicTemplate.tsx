
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
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fdfbf7', // Warm classic paper
      fontFamily: fontFamily, // Times-Roman passed in usually
      paddingTop: 40,
      paddingBottom: 40,
      paddingLeft: 40,
      paddingRight: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 25,
        borderBottomWidth: 2,
        borderBottomColor: themeColor,
        paddingBottom: 15,
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
        marginBottom: 10,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 50,
    },
    name: {
      fontSize: (data.fullName?.length || 0) > 18 ? 22 : 28, // Larger
      fontFamily: fontFamily,
      fontWeight: 'bold', 
      color: '#000000',
      marginBottom: 5,
      textTransform: 'uppercase', 
    },
    jobTitle: {
      fontSize: 14,
      color: themeColor,
      marginBottom: 10,
      fontStyle: 'italic',
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    contactItem: {
      fontSize: 10,
      color: '#333333',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themeColor,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        marginBottom: 10,
        marginTop: 10,
        textTransform: 'uppercase',
        textAlign: 'center', // Classic often centers section titles
        paddingBottom: 3,
    },
    sectionContent: {
        marginBottom: 5,
    },
    experienceBlock: {
      marginBottom: 15,
    },
    roleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    roleTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000000',
    },
    dateText: {
      fontSize: 10,
      color: '#000000', 
    },
    companyText: {
      fontSize: 11,
      color: '#444444', 
      fontStyle: 'italic',
      marginBottom: 4,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 10,
    },
    bullet: {
        width: 15,
        fontSize: 10,
        color: '#000000',
    },
    bulletContent: {
        fontSize: 11, // Classic usually slightly readable
        flex: 1,
        lineHeight: 1.4,
        color: '#000000',
    },
    skillTag: {
        fontSize: 10,
        marginRight: 10,
        color: '#000000',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Center skills in classic? Or left? Let's try centered for distinct look
    },
     summaryText: {
      fontSize: 11,
      lineHeight: 1.5,
      color: '#000000',
      textAlign: 'center', // Center summary
      marginBottom: 5,
      paddingLeft: 20,
      paddingRight: 20,
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
                  ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#666', textAlign:'center'}}>No experience entries found</Text>}
                </View>
              );
          case 'projects':
              return (
                <View key="projects" style={styles.sectionContent}>
                    <Text style={styles.sectionTitle}>{t.projects}</Text>
                    {data.projects && data.projects.length > 0 ? (
                        data.projects.map((proj, i) => (
                        <View key={i} style={styles.experienceBlock} wrap={false}>
                            <View style={styles.roleRow}>
                                <Text style={styles.roleTitle}>{proj.name}</Text>
                                {proj.url && <Text style={styles.dateText}>{breakString(proj.url)}</Text>}
                            </View>
                            <Text style={{fontSize: 11, fontStyle:'italic'}}>{proj.description}</Text>
                        </View>
                    ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#666', textAlign:'center'}}>No projects listed</Text>}
                </View>
              );
          case 'education':
              return (
                <View key="education" style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>{t.education}</Text>
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
                  ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#666', textAlign:'center'}}>No education listed</Text>}
                </View>
              );
           case 'languages':
                return (
                  <View key="languages" style={styles.sectionContent} wrap={false}>
                     <Text style={styles.sectionTitle}>{t.languages}</Text>
                     <View style={{flexDirection: 'row', justifyContent: 'center', gap: 15}}>
                        {data.languages && data.languages.length > 0 ? (
                            data.languages.map((lang, i) => (
                            <Text key={i} style={{fontSize: 10}}>{lang.language} ({lang.proficiency})</Text>
                        ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#666'}}>No languages listed</Text>}
                     </View>
                  </View>
                );
           case 'skills':
                 return (
                     <View key="skills" style={[styles.sectionContent, { marginTop: 10, marginBottom: 50 }]} wrap={false}>
                         <Text style={styles.sectionTitle}>{t.skills}</Text>
                         <View style={styles.skillsContainer}>
                             {data.skills && data.skills.length > 0 ? (
                                 data.skills.map((skill, i) => (
                                 <Text key={i} style={styles.skillTag}>{skill}{i < data.skills.length - 1 ? ' • ' : ''}</Text> 
                             ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#666'}}>No skills listed</Text>}
                         </View>
                     </View>
                 );
           case 'certifications':
                 return (
                     <View key="certifications" style={[styles.sectionContent, { marginTop: 30, marginBottom: 15 }]} wrap={false}>
                         <Text style={styles.sectionTitle}>{t.certifications}</Text>
                         {data.certifications && data.certifications.length > 0 ? (
                             data.certifications.map((cert, i) => (
                             <View key={i} style={{ marginBottom: 4, alignItems: 'center' }}>
                                 <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{cert.name}</Text>
                                 <Text style={{ fontSize: 10, fontStyle: 'italic' }}>{cert.issuer} {cert.date ? `(${cert.date})` : ''}</Text>
                             </View>
                         ))) : <Text style={{fontSize: 10, fontStyle:'italic', color:'#666', textAlign:'center'}}>No certifications</Text>}
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
