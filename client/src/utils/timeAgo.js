export const formatTimeAgo = (createdAt) => {
  const createdAtDate = new Date(createdAt);
  const currDate = new Date();
  const diffMs = currDate - createdAtDate;

  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

  if (sec < 60) return `${sec}s`;
  else if (min < 60) return `${min}m`;
  else if (hours < 24) return`${hours}h`;
  else if (days < 7) return`${days}d`;
  else return`${weeks}w`;
};
