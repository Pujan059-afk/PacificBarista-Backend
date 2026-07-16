const levels = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const CourseFilter = ({ activeLevel, onFilterChange, searchQuery, onSearchChange }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
      <div className="flex items-center gap-2 flex-wrap">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => onFilterChange(level.value)}
            className={`px-5 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
              activeLevel === level.value
                ? 'bg-accent text-white shadow-md'
                : 'bg-white text-text/70 hover:text-accent hover:bg-accent/5 border border-primary/10'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-72">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-primary/10 rounded-full font-body text-sm text-text placeholder:text-text/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-300"
        />
      </div>
    </div>
  );
};

export default CourseFilter;
