import { characterCounterTool } from "@/tools/character-counter/definition";
import { imageCompressorTool } from "@/tools/image-compressor/definition";
import { imageResizerTool } from "@/tools/image-resizer/definition";
import { backgroundRemoverTool } from "@/tools/background-remover/definition";
import { imageConverterTool } from "@/tools/image-converter/definition";
import { watermarkRemoverTool } from "@/tools/watermark-remover/definition";
import { faviconGeneratorTool } from "@/tools/favicon-generator/definition";
import { jsonFormatterTool } from "@/tools/json-formatter/definition";
import { pdfCompressorTool } from "@/tools/pdf-compressor/definition";
import { pdfMergerTool } from "@/tools/pdf-merger/definition";
import { passwordGeneratorTool } from "@/tools/password-generator/definition";
import { qrCodeGeneratorTool } from "@/tools/qr-code-generator/definition";
import { textCaseConverterTool } from "@/tools/text-case-converter/definition";
import { base64Tool } from "@/tools/base64/definition";
import { urlEncoderTool } from "@/tools/url-encoder/definition";
import { colorConverterTool } from "@/tools/color-converter/definition";
import { timestampConverterTool } from "@/tools/timestamp-converter/definition";
import { jwtDecoderTool } from "@/tools/jwt-decoder/definition";
import { pdfSplitterTool } from "@/tools/pdf-splitter/definition";
import { jpgToPdfTool } from "@/tools/jpg-to-pdf/definition";
import { pdfToJpgTool } from "@/tools/pdf-to-jpg/definition";
import { pdfRotatorTool } from "@/tools/pdf-rotator/definition";
import { imageCropperTool } from "@/tools/image-cropper/definition";
import { imageMergerTool } from "@/tools/image-merger/definition";
import { exifRemoverTool } from "@/tools/exif-remover/definition";
import { calculatorTool } from "@/tools/calculator/definition";
import { percentageCalculatorTool } from "@/tools/percentage-calculator/definition";
import { ageCalculatorTool } from "@/tools/age-calculator/definition";
import { unitConverterTool } from "@/tools/unit-converter/definition";
import { dateDifferenceTool } from "@/tools/date-difference/definition";
import { stopwatchTool } from "@/tools/stopwatch/definition";
import { pdfTextExtractorTool } from "@/tools/pdf-text-extractor/definition";
import { imageRotatorTool } from "@/tools/image-rotator/definition";
import { textCleanerTool } from "@/tools/text-cleaner/definition";
import type { ToolDefinition } from "@/tools/types";

const tools: readonly ToolDefinition[] = [
  characterCounterTool,
  imageCompressorTool,
  imageResizerTool,
  backgroundRemoverTool,
  imageConverterTool,
  watermarkRemoverTool,
  faviconGeneratorTool,
  jsonFormatterTool,
  pdfCompressorTool,
  pdfMergerTool,
  passwordGeneratorTool,
  qrCodeGeneratorTool,
  textCaseConverterTool,
  base64Tool,
  urlEncoderTool,
  colorConverterTool,
  timestampConverterTool,
  jwtDecoderTool,
  pdfSplitterTool,
  jpgToPdfTool,
  pdfToJpgTool,
  pdfRotatorTool,
  imageCropperTool,
  imageMergerTool,
  exifRemoverTool,
  calculatorTool,
  percentageCalculatorTool,
  ageCalculatorTool,
  unitConverterTool,
  dateDifferenceTool,
  stopwatchTool,
  pdfTextExtractorTool,
  imageRotatorTool,
  textCleanerTool
];

export function getAllTools(): readonly ToolDefinition[] {
  return tools;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categoryId: string): readonly ToolDefinition[] {
  return tools.filter((tool) => tool.categoryId === categoryId);
}

export function getPopularTools(): readonly ToolDefinition[] {
  return tools.filter((tool) => tool.popular);
}

export function getFeaturedTools(): readonly ToolDefinition[] {
  return tools.filter((tool) => tool.featured);
}

export function getRecentTools(): readonly ToolDefinition[] {
  return [...tools].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}
