import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Trash2, Info } from "lucide-react";
import { getLangFromUrl, useTranslations } from '@/i18n/utils';

export default function InvisibleTextTool(props: { astroUrl: string }) {
  // State for Method 1
  const [copiedSmall, setCopiedSmall] = useState(false);
  const [copiedMedium, setCopiedMedium] = useState(false);
  const [copiedLarge, setCopiedLarge] = useState(false);

  // State for Method 2
  const [manualVisible, setManualVisible] = useState(false);
  const manualTextRef = useRef<HTMLDivElement>(null);

  // State for Method 3
  const [charCount, setCharCount] = useState(1);
  const [generatedText, setGeneratedText] = useState("");
  const [generatedCopied, setGeneratedCopied] = useState(false);

  // State for Test & Copy
  const [testText, setTestText] = useState("");
  const [charCountTest, setCharCountTest] = useState(0);

  // Common invisible character
  const invisibleChar = "\u200B"; // zero-width space

  // Method 1 handlers
  const copySmall = () => {
    navigator.clipboard.writeText(invisibleChar);
    setCopiedSmall(true);
    setTimeout(() => setCopiedSmall(false), 2000);
  };
  const copyMedium = () => {
    navigator.clipboard.writeText(invisibleChar.repeat(5));
    setCopiedMedium(true);
    setTimeout(() => setCopiedMedium(false), 2000);
  };
  const copyLarge = () => {
    navigator.clipboard.writeText(invisibleChar.repeat(10));
    setCopiedLarge(true);
    setTimeout(() => setCopiedLarge(false), 2000);
  };

  // Method 2 handler
  const selectManualText = () => {
    setManualVisible(true);
    if (manualTextRef.current) {
      const range = document.createRange();
      range.selectNodeContents(manualTextRef.current);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      navigator.clipboard.writeText(invisibleChar);
    }
  };

  // Method 3 handlers
  const generateInvisibleChars = () => {
    const count = Math.max(1, Math.min(1000, charCount));
    setGeneratedText(invisibleChar.repeat(count));
  };
  const copyGenerated = () => {
    navigator.clipboard.writeText(generatedText);
    setGeneratedCopied(true);
    setTimeout(() => setGeneratedCopied(false), 2000);
  };

  // Test & Copy handlers
  const handleTestTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTestText(text);
    const visible = text.replace(/\u200B/g, "");
    setCharCountTest(text.length - visible.length);
  };
  const clearTestText = () => {
    setTestText("");
    setCharCountTest(0);
  };

  // Internationalization
  const lang = getLangFromUrl(props.astroUrl);
  const t = useTranslations(lang);

  return (
    <Card className="max-w-4xl mx-auto border-2 border-black rounded-xl shadow-lg">
      <CardContent className="p-4">
        <Tabs defaultValue="method1" className="w-full ">
          <TabsList className="grid grid-cols-2 gap-4 mb-2">
            <TabsTrigger value="method1" className="data-[state=active]:bg-black data-[state=active]:text-white">{t("tabs.quickCopy")}</TabsTrigger>
            <TabsTrigger value="method2" className="data-[state=active]:bg-black data-[state=active]:text-white">{t("tabs.manualSelect")}</TabsTrigger>
          </TabsList>
          <TabsList className="grid grid-cols-2 gap-4 mb-4 ">
            <TabsTrigger value="method3" className="data-[state=active]:bg-black data-[state=active]:text-white">{t("tabs.customGenerator")}</TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-black data-[state=active]:text-white">{t("tabs.testCopy")}</TabsTrigger>
          </TabsList>

          {/* Method 1 */}
          <TabsContent value="method1" className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-2 border-black">
              <h3 className="text-xl font-bold mb-4">{t("method1.title")}</h3>
              <p className="mb-6">{t("method1.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button onClick={copySmall} variant="outline" className="border-2 border-black hover:bg-emerald-50 flex items-center gap-2">
                  {t("btn.copySmall")} {copiedSmall ? <Check className="h-5 w-5 text-emerald-500"/> : <Copy className="h-5 w-5"/>}
                </Button>
                <Button onClick={copyMedium} variant="outline" className="border-2 border-black hover:bg-emerald-50 flex items-center gap-2">
                  {t("btn.copyMedium")} {copiedMedium ? <Check className="h-5 w-5 text-emerald-500"/> : <Copy className="h-5 w-5"/>}
                </Button>
                <Button onClick={copyLarge} variant="outline" className="border-2 border-black hover:bg-emerald-50 flex items-center gap-2">
                  {t("btn.copyLarge")} {copiedLarge ? <Check className="h-5 w-5 text-emerald-500"/> : <Copy className="h-5 w-5"/>}
                </Button>
              </div>
              <p className="text-sm text-gray-600">{t("method1.note")}</p>
            </div>
          </TabsContent>

          {/* Method 2 */}
          <TabsContent value="method2" className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-2 border-black">
              <h3 className="text-xl font-bold mb-4">{t("method2.title")}</h3>
              <p className="mb-6">{t("method2.description")}</p>
              <div className="mb-6">
                <div ref={manualTextRef} className="w-full h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-4">
                  {manualVisible ? invisibleChar : ''}
                </div>
                <Button onClick={selectManualText} className="bg-black hover:bg-gray-800 text-white">{t("method2.select")}</Button>
              </div>
              <p className="text-sm text-gray-600">{t("method2.note")}</p>
            </div>
          </TabsContent>

          {/* Method 3 */}
          <TabsContent value="method3" className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-2 border-black">
              <h3 className="text-xl font-bold mb-4">{t("method3.title")}</h3>
              <p className="mb-6">{t("method3.description")}</p>
              <div className="flex gap-4 mb-6">
                <Input type="number" min={1} max={1000} value={charCount} onChange={e => setCharCount(parseInt(e.target.value) || 1)} className="border-2 border-black w-full max-w-xs" />
                <Button onClick={generateInvisibleChars} className="bg-black hover:bg-gray-800 text-white">{t("method3.generate")}</Button>
              </div>
              {generatedText && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{t("method3.generatedText")}</p>
                    <Button onClick={copyGenerated} variant="outline" size="sm" className="border-2 border-black hover:bg-emerald-50 flex items-center gap-2">
                      {generatedCopied ? <><Check className="h-4 w-4 text-emerald-500"/>{t("method3.copied")}</> : <><Copy className="h-4 w-4"/>{t("method3.copy")}</>}
                    </Button>
                  </div>
                  <div className="p-4 border-2 border-dashed border-gray-400 rounded-lg min-h-[60px] flex items-center justify-center">
                    <span className="text-gray-400 text-sm">{charCount} {t("method3.charactersGenerated")}</span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Test & Copy */}
          <TabsContent value="test" className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-2 border-black">
              <h3 className="text-xl font-bold mb-4">{t("test.title")}</h3>
              <p className="mb-6">{t("test.description")}</p>
              <Textarea value={testText} onChange={handleTestTextChange} placeholder={t("test.placeholder")} className="min-h-[120px] border-2 border-black rounded-lg mb-4" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("test.characters")}:</span>
                  <span className="font-mono">{charCountTest}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={clearTestText} variant="outline" size="sm" className="border-2 border-black hover:bg-red-50 flex items-center gap-2"><Trash2 className="h-4 w-4"/>{t("test.clear")}</Button>
                  <Button onClick={() => navigator.clipboard.writeText(testText)} variant="outline" size="sm" className="border-2 border-black hover:bg-emerald-50 flex items-center gap-2"><Copy className="h-4 w-4"/>{t("test.copy")}</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200 flex gap-3">
          <Info className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800"><strong>{t("proTip.title")}:</strong> {t("proTip.content")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
