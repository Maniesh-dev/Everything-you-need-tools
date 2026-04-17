"use client";

import * as React from "react";
import Papa from "papaparse";
import { Table, Download, FileCsv, Plus, Trash, FileArrowDown, Eraser } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { toast } from "sonner";
import { Input } from "@workspace/ui/components/input";

export function CsvEditorTool() {
  const [data, setData] = React.useState<any[][]>([]);
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          toast.error("CSV data is empty or malformed");
          setLoading(false);
          return;
        }
        const rawData = results.data as any[][];
        if (rawData[0]) {
          setHeaders(rawData[0].map(h => String(h)));
          setData(rawData.slice(1));
          toast.success("CSV loaded successfully!");
        }
        setLoading(false);
      },
      error: (error) => {
        toast.error(`Error parsing CSV: ${error.message}`);
        setLoading(false);
      }
    });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    if (newData[rowIndex]) {
      newData[rowIndex][colIndex] = value;
      setData(newData);
    }
  };

  const handleHeaderChange = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const addRow = () => {
    const newRow = new Array(headers.length).fill("");
    setData([...data, newRow]);
  };

  const addColumn = () => {
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setData(data.map(row => [...row, ""]));
  };

  const deleteRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const deleteColumn = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
    setData(data.map(row => row.filter((_, i) => i !== index)));
  };

  const downloadCsv = () => {
    const csvData = [headers, ...data];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV downloaded!");
  };

  const clearAll = () => {
    setData([]);
    setHeaders([]);
    toast.info("Table cleared");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Table className="h-6 w-6 text-orange-500" />
                CSV Viewer & Editor
              </CardTitle>
              <CardDescription>
                View, edit, and export CSV files in a spreadsheet-like interface.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <FileCsv className="mr-2 h-4 w-4" /> Load CSV
                </label>
              </Button>
              <Button size="sm" onClick={downloadCsv} disabled={headers.length === 0}>
                <FileArrowDown className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {headers.length > 0 ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={addRow} className="h-8">
                  <Plus className="mr-1 h-3 w-3" /> Add Row
                </Button>
                <Button variant="ghost" size="sm" onClick={addColumn} className="h-8">
                  <Plus className="mr-1 h-3 w-3" /> Add Column
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Eraser className="mr-1 h-3 w-3" /> Clear All
                </Button>
              </div>

              <div className="border rounded-lg overflow-auto max-h-[600px] shadow-sm">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-muted z-10 shadow-sm">
                    <tr>
                      <th className="p-2 border bg-muted/50 w-10">#</th>
                      {headers.map((h, i) => (
                        <th key={i} className="p-0 border relative min-w-[150px]">
                          <div className="flex items-center">
                            <input
                              className="w-full p-2 bg-transparent font-bold outline-none focus:bg-background"
                              value={h}
                              onChange={(e) => handleHeaderChange(i, e.target.value)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-red-500"
                              onClick={() => deleteColumn(i)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </th>
                      ))}
                      <th className="p-2 border bg-muted/50 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
                        <td className="p-2 border text-center text-xs text-muted-foreground bg-muted/10">{rowIndex + 1}</td>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="p-0 border">
                            <input
                              className="w-full p-2 bg-transparent outline-none focus:bg-background h-full"
                              value={cell}
                              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            />
                          </td>
                        ))}
                        <td className="p-0 border text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => deleteRow(rowIndex)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
              <Table className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No data loaded yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-6 text-center max-w-[250px]">
                Upload a CSV file or start with a blank table.
              </p>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => { setHeaders(["ID", "Name", "Email"]); setData([["1", "John Doe", "john@example.com"]]); }}>
                  Start with Sample
                </Button>
                <label 
                  htmlFor="csv-upload" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
                >
                  Upload File
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="p-4 bg-muted/30 rounded-lg border border-dashed flex gap-3 text-xs text-muted-foreground">
        <div className="bg-primary/10 p-2 rounded-lg h-fit">
          <Download className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Usage Tip:</p>
          <p>Double-click any cell or header to edit. All changes happen locally in your browser. Use the "Export CSV" button to save your edited file.</p>
        </div>
      </div>
    </div>
  );
}
