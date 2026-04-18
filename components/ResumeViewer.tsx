"use client";

import { Resume } from "@/lib/types";
import { Sprite } from "./Sprite";
import styles from "./ResumeViewer.module.css";

interface ResumeViewerProps {
  resume: Resume;
  hideHeader?: boolean;
}

export function ResumeViewer({ resume, hideHeader }: ResumeViewerProps) {
  const { contact, experience, education, skills, interests } = resume.data;

  return (
    <div className={`panel-raised ${styles.container}`}>
      {!hideHeader && (
        <div className={styles.header}>
          <span>
            <Sprite name="document" /> Resume - {contact.name}
          </span>
        </div>
      )}
      <div className={`panel-sunken ${styles.scrollArea}`}>
        <div className={styles.resume}>
          {/* Contact Info */}
          <div className={styles.contactSection}>
            <h1 className={styles.candidateName}>{contact.name}</h1>
            <div className={styles.contactDetails}>
              <span>{contact.email}</span>
              <span className={styles.separator}>|</span>
              <span>{contact.phone}</span>
              <span className={styles.separator}>|</span>
              <span>{contact.location}</span>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Work Experience */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeader}>Work Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <div>
                    <span className={styles.jobTitle}>{exp.title}</span>
                    <span className={styles.company}> - {exp.company}</span>
                  </div>
                  <span className={styles.dates}>
                    {exp.startYear} – {exp.endYear}
                  </span>
                </div>
                <ul className={styles.bullets}>
                  {exp.bullets.map((bullet, j) => (
                    <li key={j} className={styles.bullet}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeader}>Education</h2>
            {education.map((edu, i) => (
              <div key={i} className={styles.educationItem}>
                <div className={styles.experienceHeader}>
                  <div>
                    <span className={styles.degree}>{edu.degree}</span>
                    <span className={styles.institution}>
                      {" "}
                      - {edu.institution}
                    </span>
                  </div>
                  <span className={styles.dates}>{edu.graduationYear}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeader}>Skills</h2>
            <div className={styles.skillsList}>
              {skills.map((skill, i) => (
                <span key={i} className={styles.skillItem}>
                  {skill}
                  {i < skills.length - 1 ? " · " : ""}
                </span>
              ))}
            </div>
          </section>

          {/* Interests */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeader}>Interests & Hobbies</h2>
            <p className={styles.interestsList}>{interests.join(", ")}</p>
          </section>

          {/* Footer */}
          <div className={styles.footer}>
            <em>References available upon request</em>
          </div>
        </div>
      </div>
    </div>
  );
}
