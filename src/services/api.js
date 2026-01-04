export async function uploadIssue({ image, description, userId }) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("description", description);
  formData.append("user_id", userId);

  const response = await fetch(
    "http://localhost/CivicLens/backend/upload_issue.php",
    {
      method: "POST",
      body: formData,
    }
  );

  return await response.json();
}
