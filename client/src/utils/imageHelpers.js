export function getProfileImageUrl(path) {
  if (!path) return "http://localhost:8000/uploads/profilePics/default.jpg";
  
  const trimmedPath = path.trim();

  if (trimmedPath.startsWith("https://") || trimmedPath.startsWith("http://")) {
    return trimmedPath;
  }

  return `http://localhost:8000${trimmedPath}`;
}
