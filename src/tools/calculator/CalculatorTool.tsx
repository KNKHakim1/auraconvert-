"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

// Safe Math Evaluator
function evaluateMath(expression: string): number {
  // 1. Remove all spaces
  let expr = expression.replace(/\s+/g, "");
  
  // 2. Validate charset (only digits, dots, basic operators, parens)
  if (!/^[0-9+\-*/%().]+$/.test(expr)) {
    throw new Error("Invalid expression");
  }

  // Handle percentages like "50%" -> "(50/100)"
  expr = expr.replace(/([0-9.]+)(%)/g, "($1/100)");

  // 3. Tokenizer
  const tokens: string[] = [];
  let currentNum = "";

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (/[0-9.]/.test(char)) {
      currentNum += char;
    } else {
      if (currentNum) {
        tokens.push(currentNum);
        currentNum = "";
      }
      // Handle negative numbers (unary minus)
      if (char === "-" && (i === 0 || /[(+\-*/]/.test(expr[i - 1]))) {
        currentNum = "-";
      } else {
        tokens.push(char);
      }
    }
  }
  if (currentNum && currentNum !== "-") {
    tokens.push(currentNum);
  }

  // 4. Shunting-yard Algorithm
  const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const output: string[] = [];
  const operators: string[] = [];

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      output.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        output.push(operators.pop()!);
      }
      if (operators.length) operators.pop(); // pop "("
    } else if (["+", "-", "*", "/"].includes(token)) {
      while (
        operators.length &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    }
  }
  while (operators.length) {
    output.push(operators.pop()!);
  }

  // 5. Evaluate RPN
  const stack: number[] = [];
  for (const token of output) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      if (token === "+") stack.push(a + b);
      else if (token === "-") stack.push(a - b);
      else if (token === "*") stack.push(a * b);
      else if (token === "/") {
        if (b === 0) throw new Error("Division by zero");
        stack.push(a / b);
      }
    }
  }

  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

export function CalculatorTool() {
  const { t } = useTranslations();
  
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  const handleInput = (val: string) => {
    setError(null);
    if (result !== null && !["+", "-", "*", "/", "%"].includes(val)) {
      setExpression(val);
      setResult(null);
    } else if (result !== null) {
      setExpression(result + val);
      setResult(null);
    } else {
      setExpression(prev => prev + val);
    }
  };

  const calculate = () => {
    if (!expression) return;
    try {
      const res = evaluateMath(expression);
      // Format number to avoid floating point issues (e.g. 0.1 + 0.2)
      const resStr = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(10)).toString();
      
      if (resStr === "NaN" || resStr === "Infinity" || resStr === "-Infinity") {
        setError(t("tools.calculator.errorInvalid"));
        return;
      }

      setResult(resStr);
      setHistory(prev => [{ expr: expression, res: resStr }, ...prev].slice(0, 10)); // Keep last 10
      setError(null);
    } catch (err: any) {
      if (err.message === "Division by zero") {
        setError(t("tools.calculator.errorDivZero"));
      } else {
        setError(t("tools.calculator.errorInvalid"));
      }
    }
  };

  const clear = () => {
    setExpression("");
    setResult(null);
    setError(null);
  };

  const del = () => {
    if (result !== null) {
      setResult(null);
    } else {
      setExpression(prev => prev.slice(0, -1));
    }
    setError(null);
  };

  const copyResult = () => {
    const textToCopy = result !== null ? result : expression;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9+\-*/().%]/.test(key)) {
        e.preventDefault();
        handleInput(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        calculate();
      } else if (key === "Backspace") {
        e.preventDefault();
        del();
      } else if (key === "Escape" || key === "c" || key === "C") {
        e.preventDefault();
        clear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression, result]);

  const buttons = [
    { label: "(", action: () => handleInput("(") },
    { label: ")", action: () => handleInput(")") },
    { label: "%", action: () => handleInput("%") },
    { label: "AC", action: clear, class: "text-destructive" },
    
    { label: "7", action: () => handleInput("7") },
    { label: "8", action: () => handleInput("8") },
    { label: "9", action: () => handleInput("9") },
    { label: "÷", action: () => handleInput("/"), class: "text-primary" },
    
    { label: "4", action: () => handleInput("4") },
    { label: "5", action: () => handleInput("5") },
    { label: "6", action: () => handleInput("6") },
    { label: "×", action: () => handleInput("*"), class: "text-primary" },
    
    { label: "1", action: () => handleInput("1") },
    { label: "2", action: () => handleInput("2") },
    { label: "3", action: () => handleInput("3") },
    { label: "-", action: () => handleInput("-"), class: "text-primary" },
    
    { label: "0", action: () => handleInput("0") },
    { label: ".", action: () => handleInput(".") },
    { label: "DEL", action: del, class: "text-orange-500" },
    { label: "+", action: () => handleInput("+"), class: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      
      {/* Calculator Body */}
      <div className="lg:col-span-2 bg-background border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6 select-none">
        
        {/* Display */}
        <div className="bg-secondary/20 border border-border rounded-2xl p-4 flex flex-col justify-end min-h-[120px] relative">
          <button 
            onClick={copyResult}
            className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors"
            title="Copy"
          >
            {showCopied ? <Icon name="check" className="w-5 h-5 text-green-500" /> : <Icon name="copy" className="w-5 h-5" />}
          </button>

          <div className="text-right w-full overflow-x-auto custom-scrollbar pb-1">
            <p className="text-muted-foreground text-sm tracking-wider min-h-[20px]">
              {expression || "\u00A0"}
            </p>
            <p className={cn("text-4xl font-bold tracking-tight mt-1", error ? "text-destructive text-xl" : "text-foreground")}>
              {error ? error : result !== null ? result : "\u00A0"}
            </p>
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className={cn(
                "h-14 sm:h-16 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border/50 text-xl font-medium transition-all active:scale-95",
                btn.class || "text-foreground"
              )}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={calculate}
            className="col-span-4 h-14 sm:h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            =
          </button>
        </div>
      </div>

      {/* History */}
      <div className="lg:col-span-1 bg-background border border-border rounded-3xl p-6 shadow-sm flex flex-col max-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{t("tools.calculator.history")}</h3>
          {history.length > 0 && (
            <button 
              onClick={() => setHistory([])}
              className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded transition-colors"
            >
              {t("tools.calculator.clearHistory")}
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center mt-10">No history</p>
          ) : (
            history.map((h, i) => (
              <div 
                key={i} 
                className="p-3 bg-secondary/20 rounded-xl cursor-pointer hover:bg-secondary/40 transition-colors text-right"
                onClick={() => { setExpression(h.expr); setResult(h.res); setError(null); }}
              >
                <p className="text-xs text-muted-foreground">{h.expr}</p>
                <p className="font-semibold text-foreground">{h.res}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
