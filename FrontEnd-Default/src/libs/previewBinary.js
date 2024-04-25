// URL: createObjectURL() creates a string containing a URL representing the object given in the parameter.
const previewBinaryFile = (binaryFileObject) => {
  return URL.createObjectURL(binaryFileObject)
}
export { previewBinaryFile }
