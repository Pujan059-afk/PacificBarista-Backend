import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiCheckCircle, FiXCircle, FiAward,
  FiCalendar, FiUser, FiBookOpen, FiHash, FiStar, FiShield
} from 'react-icons/fi';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import { fadeIn, staggerContainer } from '../animations/index';

/* ─── small helper ─── */
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
      <p className="font-body font-semibold text-text text-sm truncate">{value}</p>
    </div>
  </motion.div>
);

const VerifyCertificate = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await api.post('/certificates/verify', { certificateId: code.trim() });
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setResult({ valid: false, message: err.response.data.message });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setCode('');
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Verify Certificate | Pacific Barista Academy</title>
        <meta name="description" content="Verify the authenticity of Pacific Barista Academy certificates. Enter your certificate ID to instantly confirm credentials." />
        <link rel="canonical" href="https://www.pacificbarista.com/verify" />
        <meta property="og:title" content="Verify Certificate | Pacific Barista Academy" />
        <meta property="og:description" content="Instantly verify the authenticity of a Pacific Barista Academy certificate." />
        <meta property="og:url" content="https://www.pacificbarista.com/verify" />
        <meta property="og:image" content="https://www.pacificbarista.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Verify Certificate | Pacific Barista Academy" />
        <meta name="twitter:description" content="Instantly verify the authenticity of a Pacific Barista Academy certificate." />
      </Helmet>

      {/* ── background ── */}
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">

        {/* decorative blobs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #FAF7F3 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 pt-32 pb-24">
          <div className="container-custom">

            {/* ── heading ── */}
            <motion.div
              variants={fadeIn('up')}
              initial="hidden"
              animate="show"
              className="text-center max-w-2xl mx-auto mb-14"
            >
              {/* shield badge */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 mb-6">
                <FiShield className="w-8 h-8 text-accent" />
              </div>

              <span className="inline-block text-accent font-body font-semibold text-xs uppercase tracking-[0.25em] mb-3">
                Certificate Verification
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream leading-tight mb-4">
                Verify a{' '}
                <span className="text-accent italic">Certificate</span>
              </h1>
              <p className="font-body text-cream/60 text-base md:text-lg leading-relaxed">
                Enter a certificate ID to instantly confirm its authenticity.
                Employers and recruiters can use this tool to validate credentials.
              </p>
            </motion.div>

            {/* ── search card ── */}
            <motion.div
              variants={fadeIn('up', 0.15)}
              initial="hidden"
              animate="show"
              className="max-w-lg mx-auto"
            >
              <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-2xl p-2">
                <form onSubmit={handleVerify} className="flex gap-2">
                  <div className="flex-1 relative">
                    <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30 pointer-events-none" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="PBC-XXXX-XXXX"
                      className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-cream font-body text-sm outline-none focus:border-accent/60 focus:bg-white/15 transition-all placeholder:text-cream/30 uppercase tracking-widest"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !code.trim()}
                    className="px-6 py-3.5 bg-accent hover:bg-accent/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-body font-semibold text-sm flex items-center gap-2 transition-all duration-200 shrink-0"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSearch className="w-4 h-4" />
                    )}
                    {loading ? 'Checking…' : 'Verify'}
                  </button>
                </form>
              </div>

              {/* hint text */}
              <p className="text-center font-body text-cream/30 text-xs mt-3 tracking-wide">
                Certificate IDs follow the format <span className="text-cream/50 font-medium">PBC-XXXX-XXXX</span>
              </p>
            </motion.div>

            {/* ── results ── */}
            <AnimatePresence mode="wait">

              {/* generic error */}
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="max-w-lg mx-auto mt-8"
                >
                  <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-5 flex items-center gap-4">
                    <FiXCircle className="w-6 h-6 text-red-400 shrink-0" />
                    <p className="font-body text-red-300 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.25, 0.25, 0.25, 0.75] }}
                  className="max-w-lg mx-auto mt-10"
                >
                  {result.valid ? (
                    /* ── VALID certificate card ── */
                    <div className="relative bg-cream rounded-3xl overflow-hidden shadow-2xl shadow-black/40">

                      {/* gold top bar */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-accent/60 via-accent to-accent/60" />

                      {/* card header */}
                      <div className="bg-gradient-to-br from-primary to-primary/80 px-8 pt-8 pb-10 relative overflow-hidden">
                        {/* watermark circle */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border-2 border-accent/10" />
                        <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full border-2 border-accent/10" />

                        <div className="flex items-start gap-5">
                          {/* big check */}
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
                              Valid Certificate
                            </h2>
                            <p className="font-body text-cream/50 text-sm mt-0.5">
                              Issued by Pacific Barista Academy
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* divider with seal */}
                      <div className="relative flex items-center justify-center -mt-1">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-primary/10" />
                        <div className="relative z-10 w-10 h-10 rounded-full bg-cream border-4 border-primary/10 flex items-center justify-center">
                          <FiAward className="w-4 h-4 text-accent" />
                        </div>
                      </div>

                      {/* info rows */}
                      <div className="px-8 pt-6 pb-8 space-y-5">
                        <InfoRow icon={FiHash}     label="Certificate ID"  value={result.certificate.certificateId} delay={0.05} />
                        <InfoRow icon={FiUser}     label="Student Name"    value={result.certificate.studentName}   delay={0.1}  />
                        <InfoRow icon={FiBookOpen} label="Course"          value={result.certificate.courseName}    delay={0.15} />
                        <InfoRow
                          icon={FiCalendar}
                          label="Issue Date"
                          value={new Date(result.certificate.issueDate).toLocaleDateString('en-US', {
                            month: 'long', day: 'numeric', year: 'numeric',
                          })}
                          delay={0.2}
                        />
                        {result.certificate.grade && (
                          <InfoRow icon={FiStar} label="Grade" value={result.certificate.grade} delay={0.25} />
                        )}
                      </div>

                      {/* footer */}
                      <div className="mx-8 mb-8 pt-5 border-t border-primary/10 flex items-center justify-between">
                        <p className="font-body text-[11px] text-text/30 tracking-wide">
                          Pacific Barista Academy · Official Record
                        </p>
                        <button
                          onClick={handleReset}
                          className="font-body text-xs text-accent hover:text-accent/70 font-medium transition-colors"
                        >
                          Verify another →
                        </button>
                      </div>
                    </div>

                  ) : (
                    /* ── INVALID / NOT FOUND card ── */
                    <div className="bg-cream rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                      <div className="h-1.5 w-full bg-gradient-to-r from-red-400/60 via-red-500 to-red-400/60" />

                      <div className="bg-gradient-to-br from-primary to-primary/80 px-8 pt-8 pb-10 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border-2 border-red-400/10" />
                        <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full border-2 border-red-400/10" />

                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center shrink-0">
                            <FiXCircle className="w-7 h-7 text-red-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                              <span className="font-body text-xs font-semibold text-red-400 uppercase tracking-[0.15em]">
                                {result.certificate?.status === 'Revoked' ? 'Certificate Revoked' : 'Not Found'}
                              </span>
                            </div>
                            <h2 className="font-heading text-2xl font-bold text-cream leading-tight">
                              {result.certificate?.status === 'Revoked'
                                ? 'This Certificate Has Been Revoked'
                                : 'No Certificate Found'}
                            </h2>
                            <p className="font-body text-cream/50 text-sm mt-1 leading-relaxed">
                              {result.certificate?.status === 'Revoked'
                                ? 'This certificate is no longer valid and has been officially revoked.'
                                : result.message || 'No certificate matches the ID you entered. Please double-check and try again.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-8 py-6 flex items-center justify-between">
                        <p className="font-body text-xs text-text/40">
                          Make sure the ID is entered correctly.
                        </p>
                        <button
                          onClick={handleReset}
                          className="font-body text-xs text-accent hover:text-accent/70 font-medium transition-colors"
                        >
                          Try again →
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyCertificate;
