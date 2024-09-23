

export const validateBookInputs = (
    {
        isbn,
        title,
        author,
        description
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
    return invalidInputs.length > 0 ? invalidInputs : undefined;
}

const fieldsEmpty = (fields: Map<string, string | undefined>): string[] => {
    return Array.from(fields).map((field) => {
        if (!field[1]?.length) {
            return field[0];
        }
    }).filter(field => field !== undefined) as string[];
}