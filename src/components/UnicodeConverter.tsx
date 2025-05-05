"use client"

import { useState } from "react"

interface UnicodeConverterProps {
  className?: string
}

export default function UnicodeConverter({ className = "" }: UnicodeConverterProps) {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [conversionType, setConversionType] = useState("textToUnicode")
  const [unicodeFormat, setUnicodeFormat] = useState("U+")
  const [copied, setCopied] = useState(false)

  const handleConvert = () => {
    if (!inputText.trim()) {
      setOutputText("")
      return
    }

    if (conversionType === "textToUnicode") {
      const result = convertTextToUnicode(inputText, unicodeFormat)
      setOutputText(result)
    } else {
      try {
        const result = convertUnicodeToText(inputText)
        setOutputText(result)
      } catch (error) {
        setOutputText("Error: Invalid Unicode format")
      }
    }
  }

  const convertTextToUnicode = (text: string, format: string): string => {
    return Array.from(text)
      .map((char) => {
        const codePoint = char.codePointAt(0)
        if (!codePoint) return ""

        switch (format) {
          case "U+":
            return `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`
          case "\\u":
            return `\\u${codePoint.toString(16).padStart(4, "0")}`
          case "Decimal":
            return codePoint.toString(10)
          case "HTML":
            return `&#${codePoint};`
          default:
            return `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`
        }
      })
      .join(" ")
  }

  const convertUnicodeToText = (unicode: string): string => {
    // Handle different formats
    if (unicode.includes("U+")) {
      return unicode
        .split(" ")
        .map((code) => {
          if (!code.startsWith("U+")) return ""
          return String.fromCodePoint(Number.parseInt(code.slice(2), 16))
        })
        .join("")
    } else if (unicode.includes("\\u")) {
      return unicode
        .split(" ")
        .map((code) => {
          if (!code.startsWith("\\u")) return ""
          return String.fromCodePoint(Number.parseInt(code.slice(2), 16))
        })
        .join("")
    } else if (unicode.includes("&#")) {
      return unicode
        .split(" ")
        .map((code) => {
          if (!code.startsWith("&#") || !code.endsWith(";")) return ""
          return String.fromCodePoint(Number.parseInt(code.slice(2, -1), 10))
        })
        .join("")
    } else {
      // Try to parse as decimal
      return unicode
        .split(" ")
        .map((code) => {
          if (!code.trim()) return ""
          return String.fromCodePoint(Number.parseInt(code, 10))
        })
        .join("")
    }
  }

  const handleCopy = () => {
    if (!outputText) return

    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSwap = () => {
    setConversionType((prevType) => (prevType === "textToUnicode" ? "unicodeToText" : "textToUnicode"))
    setInputText(outputText)
    setOutputText("")
  }

  return (
    <div className={`w-full max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Text to Unicode Converter</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label htmlFor="conversionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Conversion Type
          </label>
          <select
            id="conversionType"
            value={conversionType}
            onChange={(e) => setConversionType(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="textToUnicode">Text to Unicode</option>
            <option value="unicodeToText">Unicode to Text</option>
          </select>
        </div>

        {conversionType === "textToUnicode" && (
          <div className="flex-1">
            <label htmlFor="unicodeFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unicode Format
            </label>
            <select
              id="unicodeFormat"
              value={unicodeFormat}
              onChange={(e) => setUnicodeFormat(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="U+">U+ Notation (U+0041)</option>
              <option value="\u">JavaScript (\u0041)</option>
              <option value="Decimal">Decimal (65)</option>
              <option value="HTML">HTML Entity (&#65;)</option>
            </select>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {conversionType === "textToUnicode" ? "Text Input" : "Unicode Input"}
        </label>
        <textarea
          id="inputText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            conversionType === "textToUnicode"
              ? "Enter text to convert to Unicode..."
              : "Enter Unicode to convert to text (e.g., U+0048 U+0065 U+006C U+006C U+006F)..."
          }
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32"
        />
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-md transition-colors"
        >
          Convert
        </button>

        <button
          onClick={handleSwap}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-md transition-colors"
        >
          Swap
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="outputText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {conversionType === "textToUnicode" ? "Unicode Output" : "Text Output"}
        </label>
        <div className="relative">
          <textarea
            id="outputText"
            value={outputText}
            readOnly
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white h-32"
          />
          {outputText && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md transition-colors"
              title="Copy to clipboard"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <h3 className="text-xl font-medium mb-2">About Unicode Conversion</h3>
        <p>
          Unicode is a standard for encoding characters that includes almost all writing systems in the world. This tool
          helps you convert between readable text and various Unicode representations.
        </p>
      </div>
    </div>
  )
}
