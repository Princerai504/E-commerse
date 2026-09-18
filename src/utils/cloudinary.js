const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const PLACEHOLDER_PRESET = 'my_unsigned_upload_preset';

export const isCloudinaryConfigured = () =>
  Boolean(CLOUDINARY_CLOUD_NAME) &&
  Boolean(CLOUDINARY_UPLOAD_PRESET) &&
  CLOUDINARY_UPLOAD_PRESET !== PLACEHOLDER_PRESET;

const uploadFile = async (file) => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Create an Unsigned upload preset in your Cloudinary dashboard, paste its name into VITE_CLOUDINARY_UPLOAD_PRESET in .env, then restart the dev server.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    let detail = '';
    try {
      const errorJson = await response.json();
      detail = errorJson?.error?.message || '';
    } catch {
      // ignore parse errors
    }
    throw new Error(
      detail ||
        `Cloudinary upload failed (${response.status}). Make sure your upload preset is set to "Unsigned".`
    );
  }

  const data = await response.json();
  if (!data?.secure_url) {
    throw new Error('Cloudinary upload failed: no image URL returned.');
  }
  return data.secure_url;
};

const uploadImage = async (file) => {
  const url = await uploadFile(file);
  return url;
};

export { uploadImage, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET };