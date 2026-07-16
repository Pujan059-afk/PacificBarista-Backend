import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiTrash2, FiImage, FiUpload } from 'react-icons/fi';
import { GALLERY_CATEGORIES } from '../../utils/constants';

const ManageGallery = () => {
  const { showToast } = useApp();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        e.preventDefault();
        handleFiles(files);
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [category]);

  const fetchImages = async () => {
    try {
      const res = await api.get('/gallery');
      setImages(res.data?.images || res.data || []);
    } catch (err) {
      showToast('Failed to load gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category || 'General');
    await api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      showToast('Please select image files', 'error');
      return;
    }
    if (!category) {
      showToast('Please select a category before uploading', 'error');
      return;
    }
    setUploading(true);
    let success = 0;
    for (const file of files) {
      try {
        await uploadFile(file);
        success++;
      } catch (err) {
        showToast(`Failed: ${file.name}`, 'error');
      }
    }
    setUploading(false);
    if (success > 0) {
      showToast(`${success} image${success > 1 ? 's' : ''} uploaded`, 'success');
      fetchImages();
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files?.length > 0) handleFiles(files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length > 0) handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/gallery/${deleteId}`);
      setImages((prev) => prev.filter((img) => img._id !== deleteId));
      showToast('Image deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = activeCategory ? images.filter((img) => img.category === activeCategory) : images;

  return (
    <PageTransition>
      <Helmet><title>Manage Gallery - Pacific Barista Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Gallery</h1>
          <p className="font-body text-text/60 text-sm mt-1">Manage gallery images</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2.5 bg-white border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
          >
            <option value="">Select category</option>
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-body text-sm font-medium ${uploading ? 'opacity-60' : ''}`}
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiUpload className="w-4 h-4" />
            )}
            Upload
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileInput} disabled={uploading} className="hidden" />
        </div>
      </div>

      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragOver
            ? 'border-accent bg-accent/5 scale-[1.01]'
            : 'border-primary/10 bg-white hover:border-accent/30 hover:bg-accent/5'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <FiUpload className={`w-8 h-8 ${dragOver ? 'text-accent' : 'text-text/30'}`} />
          <p className="font-body text-sm text-text/50">
            {dragOver ? 'Drop images here' : 'Drag & drop images, click Upload, or paste (Ctrl+V)'}
          </p>
          <p className="font-body text-xs text-text/30">Supports: JPEG, PNG, GIF, WebP</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-colors ${!activeCategory ? 'bg-accent text-white' : 'bg-primary/5 text-text/60 hover:bg-primary/10'}`}
        >
          All
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-colors ${activeCategory === cat.value ? 'bg-accent text-white' : 'bg-primary/5 text-text/60 hover:bg-primary/10'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-primary/5">
          <FiImage className="w-12 h-12 mx-auto text-text/20 mb-3" />
          <p className="font-body text-text/40">No images yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((img, i) => (
            <motion.div
              key={img._id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="relative group rounded-xl overflow-hidden bg-white shadow-sm border border-primary/5 aspect-square"
            >
              <img
                src={img.image?.url || img.url}
                alt={img.category || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => setDeleteId(img._id)}
                  className="p-2.5 rounded-full bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              {img.category && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded font-body">
                  {img.category}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Delete Image</h3>
              <p className="font-body text-sm text-text/60 mb-6">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5">Cancel</button>
                <Button variant="secondary" size="sm" loading={deleting} onClick={handleDelete}>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default ManageGallery;
