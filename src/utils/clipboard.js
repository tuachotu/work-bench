export async function copyToClipboard(text) {
  if (!text.trim()) {
    throw new Error('Nothing to copy. Please format some JSON first.')
  }

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      if (!successful) {
        throw new Error('Copy command failed')
      }
      return true
    } catch (fallbackError) {
      throw new Error('Failed to copy to clipboard')
    }
  }
}