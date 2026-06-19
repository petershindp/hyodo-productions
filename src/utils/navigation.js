// Navigation helpers that work with React Router.
// These are plain functions for use outside React components.
// Components that need scroll-after-navigate should use the
// useScrollToWork hook defined below.

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToWork = () => {
  const workSection = document.getElementById('work-section');
  if (workSection) {
    workSection.scrollIntoView({ behavior: 'smooth' });
  }
};
