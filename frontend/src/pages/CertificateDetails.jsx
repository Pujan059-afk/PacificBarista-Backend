import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiCalendar, FiUser, FiBookOpen,
  FiHash, FiAward, FiShield, FiArrowLeft
} from 'react-icons/fi';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import { fadeIn } from '../animations/index';

const InfoRow = ({ icon: Icon, label, value, delay = 0 }) => (
  <motion.div
    variants={fadeIn('up', delay)}
    initial="hidden"
    animate="show"
    className="flex items-start gap-4"
  >
    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-body text-[10px] uppercase tracking-[0.15em] text-text/40 mb-0.5">{label}</p>
      <p className="font-body font-semibold text-text text-sm">{value}</p>
    </div>
  </motion.div>
);

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
        <title>{certificate ? `${certificate.studentName} - Certificate | Pacific Barista Academy` : 'Certificate | Pacific Barista Academy'}</title>
        <meta name="description" content={certificate ? `Certificate of completion for ${certificate.studentName} in ${certificate.courseName} from Pacific Barista Academy.` : 'View Pacific Barista Academy certificate details.'} />
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

        <div className="relative z-10 pt-32 pb-24">
          <div className="container-custom max-w-lg mx-auto px-4">

            <Link to="/verify" className="inline-flex items-center gap-2 text-cream/40 hover:text-cream/70 font-body text-sm mb-8 transition-colors">
              <FiArrowLeft className="w-4 h-4" /> Back to Verify
            </Link>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-cream rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                <div className="h-1.5 w-full bg-gradient-to-r from-red-400/60 via-red-500 to-red-400/60" />
                <div className="bg-gradient-to-br from-primary to-primary/80 px-8 pt-8 pb-10">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center shrink-0">
                      <FiShield className="w-7 h-7 text-red-400" />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-cream leading-tight">Not Found</h2>
                      <p className="font-body text-cream/50 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
                <div className="px-8 py-6">
                  <Link to="/verify" className="font-body text-sm text-accent hover:text-accent/70 font-medium transition-colors">Try another certificate →</Link>
                </div>
              </motion.div>
            ) : certificate && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="relative bg-cream rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                  {/* photo */}
                  {certificate.photo?.url && (
                    <div className="h-48 overflow-hidden">
                      <img src={certificate.photo.url} alt={certificate.studentName} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}

                  {/* gold top bar */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-accent/60 via-accent to-accent/60" />

                  {/* card header */}
                  <div className="bg-gradient-to-br from-primary to-primary/80 px-8 pt-8 pb-10 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border-2 border-accent/10" />
                    <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full border-2 border-accent/10" />

                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                        <FiCheckCircle className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-body text-xs font-semibold text-emerald-400 uppercase tracking-[0.15em]">
                            Verified & Authentic
                          </span>
                        </div>
                        <h2 className="font-heading text-2xl font-bold text-cream leading-tight">
                          Certificate of Completion
                        </h2>
                        <p className="font-body text-cream/50 text-sm mt-0.5">
                          Issued by Pacific Barista Academy
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  <div className="relative flex items-center justify-center -mt-1">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-primary/10" />
                    <div className="relative z-10 w-10 h-10 rounded-full bg-cream border-4 border-primary/10 flex items-center justify-center">
                      <FiAward className="w-4 h-4 text-accent" />
                    </div>
                  </div>

                  {/* student name big */}
                  <div className="px-8 pt-6 pb-2 text-center">
                    <p className="font-body text-[10px] uppercase tracking-[0.2em] text-text/40 mb-1">This is to certify that</p>
                    <h3 className="font-heading text-3xl font-bold text-primary">{certificate.studentName}</h3>
                    <p className="font-body text-[10px] uppercase tracking-[0.2em] text-text/40 mt-2">has successfully completed</p>
                    <p className="font-heading text-lg font-semibold text-accent mt-1">{certificate.courseName}</p>
                  </div>

                  {/* info rows */}
                  <div className="px-8 pt-6 pb-4 space-y-5">
                    <InfoRow icon={FiHash}     label="Certificate ID"  value={certificate.certificateId} delay={0.05} />
                    <InfoRow icon={FiCalendar} label="Issue Date"
                      value={new Date(certificate.issueDate).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })}
                      delay={0.1}
                    />
                    {certificate.description && (
                      <motion.div variants={fadeIn('up', 0.15)} initial="hidden" animate="show">
                        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-text/40 mb-1">Description</p>
                        <p className="font-body text-sm text-text/70 leading-relaxed">{certificate.description}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* QR Code */}
                  {certificate.qrCode?.url && (
                    <div className="px-8 pb-6 flex justify-center">
                      <div className="text-center">
                        <img src={certificate.qrCode.url} alt="QR Code" className="w-28 h-28 rounded-lg border border-primary/10 mx-auto" />
                        <p className="font-body text-[10px] text-text/30 mt-1.5 tracking-wide">Scan to verify</p>
                      </div>
                    </div>
                  )}

                  {/* footer */}
                  <div className="mx-8 mb-8 pt-5 border-t border-primary/10 flex items-center justify-between">
                    <p className="font-body text-[11px] text-text/30 tracking-wide">
                      Pacific Barista Academy · Official Record
                    </p>
                    <Link to="/verify" className="font-body text-xs text-accent hover:text-accent/70 font-medium transition-colors">
                      Verify another →
                    </Link>
                  </div>
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
