export const validateBookInputs = (
    {
        isbn,
        title,
        author,
        description,
    } : {
        isbn: string | undefined,
        title: string | undefined,
        author: string | undefined,
        description: string | undefined,
    }
) => {
    const fields = new Map([
        ["isbn", isbn],
        ["title", title],
        ["author", author],
        ["description", description]
    ])

    const invalidInputs = fieldsEmpty(fields);
    return invalidInputs.length > 0 ? invalidInputs : [];
}

const fieldsEmpty = (fields: Map<string, string | undefined>): string[] => {
    return Array.from(fields).map((field) => {
        if (!field[1]?.length) {
            return field[0];
        }
    }).filter(field => field !== undefined) as string[];
}

export const validateImage = async (image: File | undefined, setFileError: (value: string[]) => void) => {
    const maxFileSize = 50 * 1024 * 1024; // 50 MB in bytes

    // Check if the file is an image
    if (!image?.type.startsWith('image/')) {
      setFileError(["This file is not an image."]);
      return;
    }

    // Check if the file size is less than or equal to 50MB
    if (image.size > maxFileSize) {
        setFileError(["Image is larger that 50MB."]);
        return;
    }

    // Read the file to check its dimensions
    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = () => {
      const aspectRatio = img.width / img.height;

      // Check if the aspect ratio matches the expected one
      if (aspectRatio > 0.67 || aspectRatio < 0.64) {
        setFileError(["Image aspect ratio must be beteen 0.6:1 and 0.7:1."])
        return;
      }
    };

    setFileError([]);
  };