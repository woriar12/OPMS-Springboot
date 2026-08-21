import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { Lock, User, Save, CheckCircle2, AlertCircle, Link as LinkIcon, Code, Globe, Github, Linkedin, FileText } from 'lucide-react';

export const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Editable Career Profile Form State
  const [resumeUrl, setResumeUrl] = useState('');
  const [skills, setSkills] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await studentService.getProfile();
      setProfile(data);
      setResumeUrl(data.resumeUrl || '');
      setSkills(data.skills || '');
      setGithubUrl(data.githubUrl || '');
      setLinkedinUrl(data.linkedinUrl || '');
      setPortfolioUrl(data.portfolioUrl || '');
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveCareerProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const updated = await studentService.updateCareerProfile({
        resumeUrl,
        skills,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
      });
      setProfile(updated);
      setSuccess('Career profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update career profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-slate-400">
        Loading student profile data...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Student Profile & Credentials</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review institutional master records and manage your placement career portfolio.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          {error}
        </div>
      )}

      {/* SECTION 1: ADMIN-CONTROLLED MASTER DATA (READ-ONLY) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Master Profile</h2>
              <p className="text-xs text-slate-500">Read-Only data verified by College Administration</p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-500" /> Protected Master Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Student Full Name</label>
            <input
              type="text"
              readOnly
              value={profile?.studentName || ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Register Number</label>
            <input
              type="text"
              readOnly
              value={profile?.registerNumber || ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-blue-700 font-bold font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Roll Number</label>
            <input
              type="text"
              readOnly
              value={profile?.rollNumber || ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Department</label>
            <input
              type="text"
              readOnly
              title={profile ? `${profile.departmentName || profile.departmentCode || ''} (${profile.departmentCode || ''})` : ''}
              value={profile ? `${profile.departmentName || profile.departmentCode || ''} (${profile.departmentCode || ''})` : ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-indigo-700 font-bold cursor-not-allowed truncate"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Institutional Email</label>
            <input
              type="text"
              readOnly
              title={profile?.email || ''}
              value={profile?.email || ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed truncate"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">College</label>
            <input
              type="text"
              readOnly
              title={profile?.college || ''}
              value={profile?.college || ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed truncate"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">University</label>
            <input
              type="text"
              readOnly
              title={profile?.university || ''}
              value={profile?.university || ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed truncate"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Batch & Semester</label>
            <input
              type="text"
              readOnly
              value={profile ? `${profile.batch || ''} (Semester ${profile.currentSemester ?? ''})` : ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">CGPA & Backlogs</label>
            <input
              type="text"
              readOnly
              value={profile ? `${profile.cgpa ?? 0} CGPA (${profile.activeBacklogs ?? 0} Backlogs)` : ''}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-900 font-black cursor-not-allowed"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Permanent / Communication Address</label>
            <input
              type="text"
              readOnly
              title={profile?.address || 'Not provided'}
              value={profile?.address || 'Not provided'}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed truncate"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: STUDENT-CONTROLLED CAREER PROFILE (EDITABLE) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Career Portfolio & Resume Links</h2>
              <p className="text-xs text-slate-500">Student-controlled parameters used for recruiter drives</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveCareerProfile} className="space-y-6 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Skills & Technical Competencies</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Java, Spring Boot, React, MySQL, Data Structures"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resume Cloud URL</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume-link"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Personal Portfolio / Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Career Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
