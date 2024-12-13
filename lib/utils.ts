import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const tap = async <T>(
  value: T,
  cb: (value: T) => Promise<unknown>
): Promise<T> => {
  await cb(value)
  return value
}

export const convertImageFileToBase64 = (
  file: File,
  quality = 1.0,
  maxSize = 1024
) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = async function () {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        let base64 = canvas.toDataURL('image/jpeg', quality)
        // Check if the base64 string exceeds 1MB
        while (base64.length > maxSize && quality > 0.1) {
          quality -= 0.1
          base64 = canvas.toDataURL('image/jpeg', quality)
        }
        resolve(base64)
      }
      img.onerror = function () {
        throw Error(
          'Failed to load image. Please check if your image file is valid.'
        )
      }
      img.src = event.target!.result!.toString()
    }
    reader.readAsDataURL(file)
  })
}
