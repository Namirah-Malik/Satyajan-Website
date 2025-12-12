import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, CheckCircle, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { jobOpenings } from '../mock/careersData';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const job = jobOpenings.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <Button onClick={() => navigate('/careers')}>Back to Careers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/careers')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Jobs
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-blue-600 text-white">{job.type}</Badge>
                      <Badge variant="outline" className="border-green-600 text-green-600">{job.department}</Badge>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {job.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* About the Role */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </div>

                  {/* Key Responsibilities */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                    <ul className="space-y-3">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements & Qualifications</h2>
                    <ul className="space-y-3">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Salary & Compensation */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Salary & Compensation</h2>
                    <Card className="bg-green-50 border-2 border-green-200">
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
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
                          <div className="md:col-span-2 pt-4 border-t border-green-300">
                            <p className="text-sm text-gray-600 mb-1">Total Earning Potential</p>
                            <p className="text-2xl font-bold text-green-700">{job.salary.total}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Benefits */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Benefits</h2>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Apply?</h3>
                  <p className="text-gray-600 mb-6">
                    Take the next step in your career. Submit your application and join our team.
                  </p>
                  
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3"
                    size="lg"
                    onClick={() => navigate(`/career/apply?job=${job.id}`)}
                  >
                    <Send className="mr-2 w-5 h-5" />
                    Apply for this Job
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-2"
                    onClick={() => window.open('https://wa.me/918019179159?text=Hi, I am interested in the ' + job.title + ' position', '_blank')}
                  >
                    WhatsApp HR
                  </Button>

                  <Separator className="my-6" />

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Job Summary</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-semibold text-gray-900">{job.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Job Type</p>
                        <p className="font-semibold text-gray-900">{job.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Experience</p>
                        <p className="font-semibold text-gray-900">{job.experience}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Department</p>
                        <p className="font-semibold text-gray-900">{job.department}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetail;
