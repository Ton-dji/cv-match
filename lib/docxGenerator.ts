import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { MasterProfile } from '@/store/useProfileStore';

export const generateDocx = async (profile: MasterProfile, fileName: string) => {
  const children = [];

  // 1. Header (Name & Contact)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: profile.fullName || 'Name',
          bold: true,
          size: 48, // 24pt
        }),
      ],
    })
  );

  if (profile.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: profile.title,
            size: 28, // 14pt
            color: '555555',
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  const contactInfo = [profile.email, profile.phone, profile.location].filter(Boolean).join(' | ');
  if (contactInfo) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactInfo,
            size: 20, // 10pt
          }),
        ],
        spacing: { after: 400 },
      })
    );
  }

  // 2. Summary
  if (profile.summary) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'Professional Summary', bold: true })],
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: profile.summary,
            size: 22, // 11pt
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // 3. Experience
  if (profile.experience && profile.experience.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'Experience', bold: true })],
        spacing: { before: 200, after: 100 },
      })
    );

    profile.experience.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role || 'Role', bold: true, size: 24 }),
            new TextRun({ text: ` at ${exp.company || 'Company'}`, size: 24 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.startDate} - ${exp.endDate} | ${exp.location}`, size: 20, italics: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.description || '', size: 22 })],
          spacing: { after: 100 },
        })
      );

      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach((highlight) => {
          children.push(
            new Paragraph({
              text: highlight,
              bullet: { level: 0 },
              size: 22,
            })
          );
        });
      }
      children.push(new Paragraph({ spacing: { after: 200 } })); // Spacer
    });
  }

  // 4. Education
  if (profile.education && profile.education.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'Education', bold: true })],
        spacing: { before: 200, after: 100 },
      })
    );

    profile.education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree || 'Degree', bold: true, size: 24 }),
            new TextRun({ text: `, ${edu.school || 'School'}`, size: 24 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.startDate} - ${edu.endDate} | ${edu.location}`, size: 20, italics: true }),
          ],
          spacing: { after: 200 },
        })
      );
    });
  }

  // 5. Skills
  if (profile.skills && profile.skills.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'Skills', bold: true })],
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: profile.skills.join(' • '), size: 22 })],
        spacing: { after: 200 },
      })
    );
  }

  // Generate Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName.endsWith('.docx') ? fileName : `${fileName}.docx`);
};
