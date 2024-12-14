import path from 'path'
import ejs from 'ejs'

export const renderTemplate = async (
  templateName: string,
  data: object
): Promise<string> => {
  const templatePath = path.join(
    __dirname,
    '../templates',
    `${templateName}.template.ejs`
  )
  return await new Promise<string>((resolve, reject) => {
    ejs.renderFile(templatePath, data, { rmWhitespace: true }, (err, str) => {
      if (err) {
        reject(err)
      } else {
        resolve(str)
      }
    })
  })
}
