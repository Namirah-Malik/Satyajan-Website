'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Briefcase, Calendar, DollarSign, CheckCircle, Send, MessageCircle } from 'lucide-react';

const jobDetailsData = {
  'sales-executive': {
    id: 'sales-executive',
    type: 'Full-time',
    department: 'Sales',
    title: 'Sales Executive (Power Backup & Solar)',
    location: 'Hyderabad',
    experience: '0-3 years',
    postedDate: '2025-01-15',
    about: 'Satyajan Energy Solutions is looking for energetic and passionate Sales Executives to join our growing team. This role offers excellent growth opportunities in the booming renewable energy sector. You\'ll be working with innovative products that help customers save money while contributing to a greener planet.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
    responsibilities: [
      'Identify and develop new business opportunities in assigned territory',
      'Present and demonstrate solar panels, inverters, and battery systems to potential customers',
      'Meet with homeowners, businesses, and dealers to understand their power backup needs',
      'Achieve monthly and quarterly sales targets',
      'Maintain strong relationships with existing customers for repeat business',
      'Provide accurate product information and technical specifications',
      'Coordinate with installation team for smooth project execution',
      'Collect market intelligence and competitor information',
      'Participate in exhibitions, trade shows, and promotional events',
      'Maintain daily sales reports and CRM updates',
    ],
    requirements: [
      'Graduate in any discipline (B.Com, BBA, Engineering preferred)',
      'Excellent communication skills in English, Hindi, and Telugu',
      'Willingness to travel within Hyderabad and nearby areas',
      'Two-wheeler with valid driving license',
      'Basic understanding of solar energy or willingness to learn',
      'Confident, self-motivated, and target-oriented personality',
      'Good negotiation and persuasion skills',
      'Proficiency in MS Office and smartphone applications',
      'Previous sales experience is a plus but not mandatory',
      'Age: 21-32 years',
    ],
    skills: ['Communication', 'Field Sales', 'Product Knowledge', 'Customer Relations'],
    salary: {
      base: '₹15,000 - ₹20,000',
      incentives: '₹10,000 - ₹30,000',
      allowances: '₹3,000 (Travel)',
      total: '₹28,000 - ₹53,000 per month',
    },
    benefits: [
      'Attractive monthly incentives on achieving targets',
      'Quarterly performance bonuses',
      'Travel and fuel allowance',
      'Comprehensive product training',
      'Career growth to Team Leader → Sales Manager',
      'Festival bonuses',
      'Mobile reimbursement',
    ],
  },
  'accounts-executive': {
    id: 'accounts-executive',
    type: 'Full-time',
    department: 'Accounts',
    title: 'Accounts Executive',
    location: 'Hyderabad',
    experience: '1-3 years',
    postedDate: '2025-01-12',
    about: 'Manage day-to-day accounting operations, billing, GST compliance, and financial reporting for our growing business. We are looking for detail-oriented accounting professionals to join our finance team.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop',
    responsibilities: [
      'Handle day-to-day accounting operations and transactions',
      'Manage billing and invoicing processes',
      'Ensure GST compliance and regulatory requirements',
      'Prepare and verify financial reports',
      'Reconcile accounts and maintain accuracy',
      'Process vendor invoices and payments',
      'Maintain accounting records and documentation',
      'Coordinate with auditors and external agencies',
      'Prepare monthly and quarterly financial statements',
      'Support tax planning and filing',
    ],
    requirements: [
      'B.Com or equivalent accounting qualification',
      '1-3 years of accounting experience',
      'Strong knowledge of GST and indirect taxes',
      'Proficiency in Tally and accounting software',
      'Good understanding of financial statements',
      'Excellent attention to detail',
      'Strong analytical and problem-solving skills',
      'Ability to manage multiple tasks',
      'Knowledge of Excel is essential',
    ],
    skills: ['Accounting', 'Tally', 'GST', 'Billing', 'Financial Reporting'],
    salary: {
      base: '₹18,000 - ₹24,000',
      incentives: '₹5,000 - ₹10,000',
      allowances: '₹2,000 (Conveyance)',
      total: '₹25,000 - ₹34,000 per month',
    },
    benefits: [
      'Competitive salary based on experience',
      'Performance bonuses',
      'Conveyance allowance',
      'Professional training and development',
      'Health insurance coverage',
      'Festival bonuses',
      'Paid leave policy',
    ],
  },
};

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const job = jobDetailsData[jobId as keyof typeof jobDetailsData];

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <button onClick={() => router.back()} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          {jobId !== 'sales-executive' && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Jobs
            </button>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4 mt-4">
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">{job.type}</span>
                    <span className="inline-block border border-green-600 text-green-600 px-3 py-1 rounded-full text-xs">{job.department}</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      <span>{job.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {job.image && <img src={job.image} alt={job.title} className="w-full h-64 object-cover rounded-lg mb-6" />}
                </div>

                <div className="space-y-8">
                  {/* About the Role */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
                    <p className="text-gray-700 leading-relaxed">{job.about}</p>
                  </div>

                  {/* Key Responsibilities */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                    <ul className="space-y-3">
                      {job.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements & Qualifications */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements & Qualifications</h2>
                    <ul className="space-y-3">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Salary & Compensation */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Salary & Compensation</h2>
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Base Salary</p>
                          <p className="text-xl font-bold text-gray-900">{job.salary.base}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Monthly Incentives</p>
                          <p className="text-xl font-bold text-gray-900">{job.salary.incentives}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Allowances</p>
                          <p className="text-xl font-bold text-gray-900">{job.salary.allowances}</p>
                        </div>
                      </div>
                      <div className="border-t border-green-300 pt-6">
                        <p className="text-sm text-gray-600 mb-1">Total Earning Potential</p>
                        <p className="text-2xl font-bold text-green-700">{job.salary.total}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Benefits */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Benefits</h2>
                    <ul className="space-y-3">
                      {job.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Apply?</h3>
                <p className="text-gray-600 mb-6">Take the next step in your career. Submit your application and join our team.</p>

                <button
                  onClick={() => window.location.href = `/career/apply?job=${job.id}`}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold mb-3 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Apply for this Job
                </button>

                <button
                  onClick={() => window.open(`https://wa.me/918019179159?text=Hi, I am interested in the ${job.title} position`, '_blank')}
                  className="w-full border-2 border-gray-200 text-gray-900 px-4 py-3 rounded-md hover:border-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp HR
                </button>

                <div className="border-t border-gray-200 my-6"></div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Job Summary</h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Location</p>
                      <p className="text-gray-900 font-semibold">{job.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Job Type</p>
                      <p className="text-gray-900 font-semibold">{job.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Experience</p>
                      <p className="text-gray-900 font-semibold">{job.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Department</p>
                      <p className="text-gray-900 font-semibold">{job.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
