import fs from 'fs-extra'
import path from 'path'

const saveToDisk = ({ directory, data, fileName, overwrite = false, size, type }) => {
  let error: any
  if (!data || !data.buffer) {
    error = new Error("invalid format: data")
    error.code = 7008
    throw error
  }
  if (size && data.size > size) {
    error = new Error("File must less than " + bytesToSize(size))
    error.code = 7006
    throw error
  }
  if (type && !type.includes(String(getFileExtension(data.originalname)).toLowerCase())) {
    error = new Error("Only accept theses following file types " + type)
    error.code = 7005
    throw error
  }
  directory = path.resolve(directory)
  if (!fileName) fileName = data.originalname
  const pathFile = path.join(directory, fileName)

  if (!overwrite && fs.existsSync(pathFile)) {
    error = new Error("File exist!")
    error.code = 7007
    throw error
  }
  fs.ensureDirSync(directory);
  fs.writeFileSync(pathFile, data.buffer)
  return pathFile
}

const getFileExtension = (filename) => {
  return filename.split('.').pop();
}

const getNameFile = (name, extensionFile) => {
  return name + "-" + Date.now() + "." + extensionFile;
}

const removeFile = (path) => {
  if (!fs.existsSync(path)) {
    return null
  }
  fs.unlinkSync(path)
  return path
}

const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) + "", 10)
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export default {
  saveToDisk,
  getFileExtension,
  getNameFile,
  removeFile,
  bytesToSize
}
