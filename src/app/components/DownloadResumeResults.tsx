import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Resume } from "lib/redux/types";

const convertToCSV = (resume: Resume): string => {
  const rows = [];
  
  // Add profile data
  rows.push(['Profile']);
  rows.push(['Name', resume.profile.name]);
  rows.push(['Email', resume.profile.email]);
  rows.push(['Phone', resume.profile.phone]);
  rows.push(['Location', resume.profile.location]);
  rows.push(['URL', resume.profile.url]);
  rows.push(['Summary', resume.profile.summary]);
  rows.push([]);

  // Add education data
  rows.push(['Education']);
  resume.educations.forEach(edu => {
    rows.push(['School', edu.school]);
    rows.push(['Degree', edu.degree]);
    rows.push(['GPA', edu.gpa]);
    rows.push(['Date', edu.date]);
    rows.push(['Descriptions', ...edu.descriptions]);
    rows.push([]);
  });

  // Add work experience data
  rows.push(['Work Experience']);
  resume.workExperiences.forEach(work => {
    rows.push(['Company', work.company]);
    rows.push(['Job Title', work.jobTitle]);
    rows.push(['Date', work.date]);
    rows.push(['Descriptions', ...work.descriptions]);
    rows.push([]);
  });

  // Add projects data
  if (resume.projects.length > 0) {
    rows.push(['Projects']);
    resume.projects.forEach(project => {
      rows.push(['Project', project.project]);
      rows.push(['Date', project.date]);
      rows.push(['Descriptions', ...project.descriptions]);
      rows.push([]);
    });
  }

  // Add skills data
  rows.push(['Skills']);
  rows.push(['Featured Skills', ...resume.skills.featuredSkills.map(skill => `${skill.skill} (${skill.rating})`)]);
  rows.push(['Other Skills', ...resume.skills.descriptions]);

  return rows.map(row => row.join(',')).join('\n');
};

export const DownloadResumeResults = ({ resume }: { resume: Resume }) => {
  const downloadAsCSV = () => {
    const csv = convertToCSV(resume);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.profile.name || 'resume'}-parsed-results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={downloadAsCSV}
        className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Download Results as CSV
      </button>
    </div>
  );
}; 