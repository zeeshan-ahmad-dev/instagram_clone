export function getProfileImageUrl(path) {
  if (!path) return `${import.meta.env.VITE_API_BASE_URL}/uploads/profilePics/default.jpg`;
  
  const trimmedPath = path.trim();

  if (trimmedPath.startsWith("https://") || trimmedPath.startsWith("http://")) {
    return trimmedPath;
  }

  return `${import.meta.env.VITE_API_BASE_URL}${trimmedPath}`;
}
