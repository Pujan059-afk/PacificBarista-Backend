import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiBookOpen, FiCalendar, FiHash, FiShield, FiArrowLeft, FiAward } from 'react-icons/fi';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';

const CertificateDetails = () => {
  const { code } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await api.get(`/certificates/view/${code}`);
        setCertificate(res.data);
      } catch {
        setError('Certificate not found or invalid.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [code]);

  return (
    <PageTransition>
      <Helmet>
        <title>{certificate ? `${certificate.studentName} | Pacific Barista Academy` : 'Student Profile | Pacific Barista Academy'}</title>
        <meta name="description" content={certificate ? `${certificate.studentName} - ${certificate.headline || certificate.courseName} at Pacific Barista Academy.` : 'View Pacific Barista Academy student profile.'} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #FAF7F3 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 pt-24 pb-20">
          <div className="container-custom max-w-md mx-auto px-4">

            <Link to="/verify" className="inline-flex items-center gap-2 text-cream/40 hover:text-cream/70 font-body text-sm mb-6 transition-colors">
              <FiArrowLeft className="w-4 h-4" /> Back to Verify
            </Link>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-cream rounded-2xl overflow-hidden shadow-2xl shadow-black/40 text-center py-12 px-8">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <FiShield className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="font-heading text-xl font-bold text-primary mb-2">Not Found</h2>
                <p className="font-body text-sm text-text/50 mb-6">{error}</p>
                <Link to="/verify" className="font-body text-sm text-accent hover:text-accent/70 font-medium transition-colors">Try another →</Link>
              </motion.div>
            ) : certificate && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-cream rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
              >
                {/* banner */}
                <div className="h-24 bg-gradient-to-r from-primary via-primary/90 to-primary relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #C8A97E 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
                </div>

                {/* profile photo */}
                <div className="relative flex justify-center -mt-12">
                  {certificate.photo?.url ? (
                    <img
                      src={certificate.photo.url}
                      alt={certificate.studentName}
                      className="w-24 h-24 rounded-full border-4 border-cream object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-cream bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                      <span className="font-heading text-2xl font-bold text-primary">
                        {certificate.studentName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* name + headline */}
                <div className="text-center px-6 pt-3 pb-1">
                  <h1 className="font-heading text-xl font-bold text-primary leading-tight">
                    {certificate.studentName}
                  </h1>
                  {certificate.headline ? (
                    <p className="font-body text-sm text-text/50 mt-0.5">{certificate.headline}</p>
                  ) : (
                    <p className="font-body text-sm text-text/50 mt-0.5">{certificate.courseName}</p>
                  )}
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-body text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      Verified Graduate
                    </span>
                  </div>
                </div>

                {/* divider */}
                <div className="mx-6 mt-4 border-t border-primary/5" />

                {/* about section */}
                {certificate.description && (
                  <div className="px-6 pt-4 pb-2">
                    <h3 className="font-heading text-sm font-bold text-primary mb-1.5">About</h3>
                    <p className="font-body text-sm text-text/60 leading-relaxed">
                      {certificate.description}
                    </p>
                  </div>
                )}

                {/* experience section */}
                <div className="px-6 pt-4 pb-2">
                  <h3 className="font-heading text-sm font-bold text-primary mb-3">Certificate Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <FiAward className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-text">{certificate.courseName}</p>
                        <p className="font-body text-xs text-text/40">
                          Pacific Barista Academy
                        </p>
                        <p className="font-body text-xs text-text/40 mt-0.5">
                          {new Date(certificate.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* divider */}
                <div className="mx-6 mt-3 border-t border-primary/5" />

                {/* certificate ID */}
                <div className="px-6 pt-4 pb-5">
                  <h3 className="font-heading text-sm font-bold text-primary mb-2">Certificate</h3>
                  <div className="flex items-center gap-3 bg-primary/[0.03] rounded-xl p-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <FiHash className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-accent font-semibold tracking-wide">{certificate.certificateId}</p>
                      <p className="font-body text-xs text-text/40 mt-0.5">
                        Issued {new Date(certificate.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-body text-[10px] font-semibold uppercase tracking-wider">Active</span>
                  </div>
                </div>

                {/* footer */}
                <div className="mx-6 mb-5 pt-3 border-t border-primary/5 flex items-center justify-between">
                  <p className="font-body text-[10px] text-text/30 tracking-wide">
                    Pacific Barista Academy
                  </p>
                  <Link to="/verify" className="font-body text-[11px] text-accent hover:text-accent/70 font-medium transition-colors">
                    Verify another →
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CertificateDetails;
