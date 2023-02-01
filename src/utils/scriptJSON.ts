export const parseJson = (json: string) => {
  try {
    return JSON.parse(json)
  } catch (error) {
    return null
  }
}

export const parseAspectRatio = (scriptJSON:string) => {
  const scriptParams = parseJson(scriptJSON)

  if (!scriptParams) {
    return 1
  }

  const { aspectRatio } = scriptParams

  if (typeof aspectRatio === "string") {
    if (aspectRatio.indexOf("/") !== -1) {
      const [numerator, denominator] = aspectRatio.split("/")
      return parseFloat(numerator) / parseFloat(denominator)
    } else {
      return parseFloat(aspectRatio)
    }
  }
  return aspectRatio
}

export const parseScriptType = (scriptJSON: string) => {
  const scriptParams = parseJson(scriptJSON)
  return scriptParams?.type
}
