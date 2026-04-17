"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Copy as CopyIcon, ArrowsClockwise as RefreshIcon, Envelope as MailIcon, PaperPlaneTilt as PlaneIcon, Info as InfoIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

interface EmailMessage {
  id: number;
  from: string;
  subject: string;
  date: string;
}

interface FullMessage extends EmailMessage {
  textBody: string;
  htmlBody: string;
}

export function TempEmailTool() {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [messages, setMessages] = React.useState<EmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = React.useState<FullMessage | null>(null);
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const generateEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
      const [newEmail] = await response.json();
      setEmailAddress(newEmail);
      setMessages([]);
      setSelectedMessage(null);
    } catch (err) {
      console.error("Failed to generate email", err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkInbox = async (showLoadingObj = true) => {
    if (!emailAddress) return;
    if (showLoadingObj) setIsRefreshing(true);
    
    // Parse login and domain
    const [login, domain] = emailAddress.split("@");
    
    try {
      const response = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to check inbox", err);
    } finally {
      if (showLoadingObj) setIsRefreshing(false);
    }
  };

  const readMessage = async (id: number) => {
    const [login, domain] = emailAddress.split("@");
    try {
      const response = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
      const data = await response.json();
      setSelectedMessage(data);
    } catch (err) {
      console.error("Failed to read message", err);
    }
  };

  const copyToClipboard = () => {
    if (emailAddress) {
      navigator.clipboard.writeText(emailAddress);
    }
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <div className="bg-primary/5 border-b border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailIcon className="h-6 w-6 text-primary" weight="duotone" />
            Temporary Email
          </CardTitle>
          <CardDescription>Instantly generate a disposable email address to avoid spam and protect your privacy.</CardDescription>
        </CardHeader>
      </div>
      
      <CardContent className="p-0">
        <div className="p-6">
          {!emailAddress ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
              <PlaneIcon weight="duotone" className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No active inbox</h3>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">Create a temporary email address to receive activation links, newsletters, and more without exposing your real email.</p>
              <Button size="lg" onClick={generateEmail} disabled={isLoading} className="px-8 rounded-full shadow-md">
                {isLoading ? "Generating..." : "Generate New Inbox"}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-xl bg-background shadow-sm">
                <div className="w-full flex-1">
                  <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Your temporary email address</div>
                  <div className="flex items-center">
                    <Input 
                      value={emailAddress} 
                      readOnly 
                      className="text-lg h-12 font-mono bg-muted/30 border-r-0 rounded-r-none focus-visible:ring-0" 
                    />
                    <Button onClick={copyToClipboard} size="icon" className="h-12 w-16 rounded-l-none border border-l-0" variant="secondary">
                      <CopyIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <Button variant="outline" className="h-12 w-full md:w-auto" onClick={() => checkInbox()} disabled={isRefreshing}>
                    <RefreshIcon className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button variant="ghost" className="h-12 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { setEmailAddress(""); setMessages([]); setSelectedMessage(null); }}>
                    Discard
                  </Button>
                </div>
              </div>

              {!selectedMessage ? (
                <div className="border rounded-xl overflow-hidden bg-muted/10 shadow-sm">
                  <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2">
                      Inbox
                      <Badge variant="secondary" className="font-mono">{messages.length}</Badge>
                    </h3>
                  </div>
                  
                  {messages.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                      <RefreshIcon className={`h-10 w-10 mb-3 opacity-30 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <p>Waiting for incoming emails...</p>
                      <p className="text-xs mt-2 opacity-70">Inbox refreshes automatically every 15s when active</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className="p-4 hover:bg-background cursor-pointer transition-colors group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6"
                          onClick={() => readMessage(msg.id)}
                        >
                          <div className="w-full sm:w-1/3 truncate font-medium text-sm group-hover:text-primary transition-colors">{msg.from}</div>
                          <div className="w-full sm:w-1/2 truncate text-sm text-muted-foreground">{msg.subject || "(No Subject)"}</div>
                          <div className="w-full sm:w-1/6 text-xs text-muted-foreground text-left sm:text-right font-mono">{msg.date.split(" ")[1]}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden shadow-sm flex flex-col animate-in slide-in-from-right-4">
                  <div className="p-4 border-b bg-muted/30 flex justify-between items-center sticky top-0">
                    <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                      ← Back to Inbox
                    </Button>
                  </div>
                  <div className="p-6 border-b bg-background space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">From</div>
                      <div className="font-medium text-lg">{selectedMessage.from}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Subject</div>
                      <div className="font-medium">{selectedMessage.subject || "(No Subject)"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</div>
                      <div className="text-sm font-mono">{selectedMessage.date}</div>
                    </div>
                  </div>
                  <div className="p-6 min-h-[300px] bg-background">
                    {/* Securely render HTML if available, otherwise text */}
                    {selectedMessage.htmlBody ? (
                      <iframe 
                        srcDoc={selectedMessage.htmlBody} 
                        className="w-full h-[50vh] min-h-[400px] border-0" 
                        sandbox="" 
                        title="email-content"
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans text-sm mt-0 dark:text-gray-300">
                        {selectedMessage.textBody || "Message is empty"}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 border-t border-yellow-100 dark:border-yellow-900/50 flex gap-3 text-yellow-800 dark:text-yellow-400/80">
          <InfoIcon className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            Temporary emails are public. <strong>Do not use this for sensitive services or personal accounts.</strong> Emails are automatically deleted by the server and cannot be recovered after an address is discarded.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
