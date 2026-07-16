import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiPlus, FiTrash2, FiChevronLeft, FiUpload } from 'react-icons/fi';
import { slugify } from '../../utils/helpers';
import { COURSE_LEVELS } from '../../utils/constants';

const AddEditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    duration: '',
    level: 'Beginner',
    price: '',
    curriculum: [{ title: '', items: [''] }],
    learningOutcomes: [''],
    requirements: [''],
    certificateIncluded: false,
    featured: false,
    isActive: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const fetchCourse = async () => {
        try {
          const res = await api.get(`/courses/${id}`);
          const course = res.data?.course || res.data;
          setForm({
            title: course.title || '',
            slug: course.slug || '',
            description: course.description || '',
            shortDescription: course.shortDescription || '',
            duration: course.duration || '',
            level: course.level || 'Beginner',
            price: course.price?.toString() || '',
            curriculum: course.curriculum?.length > 0
              ? course.curriculum.map((s) => ({
                  title: s.title || '',
                  items: s.items?.length > 0 ? s.items : [''],
                }))
              : [{ title: '', items: [''] }],
            learningOutcomes: course.learningOutcomes?.length > 0 ? course.learningOutcomes : [''],
            requirements: course.requirements?.length > 0 ? course.requirements : [''],
            certificateIncluded: course.certificateIncluded || false,
            featured: course.featured || false,
            isActive: course.isActive ?? true,
          });
          if (course.image?.url) setImagePreview(course.image.url);
        } catch (err) {
          showToast('Failed to load course', 'error');
          navigate('/admin-pacific/courses');
        } finally {
          setFetching(false);
        }
      };
      fetchCourse();
    }
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !isEdit) {
        updated.slug = slugify(value);
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleArrayItem = (field, index, value) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length === 0 ? [''] : arr };
    });
  };

  const handleCurriculumSection = (index, value) => {
    setForm((prev) => {
      const curr = [...prev.curriculum];
      curr[index] = { ...curr[index], title: value };
      return { ...prev, curriculum: curr };
    });
  };

  const handleCurriculumItem = (secIdx, itemIdx, value) => {
    setForm((prev) => {
      const curr = [...prev.curriculum];
      const items = [...curr[secIdx].items];
      items[itemIdx] = value;
      curr[secIdx] = { ...curr[secIdx], items };
      return { ...prev, curriculum: curr };
    });
  };

  const addCurriculumSection = () => {
    setForm((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: '', items: [''] }],
    }));
  };

  const addCurriculumItem = (secIdx) => {
    setForm((prev) => {
      const curr = [...prev.curriculum];
      curr[secIdx] = { ...curr[secIdx], items: [...curr[secIdx].items, ''] };
      return { ...prev, curriculum: curr };
    });
  };

  const removeCurriculumItem = (secIdx, itemIdx) => {
    setForm((prev) => {
      const curr = [...prev.curriculum];
      const items = curr[secIdx].items.filter((_, i) => i !== itemIdx);
      curr[secIdx] = { ...curr[secIdx], items: items.length === 0 ? [''] : items };
      return { ...prev, curriculum: curr };
    });
  };

  const removeCurriculumSection = (secIdx) => {
    setForm((prev) => {
      const curr = prev.curriculum.filter((_, i) => i !== secIdx);
      return { ...prev, curriculum: curr.length === 0 ? [{ sectionTitle: '', items: [''] }] : curr };
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.duration.trim()) errs.duration = 'Duration is required';
    if (!form.price && form.price !== 0) errs.price = 'Price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        curriculum: form.curriculum.map((s) => ({
          title: s.title,
          items: s.items.filter((i) => i.trim()),
        })).filter((s) => s.title || s.items.length > 0),
        learningOutcomes: form.learningOutcomes.filter((o) => o.trim()),
        requirements: form.requirements.filter((r) => r.trim()),
      };

      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (['curriculum', 'learningOutcomes', 'requirements'].includes(key)) {
          formData.append(key, JSON.stringify(payload[key]));
        } else {
          formData.append(key, payload[key]);
        }
      });
      if (image) formData.append('image', image);

      if (isEdit) {
        await api.put(`/courses/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Course updated successfully', 'success');
      } else {
        await api.post('/courses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Course created successfully', 'success');
      }
      navigate('/admin-pacific/courses');
    } catch (err) {
      showToast(err.message || 'Failed to save course', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 bg-white border-2 rounded-lg text-text font-body text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,155,60,0.1)] placeholder:text-text/30 ${
      errors[field] ? 'border-red-300' : 'border-primary/10'
    }`;

  const labelClass = 'block text-primary font-body font-medium text-sm mb-1.5';

  return (
    <PageTransition>
      <Helmet>
        <title>{isEdit ? 'Edit Course' : 'Add Course'} - Pacific Barista Admin</title>
      </Helmet>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin-pacific/courses')}
          className="p-2 rounded-lg hover:bg-primary/5 text-primary transition-colors"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            {isEdit ? 'Edit Course' : 'Add New Course'}
          </h1>
          <p className="font-body text-text/60 text-sm mt-1">
            {isEdit ? 'Update course details' : 'Create a new training course'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
          <h2 className="font-heading text-lg font-bold text-primary mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={inputClass('title')}
                placeholder="e.g. Espresso Fundamentals"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 font-body">{errors.title}</p>}
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className={inputClass('slug')}
                placeholder="e.g. espresso-fundamentals"
              />
              {errors.slug && <p className="text-red-500 text-xs mt-1 font-body">{errors.slug}</p>}
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className={inputClass('duration')}
                placeholder="e.g. 4 Weeks"
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1 font-body">{errors.duration}</p>}
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <select
                value={form.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className={inputClass('level')}
              >
                {COURSE_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Price (रू)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={inputClass('price')}
                placeholder="e.g. 299"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1 font-body">{errors.price}</p>}
            </div>
            <div>
              <label className={labelClass}>Short Description</label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                className={inputClass('shortDescription')}
                placeholder="Brief overview of the course"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`${inputClass('description')} min-h-[120px] resize-y`}
              placeholder="Full course description..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1 font-body">{errors.description}</p>}
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
          <h2 className="font-heading text-lg font-bold text-primary mb-4">Course Image</h2>
          <div className="flex items-start gap-4">
            <div className="w-32 h-24 rounded-lg border-2 border-dashed border-primary/10 overflow-hidden flex items-center justify-center bg-cream shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FiUpload className="w-6 h-6 text-text/20" />
              )}
            </div>
            <div className="flex-1">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-cream border border-primary/10 rounded-lg cursor-pointer hover:border-accent/30 transition-colors font-body text-sm text-text">
                <FiUpload className="w-4 h-4" />
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              <p className="font-body text-xs text-text/30 mt-2">Recommended: 800x600px, JPG or PNG</p>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-primary">Curriculum</h2>
            <Button type="button" variant="outline" size="sm" icon={FiPlus} onClick={addCurriculumSection}>
              Add Section
            </Button>
          </div>
          {form.curriculum.map((section, secIdx) => (
            <motion.div
              key={secIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-cream rounded-lg border border-primary/5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-sm font-medium text-primary">Section {secIdx + 1}</span>
                {form.curriculum.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCurriculumSection(secIdx)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-text/30 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleCurriculumSection(secIdx, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent mb-2"
                placeholder="Section title (e.g. Week 1: Introduction)"
              />
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleCurriculumItem(secIdx, itemIdx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    placeholder="Lesson/item"
                  />
                  <button
                    type="button"
                    onClick={() => removeCurriculumItem(secIdx, itemIdx)}
                    className="p-2 rounded-lg hover:bg-red-50 text-text/30 hover:text-red-500 transition-colors shrink-0"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addCurriculumItem(secIdx)}
                className="text-accent font-body text-sm hover:underline mt-1 inline-flex items-center gap-1"
              >
                <FiPlus className="w-3 h-3" /> Add item
              </button>
            </motion.div>
          ))}
        </div>

        {/* Learning Outcomes */}
        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-primary">Learning Outcomes</h2>
            <Button type="button" variant="outline" size="sm" icon={FiPlus} onClick={() => addArrayItem('learningOutcomes')}>
              Add
            </Button>
          </div>
          {form.learningOutcomes.map((outcome, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => handleArrayItem('learningOutcomes', idx, e.target.value)}
                className="flex-1 px-3 py-2 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                placeholder="e.g. Master espresso extraction"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('learningOutcomes', idx)}
                className="p-2 rounded-lg hover:bg-red-50 text-text/30 hover:text-red-500 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-primary">Requirements</h2>
            <Button type="button" variant="outline" size="sm" icon={FiPlus} onClick={() => addArrayItem('requirements')}>
              Add
            </Button>
          </div>
          {form.requirements.map((req, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayItem('requirements', idx, e.target.value)}
                className="flex-1 px-3 py-2 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                placeholder="e.g. No prior experience needed"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('requirements', idx)}
                className="p-2 rounded-lg hover:bg-red-50 text-text/30 hover:text-red-500 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
          <h2 className="font-heading text-lg font-bold text-primary mb-4">Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.certificateIncluded}
                onChange={(e) => handleChange('certificateIncluded', e.target.checked)}
                className="w-4 h-4 rounded border-primary/20 text-accent focus:ring-accent"
              />
              <span className="font-body text-sm text-text">Certificate Included</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="w-4 h-4 rounded border-primary/20 text-accent focus:ring-accent"
              />
              <span className="font-body text-sm text-text">Featured Course</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-4 h-4 rounded border-primary/20 text-accent focus:ring-accent"
              />
              <span className="font-body text-sm text-text">Active</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end pb-8">
          <button
            type="button"
            onClick={() => navigate('/admin-pacific/courses')}
            className="px-6 py-3 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5 transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" loading={loading} size="lg">
            {isEdit ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </PageTransition>
  );
};

export default AddEditCourse;
