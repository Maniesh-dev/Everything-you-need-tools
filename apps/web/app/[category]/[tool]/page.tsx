import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { getCategoryBySlug } from "@/lib/categories";
import { getToolBySlug, getToolsByCategory, tools } from "@/lib/tools-registry";
import { PdfMergerTool } from "@/components/tools/pdf/pdf-merger-tool";
import { PdfSplitterTool } from "@/components/tools/pdf/pdf-splitter-tool";
import { PdfRotatorTool } from "@/components/tools/pdf/pdf-rotator-tool";
import { PdfFormFillerTool } from "@/components/tools/pdf/pdf-form-filler-tool";
import { PdfToImageTool } from "@/components/tools/pdf/pdf-to-image-tool";

import { WordCounterTool } from "@/components/tools/text/word-counter-tool";
import { CaseConverterTool } from "@/components/tools/text/case-converter-tool";
import { LoremIpsumTool } from "@/components/tools/text/lorem-ipsum-tool";
import { DuplicateRemoverTool } from "@/components/tools/text/duplicate-remover-tool";
import { TextToSlugTool } from "@/components/tools/text/text-to-slug-tool";
import { TextSorterTool } from "@/components/tools/text/text-sorter-tool";
import { FindReplaceTool } from "@/components/tools/text/find-replace-tool";
import { WhitespaceCleanerTool } from "@/components/tools/text/whitespace-cleaner-tool";

import { JsonFormatterTool } from "@/components/tools/developer/json-formatter-tool";
import { JsonToCsvTool } from "@/components/tools/data-file/json-to-csv-tool";
import { CsvToJsonTool } from "@/components/tools/data-file/csv-to-json-tool";
import { YamlJsonConverterTool } from "@/components/tools/data-file/yaml-json-converter-tool";
import { FileChecksumTool } from "@/components/tools/data-file/file-checksum-tool";
import { Base64EncoderTool } from "@/components/tools/developer/base64-encoder-tool";
import { HtmlEntityEncoderTool } from "@/components/tools/developer/html-entity-encoder-tool";
import { RegexTesterTool } from "@/components/tools/developer/regex-tester-tool";
import { MarkdownToHtmlTool } from "@/components/tools/developer/markdown-to-html-tool";
import { UuidGeneratorTool } from "@/components/tools/developer/uuid-generator-tool";
import { HashGeneratorTool } from "@/components/tools/developer/hash-generator-tool";
import { JwtDecoderTool } from "@/components/tools/developer/jwt-decoder-tool";
import { CronBuilderTool } from "@/components/tools/developer/cron-builder-tool";
import { CssBoxShadowTool } from "@/components/tools/developer/css-box-shadow-tool";

import { NumberBaseConverterTool } from "@/components/tools/converters/number-base-converter-tool";
import { AgeCalculatorTool } from "@/components/tools/converters/age-calculator-tool";
import { PercentageCalculatorTool } from "@/components/tools/converters/percentage-calculator-tool";
import { RomanNumeralTool } from "@/components/tools/converters/roman-numeral-tool";
import { UnitConverterTool } from "@/components/tools/converters/unit-converter-tool";
import { CurrencyConverterTool } from "@/components/tools/converters/currency-converter-tool";
import { TimezoneConverterTool } from "@/components/tools/converters/timezone-converter-tool";
import { CalorieCalculatorTool } from "@/components/tools/converters/calorie-calculator-tool";
import { ScientificCalculatorTool } from "@/components/tools/converters/scientific-calculator-tool";
import { StatisticsCalculatorTool } from "@/components/tools/converters/statistics-calculator-tool";

import { PasswordGeneratorTool } from "@/components/tools/security/password-generator-tool";
import { PasswordStrengthTool } from "@/components/tools/security/password-strength-tool";
import { TextEncryptorTool } from "@/components/tools/security/text-encryptor-tool";

import { ColorConverterTool } from "@/components/tools/design/color-converter-tool";
import { ContrastCheckerTool } from "@/components/tools/design/contrast-checker-tool";
import { CssGradientTool } from "@/components/tools/design/css-gradient-tool";
import { BorderRadiusTool } from "@/components/tools/design/border-radius-tool";
import { ColorPaletteTool } from "@/components/tools/design/color-palette-tool";

import { PinToolHeaderAction } from "@/components/tools/pin-tool-header-action";
import { PinToolPrompt } from "@/components/tools/pin-tool-prompt";

import { StopwatchTool } from "@/components/tools/clock/stopwatch-tool";
import { CountdownTimerTool } from "@/components/tools/clock/countdown-timer-tool";
import { AlarmClockTool } from "@/components/tools/clock/alarm-clock-tool";
import { WorldClockTool } from "@/components/tools/clock/world-clock-tool";
import { TimezonePlannerTool } from "@/components/tools/clock/timezone-planner-tool";
import { SunriseSunsetTool } from "@/components/tools/clock/sunrise-sunset-tool";
import { TimeElapsedTool } from "@/components/tools/clock/time-elapsed-tool";

import { CurrentWeatherTool } from "@/components/tools/weather/current-weather-tool";
import { WeatherForecastTool } from "@/components/tools/weather/weather-forecast-tool";
import { AirQualityTool } from "@/components/tools/weather/air-quality-tool";
import { UvIndexTool } from "@/components/tools/weather/uv-index-tool";
import { RainHumidityTool } from "@/components/tools/weather/rain-humidity-tool";
import { WindSpeedTool } from "@/components/tools/weather/wind-speed-tool";
import { WeatherWidgetTool } from "@/components/tools/weather/weather-widget-tool";

import { TodoListTool } from "@/components/tools/todo-task/todo-list-tool";
import { DailyPlannerTool } from "@/components/tools/todo-task/daily-planner-tool";
import { SharedChecklistTool } from "@/components/tools/todo-task/shared-checklist-tool";
import { GroceryListTool } from "@/components/tools/todo-task/grocery-list-tool";
import { RecurringTaskTool } from "@/components/tools/todo-task/recurring-task-tool";
import { KanbanBoardTool } from "@/components/tools/todo-task/kanban-board-tool";
import { PriorityMatrixTool } from "@/components/tools/todo-task/priority-matrix-tool";

import { TextDiffTool } from "@/components/tools/text-writing/text-diff-tool";
import { FancyTextTool } from "@/components/tools/text-writing/fancy-text-tool";
import { ReadabilityScorerTool } from "@/components/tools/text-writing/readability-scorer-tool";
import { LineNumbersTool } from "@/components/tools/text-writing/line-numbers-tool";


import { DaysUntilSinceTool } from "@/components/tools/calendar/days-until-since-tool";
import { DateAddSubtractTool } from "@/components/tools/calendar/date-add-subtract-tool";
import { WorkingDaysTool } from "@/components/tools/calendar/working-days-tool"
import { WeekNumberTool } from "@/components/tools/calendar/week-number-tool"
import { PrintableCalendarTool } from "@/components/tools/calendar/printable-calendar-tool"
import { EventCountdownTool } from "@/components/tools/calendar/event-countdown-tool";

import { MetaTagGeneratorTool } from "@/components/tools/seo/meta-tag-generator-tool";
import { RobotsTxtGeneratorTool } from "@/components/tools/seo/robots-txt-generator-tool";
import { KeywordDensityTool } from "@/components/tools/seo/keyword-density-tool";

import { TwitterCounterTool } from "@/components/tools/social-media/twitter-counter-tool";
import { HashtagGeneratorTool } from "@/components/tools/social-media/hashtag-generator-tool";
import { YoutubeTesterTool } from "@/components/tools/social-media/youtube-tester-tool";
import { EmojiPickerTool } from "@/components/tools/social-media/emoji-picker-tool";

import { ImageToBase64Tool } from "@/components/tools/image/image-to-base64-tool";
import { ImageToPdfTool } from "@/components/tools/image/image-to-pdf-tool";
import { ImageFormatConverterTool } from "@/components/tools/image/image-format-converter-tool";
import { ImageCompressorTool } from "@/components/tools/image/image-compressor-tool";
import { ImageResizerTool } from "@/components/tools/image/image-resizer-tool";
import { WatermarkAdderTool } from "@/components/tools/image/watermark-adder-tool";
import { ColorPickerImageTool } from "@/components/tools/image/color-picker-image-tool";
import { PlaceholderImageTool } from "@/components/tools/design/placeholder-image-tool";
import { SocialImageResizerTool } from "@/components/tools/social-media/social-image-resizer-tool";
import { QrCodeGeneratorTool } from "@/components/tools/link-url/qr-code-generator-tool";
import { UrlEncodeDecodeTool } from "@/components/tools/link-url/url-encode-decode-tool";
import { UtmBuilderTool } from "@/components/tools/link-url/utm-builder-tool";
import { OnlineNotepadTool } from "@/components/tools/general/online-notepad-tool";
import { ScreenResolutionTool } from "@/components/tools/general/screen-resolution-tool";
import { BrowserInfoTool } from "@/components/tools/general/browser-info-tool";
import { ClipboardManagerTool } from "@/components/tools/general/clipboard-manager-tool";

import { GstCalculatorTool } from "@/components/tools/finance/gst-calculator-tool";
import { EmiCalculatorTool } from "@/components/tools/finance/emi-calculator-tool";
import { TipCalculatorTool } from "@/components/tools/finance/tip-calculator-tool";
import { DiscountCalculatorTool } from "@/components/tools/finance/discount-calculator-tool";
import { SalaryCalculatorTool } from "@/components/tools/finance/salary-calculator-tool";
import { SipCalculatorTool } from "@/components/tools/finance/sip-calculator-tool";
import { FdRdCalculatorTool } from "@/components/tools/finance/fd-rd-calculator-tool";

import { BmiCalculatorTool } from "@/components/tools/health/bmi-calculator-tool";
import { WaterIntakeTool } from "@/components/tools/health/water-intake-tool";
import { OneRepMaxTool } from "@/components/tools/health/one-rep-max-tool";
import { BodyFatTool } from "@/components/tools/health/body-fat-tool";
import { RunningPaceTool } from "@/components/tools/health/running-pace-tool";
import { StepsConverterTool } from "@/components/tools/health/steps-converter-tool";

import { PomodoroTimerTool } from "@/components/tools/education/pomodoro-timer-tool";
import { GpaCalculatorTool } from "@/components/tools/education/gpa-calculator-tool";
import { YoutubeThumbnailTool } from "@/components/tools/video/youtube-thumbnail-tool";
import { SqlFormatterTool } from "@/components/tools/developer/sql-formatter-tool";
import { XmlJsonConverterTool } from "@/components/tools/developer/xml-json-converter-tool";
import { IpLookupTool } from "@/components/tools/security/ip-lookup-tool";
import { CodeMinifierTool } from "@/components/tools/developer/code-minifier-tool";
import { PdfCompressorTool } from "@/components/tools/pdf/pdf-compressor-tool";
import { CsvEditorTool } from "@/components/tools/data-file/csv-editor-tool";
import { MultiplicationTableTool } from "@/components/tools/education/multiplication-table-tool";

import { TextToSpeechTool } from "@/components/tools/language/text-to-speech-tool";
import { MorseCodeTool } from "@/components/tools/language/morse-code-tool";
import { BrailleConverterTool } from "@/components/tools/language/braille-converter-tool";
import { BarcodeGeneratorTool } from "@/components/tools/ecommerce/barcode-generator-tool";

import { MyIpTool } from "@/components/tools/network/my-ip-tool";

import { RecipeConverterTool } from "@/components/tools/food-cooking/recipe-converter-tool";
import { CookingTimerTool } from "@/components/tools/food-cooking/cooking-timer-tool";

import { SaleCalculatorTool } from "@/components/tools/shopping/sale-calculator-tool";

import { FuelCostTool } from "@/components/tools/travel/fuel-cost-tool";
import { SpeedDistanceTimeControl } from "@/components/tools/travel/speed-distance-time-tool";

import { RandomPickerTool } from "@/components/tools/fun-viral/random-picker-tool";
import { TruthOrDareTool } from "@/components/tools/fun-viral/truth-or-dare-tool"
import { UsernameGeneratorTool } from "@/components/tools/fun-viral/username-generator-tool";
import { FakeTweetMakerTool } from "@/components/tools/fun-viral/fake-tweet-maker-tool";

import { InstagramFormatterTool } from "@/components/tools/social-media/instagram-formatter-tool";

import { DateDifferenceTool } from "@/components/tools/converters/date-difference-tool";
import { FractionSimplifierTool } from "@/components/tools/converters/fraction-simplifier-tool";

import { FakeDataTool } from "@/components/tools/security/fake-data-tool";

// Mapping of category -> tool slug -> component
const TOOL_COMPONENTS: Record<string, Record<string, React.ComponentType>> = {
  "pdf": {
    "pdf-merger": PdfMergerTool,
    "pdf-splitter": PdfSplitterTool,
    "pdf-rotator": PdfRotatorTool,
    "pdf-form-filler": PdfFormFillerTool,
    "pdf-to-image": PdfToImageTool,
  },
  "data-file": {
    "csv-to-json": CsvToJsonTool,
    "json-to-csv": JsonToCsvTool,
    "csv-viewer": CsvEditorTool,
    "yaml-json-converter": YamlJsonConverterTool,
    "file-checksum": FileChecksumTool,
  },
  "text-writing": {
    "word-counter": WordCounterTool,
    "case-converter": CaseConverterTool,
    "lorem-ipsum": LoremIpsumTool,
    "duplicate-remover": DuplicateRemoverTool,
    "text-to-slug": TextToSlugTool,
    "text-sorter": TextSorterTool,
    "find-replace": FindReplaceTool,
    "whitespace-cleaner": WhitespaceCleanerTool,
  },
  "developer": {
    "json-formatter": JsonFormatterTool,
    "base64-encoder": Base64EncoderTool,
    "html-entity-encoder": HtmlEntityEncoderTool,
    "regex-tester": RegexTesterTool,
    "markdown-to-html": MarkdownToHtmlTool,
    "uuid-generator": UuidGeneratorTool,
    "hash-generator": HashGeneratorTool,
    "jwt-decoder": JwtDecoderTool,
    "cron-builder": CronBuilderTool,
    "css-box-shadow": CssBoxShadowTool,
    "sql-formatter": SqlFormatterTool,
    "xml-json-converter": XmlJsonConverterTool,
    "html-css-js-minifier": CodeMinifierTool,
  },
  "converters-calculators": {
    "unit-converter": UnitConverterTool,
    "currency-converter": CurrencyConverterTool,
    "timezone-converter": TimezoneConverterTool,
    "bmi-calculator": BmiCalculatorTool,
    "calorie-calculator": CalorieCalculatorTool,
    "scientific-calculator": ScientificCalculatorTool,
    "statistics-calculator": StatisticsCalculatorTool,
    "number-base-converter": NumberBaseConverterTool,
    "age-calculator": AgeCalculatorTool,
    "percentage-calculator": PercentageCalculatorTool,
    "roman-numeral": RomanNumeralTool,
    "date-difference": DateDifferenceTool,
    "fraction-simplifier": FractionSimplifierTool,
  },
  "link-url": {
    "qr-code-generator": QrCodeGeneratorTool,
    "url-encode-decode": UrlEncodeDecodeTool,
    "utm-builder": UtmBuilderTool,
  },
  "security-privacy": {
    "password-generator": PasswordGeneratorTool,
    "password-strength": PasswordStrengthTool,
    "text-encryptor": TextEncryptorTool,
    "fake-data-generator": FakeDataTool,
    "ip-lookup": IpLookupTool,
  },
  "design-color": {
    "hex-rgb-hsl": ColorConverterTool,
    "contrast-checker": ContrastCheckerTool,
    "gradient-generator": CssGradientTool,
    "border-radius-generator": BorderRadiusTool,
    "color-palette": ColorPaletteTool,
    "placeholder-image": PlaceholderImageTool,
  },
  "clock-time": {
    "stopwatch": StopwatchTool,
    "countdown-timer": CountdownTimerTool,
    "alarm-clock": AlarmClockTool,
    "world-clock": WorldClockTool,
    "timezone-planner": TimezonePlannerTool,
    "sunrise-sunset": SunriseSunsetTool,
    "time-elapsed": TimeElapsedTool,
  },
  "weather": {
    "current-weather": CurrentWeatherTool,
    "weather-forecast": WeatherForecastTool,
    "air-quality": AirQualityTool,
    "uv-index": UvIndexTool,
    "rain-humidity": RainHumidityTool,
    "wind-speed": WindSpeedTool,
    "weather-widget": WeatherWidgetTool,
  },
  "todo-task": {
    "todo-list": TodoListTool,
    "daily-planner": DailyPlannerTool,
    "shared-checklist": SharedChecklistTool,
    "grocery-list": GroceryListTool,
    "recurring-task": RecurringTaskTool,
    "kanban-board": KanbanBoardTool,
    "priority-matrix": PriorityMatrixTool,
  },

  "calendar-date": {
    "days-until-since": DaysUntilSinceTool,
    "date-add-subtract": DateAddSubtractTool,
    "working-days": WorkingDaysTool,
    "week-number": WeekNumberTool,
    "printable-calendar": PrintableCalendarTool,
    "event-countdown": EventCountdownTool,
  },
  "seo-web": {
    "meta-tag-generator": MetaTagGeneratorTool,
    "robots-txt-generator": RobotsTxtGeneratorTool,
    "keyword-density": KeywordDensityTool,
  },
  "social-media": {
    "twitter-counter": TwitterCounterTool,
    "hashtag-generator": HashtagGeneratorTool,
    "youtube-tester": YoutubeTesterTool,
    "emoji-picker": EmojiPickerTool,
    "instagram-formatter": InstagramFormatterTool,
    "social-image-resizer": SocialImageResizerTool,
  },
  "image": {
    "image-to-base64": ImageToBase64Tool,
    "image-format-converter": ImageFormatConverterTool,
    "image-compressor": ImageCompressorTool,
    "image-resizer": ImageResizerTool,
    "watermark-adder": WatermarkAdderTool,
    "color-picker-image": ColorPickerImageTool,
    "image-to-pdf": ImageToPdfTool,
    "pdf-compressor": PdfCompressorTool,
  },
  "general-productivity": {
    "online-notepad": OnlineNotepadTool,
    "screen-resolution": ScreenResolutionTool,
    "browser-info": BrowserInfoTool,
    "clipboard-manager": ClipboardManagerTool,
  },
  "finance-business": {
    "gst-calculator": GstCalculatorTool,
    "emi-calculator": EmiCalculatorTool,
    "tip-calculator": TipCalculatorTool,
    "discount-calculator": DiscountCalculatorTool,
    "salary-calculator": SalaryCalculatorTool,
    "sip-calculator": SipCalculatorTool,
    "fd-calculator": FdRdCalculatorTool,
  },
  "health-fitness": {
    "bmi-ideal-weight": BmiCalculatorTool,
    "water-intake": WaterIntakeTool,
    "one-rep-max": OneRepMaxTool,
    "body-fat": BodyFatTool,
    "running-pace": RunningPaceTool,
    "steps-converter": StepsConverterTool,
  },
  "education-learning": {
    "pomodoro-timer": PomodoroTimerTool,
  },
  "student-education": {
    "pomodoro-timer": PomodoroTimerTool, // Added alias because registry says student-education
    "gpa-calculator": GpaCalculatorTool,
    "multiplication-table": MultiplicationTableTool,
  },
  "language-translation": {
    "text-to-speech": TextToSpeechTool,
    "morse-code": MorseCodeTool,
    "braille-converter": BrailleConverterTool,
  },
  "ecommerce-seller": {
    "barcode-generator": BarcodeGeneratorTool,
  },
  "mobile-app": {
    "my-ip": MyIpTool,
  },
  "network-web": {
    "my-ip": MyIpTool,
  },
  "food-cooking": {
    "recipe-converter": RecipeConverterTool,
    "cooking-timer": CookingTimerTool,
  },
  "shopping-deals": {
    "sale-calculator": SaleCalculatorTool,
  },
  "travel-commute": {
    "fuel-calculator": FuelCostTool,
    "speed-distance-time": SpeedDistanceTimeControl,
  },
  "fun-viral": {
    "random-picker": RandomPickerTool,
    "truth-or-dare": TruthOrDareTool,
    "username-generator": UsernameGeneratorTool,
    "fake-tweet-maker": FakeTweetMakerTool,
  },
  "video-audio-download": {
    "youtube-thumbnail": YoutubeThumbnailTool,
  },
};

interface ToolPageProps {
  params: Promise<{ category: string; tool: string }>;
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    category: tool.category,
    tool: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { category, tool: toolSlug } = await params;
  const toolData = getToolBySlug(category, toolSlug);
  const cat = getCategoryBySlug(category);

  if (!toolData || !cat) return {};

  const fullDescription = `${toolData.description}. Free online ${toolData.name.toLowerCase()} tool — no signup required. Works in your browser on kraaft.`;

  return {
    title: `${toolData.name} — Free Online Tool`,
    description: fullDescription,
    keywords: [toolData.name, ...toolData.tags, cat.name, "free online tool", "no signup"],
    alternates: {
      canonical: `/${category}/${toolSlug}`,
    },
    openGraph: {
      title: `${toolData.name} | kraaft`,
      description: fullDescription,
      url: `https://kraaft.manieshsanwal.in/${category}/${toolSlug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${toolData.name} | kraaft`,
      description: toolData.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { category, tool: toolSlug } = await params;
  const cat = getCategoryBySlug(category);
  const toolData = getToolBySlug(category, toolSlug);

  if (!cat || !toolData) notFound();

  const relatedTools = getToolsByCategory(cat.slug)
    .filter((t) => t.slug !== toolData.slug)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolData.name,
    description: toolData.description,
    url: `https://kraaft.manieshsanwal.in/${category}/${toolSlug}`,
    applicationCategory: cat.name,
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "kraaft",
      url: "https://kraaft.manieshsanwal.in",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://kraaft.manieshsanwal.in" },
        { "@type": "ListItem", position: 2, name: cat.name, item: `https://kraaft.manieshsanwal.in/${category}` },
        { "@type": "ListItem", position: 3, name: toolData.name, item: `https://kraaft.manieshsanwal.in/${category}/${toolSlug}` },
      ],
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${cat.slug}`}>{cat.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{toolData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="animate-fade-in">
          {/* Tool header */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{cat.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap justify-between">
                  <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                    {toolData.name}
                  </h1>
                  {toolData.status === "coming-soon" ? (
                    <Badge variant="outline">Coming Soon</Badge>
                  ) : (
                    ""
                  )}
                  {toolData.isTrending && (
                    <Badge variant="secondary">🔥 Trending</Badge>
                  )}
                  <div className="hidden md:block ">
                    <PinToolHeaderAction toolSlug={toolData.slug} />
                  </div>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {toolData.description}
                </p>

                <Separator className="mt-4 md:hidden" />
                <div className="md:hidden mt-4">
                  <PinToolHeaderAction toolSlug={toolData.slug} />
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Tool content area */}
          {(() => {
            const Component = TOOL_COMPONENTS[cat.slug]?.[toolData.slug];
            if (Component) return <Component />;

            return (
              <Card className="min-h-[400px]">
                <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                  <span className="text-6xl animate-float">{cat.emoji}</span>
                  <h2 className="font-heading text-xl font-semibold text-muted-foreground">
                    Coming Soon
                  </h2>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    We&apos;re building this tool. Check back soon or explore other
                    tools in the{" "}
                    <Link
                      href={`/${cat.slug}`}
                      className="text-primary underline underline-offset-4"
                    >
                      {cat.name}
                    </Link>{" "}
                    category.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          <PinToolPrompt />
        </div>

        {/* Sidebar — related tools */}
        <aside className="animate-slide-up opacity-0 stagger-4">
          <div className="sticky top-24">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Related Tools
            </h3>
            <div className="flex flex-col gap-3">
              {relatedTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${cat.slug}/${t.slug}`}
                  className="group"
                >
                  <Card className="transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                        {t.name}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-1">
                        {t.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            <Separator className="my-4" />

            <Link
              href={`/${cat.slug}`}
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              ← All {cat.name}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
