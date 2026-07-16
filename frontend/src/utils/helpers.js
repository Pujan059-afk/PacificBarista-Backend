export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const formatContent = (text) => {
  if (!text) return '';
  const blocks = text.split(/\n\s*\n/).filter(b => b.trim());
  let html = '';
  for (const block of blocks) {
    const lines = block.split('\n').filter(l => l.trim());
    let inBullet = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^\d+[\.\)]\s/.test(trimmed)) {
        if (inBullet) { html += '</ul>'; inBullet = false; }
        html += `<p><strong>${trimmed}</strong></p>`;
      } else if (/^[-–—*]\s/.test(trimmed)) {
        if (!inBullet) { html += '<ul class="list-disc pl-6 space-y-1">'; inBullet = true; }
        html += `<li>${trimmed.replace(/^[-–—*]\s/, '')}</li>`;
      } else {
        if (inBullet) { html += '</ul>'; inBullet = false; }
        html += `<p>${trimmed}</p>`;
      }
    }
    if (inBullet) { html += '</ul>'; inBullet = false; }
  }
  return html;
};
