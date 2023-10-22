import * as prettier from 'prettier'

export const tidy = async (text: string, options: prettier.Options) => {
    return await prettier.format(text, options)
}

export const parseRepoName = (text: string) => {
    let parsed = text

    return parsed
}
