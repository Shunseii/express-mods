export const enum ImageMimeTypes {
  JPEG = "image/jpeg",
  PNG = "image/png",
}

export const AcceptedImageTypes = [ImageMimeTypes.JPEG, ImageMimeTypes.PNG];

export const isAcceptedImageType = (file: File): boolean => {
  return !!AcceptedImageTypes.find((imageType) => imageType === file.type);
};

export const allValidImageMimetypes = (files: FileList): boolean => {
  return Array.from(files).reduce<boolean>(
    (acc, curFile) => acc && isAcceptedImageType(curFile),
    true
  );
};
