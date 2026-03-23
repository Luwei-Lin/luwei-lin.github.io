export interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  dates: string;
  honors: string;
}

export interface BulletEntry {
  id: string;
  text: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  dates: string;
  location: string;
  bullets: BulletEntry[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  dates: string;
  bullets: BulletEntry[];
}

export interface Skills {
  programming: string;
  databases: string;
  frameworks: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  credentialId: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: Skills;
  certifications: CertificationEntry[];
}

export const DEFAULT_RESUME_DATA: ResumeData = {
  personal: {
    name: 'Luwei (Luis) Lin',
    phone: '431-777-9095',
    email: 'luwei2@ualberta.ca',
    location: 'Edmonton, AB',
    linkedin: 'https://www.linkedin.com/in/luwei-lin',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'University of Alberta, Edmonton, AB, Canada',
      degree: 'Bachelor of Science, double major in Computing Science and Statistics',
      dates: 'Sept 2021 - Apr 2025',
      honors: "Dean's Honor Roll List",
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Avanti HCM Software, Calgary, AB',
      role: 'Software Development Engineer (Web Fullstack & PC), Full-time',
      dates: 'April 2024 - Present',
      location: 'Calgary, AB',
      bullets: [
        { id: 'b1', text: 'Deployed desktop app features as Jira tickets required in C# and .Net.' },
        { id: 'b2', text: 'Added new components to the front-end and implemented new endpoints and services in TypeScript and React Hooks.' },
        { id: 'b3', text: 'Experienced in state management with Redux, providing efficient state updates without unnecessary re-renders.' },
        { id: 'b4', text: 'Implemented database schemas and maintain system components integral to the functionality of the product.' },
      ],
    },
    {
      id: 'exp-2',
      company: 'Arista Networks, Routing Team, Vancouver, BC',
      role: 'Software Development Engineer, Full-time Intern',
      dates: 'Sep 2023 - Dec 2023',
      location: 'Vancouver, BC',
      bullets: [
        { id: 'b1', text: 'Implemented solutions to reduce route convergence time by C++ with DFS and BFS algorithms in the CI/CD pipeline.' },
        { id: 'b2', text: 'Optimized existing codes for the maintenance and fixed the Serv1, Serv2 bugs.' },
        { id: 'b3', text: 'Wrote test plan specifications for features and implemented automated test programs to execute the cases in Python3.' },
        { id: 'b4', text: 'Designed and deployed a .yaml script to define router configurations in Arista Cloud Service.' },
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'QRCode Event Management',
      dates: 'Jan 2024 - Apr 2024',
      bullets: [
        { id: 'b1', text: 'Implemented an android mobile app with Java and Firebase in Android Studio.' },
        { id: 'b2', text: 'Designed and deployed factory and template pattern in the backend service.' },
        { id: 'b3', text: 'Embed with Google Machine Learning Kit to operate image processing.' },
      ],
    },
  ],
  skills: {
    programming: 'C#, Python, C++, C, Java, JavaScript, TypeScript, R, Julia, HTML5',
    databases: 'PostgreSQL, MongoDB, SQLite3, Scikit-Learn, Pandas, NumPy, SpaCy, Tableau',
    frameworks: 'Linux, Perforce, Git, .Net, Flask, React, Node.js, Postman, Yarn, Npm, Socket.io, WebRTC',
  },
  certifications: [
    { id: 'cert-1', name: 'Google Data Analytics Professional Certificate', credentialId: '7A53U94GF9J7' },
    { id: 'cert-2', name: 'CCIE (Cisco Certified Enterprise Infrastructure)', credentialId: 'HC2CG8LKN3Q1QRW0' },
    { id: 'cert-3', name: 'CCNP (Cisco Certified Network Enterprise)', credentialId: 'VGWVGBJHBLF1QDC0' },
    { id: 'cert-4', name: 'CCNA (Cisco Certified Network Associate)', credentialId: '37WWCBNHLCV11H5D' },
  ],
};
