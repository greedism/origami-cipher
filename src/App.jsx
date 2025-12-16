import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Play, 
  Plus, 
  X, 
  Lock, 
  Unlock, 
  LayoutGrid, 
  ShieldCheck,
  Terminal
} from 'lucide-react';

const OrigamiCipher = () => {
  const [plaintext, setPlaintext] = useState('HELLOWORLD');
  const [grid, setGrid] = useState([]);
  const [gridWidth, setGridWidth] = useState(5);
  const [foldSequence, setFoldSequence] = useState([]);
  const [currentFold, setCurrentFold] = useState(-1);
  const [ciphertext, setCiphertext] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mathLog, setMathLog] = useState([]);

  useEffect(() => {
    if (!plaintext) return;
    const chars = plaintext.toUpperCase().replace(/[^A-Z]/g, '').split('');
    const rows = Math.ceil(chars.length / gridWidth);
    const newGrid = [];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < gridWidth; j++) {
        const index = i * gridWidth + j;
        row.push({
          char: chars[index] || '',
          value: chars[index] ? chars[index].charCodeAt(0) - 64 : 0,
          visible: true,
          depth: 0
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setCurrentFold(-1);
    setCiphertext('');
  }, [plaintext, gridWidth]);

  const numToChar = (num) => {
    if (num === 0) return '';
    const normalized = ((num - 1) % 26) + 1;
    return String.fromCharCode(normalized + 64);
  };

  const applyFold = (currentGrid, fold) => {
    const newGrid = JSON.parse(JSON.stringify(currentGrid));
    const rows = newGrid.length;
    const cols = newGrid[0].length;

    if (fold.type === 'horizontal') {
      const foldRow = fold.position;
      for (let i = 0; i < Math.min(foldRow, rows - foldRow - 1); i++) {
        for (let j = 0; j < cols; j++) {
          const topIdx = foldRow - i - 1;
          const bottomIdx = foldRow + i + 1;
          if (topIdx >= 0 && bottomIdx < rows) {
            const topCell = newGrid[topIdx][j];
            const bottomCell = newGrid[bottomIdx][j];
            const combined = topCell.value + bottomCell.value;
            const targetIdx = fold.direction === 'down' ? bottomIdx : topIdx;
            const hideIdx = fold.direction === 'down' ? topIdx : bottomIdx;
            
            newGrid[targetIdx][j] = {
              char: numToChar(combined),
              value: combined,
              visible: true,
              depth: Math.max(topCell.depth, bottomCell.depth) + 1
            };
            newGrid[hideIdx][j].visible = false;
          }
        }
      }
    } else {
      const foldCol = fold.position;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < Math.min(foldCol, cols - foldCol - 1); j++) {
          const leftIdx = foldCol - j - 1;
          const rightIdx = foldCol + j + 1;
          if (leftIdx >= 0 && rightIdx < cols) {
            const leftCell = newGrid[i][leftIdx];
            const rightCell = newGrid[i][rightIdx];
            const combined = leftCell.value + rightCell.value;
            const targetIdx = fold.direction === 'right' ? rightIdx : leftIdx;
            const hideIdx = fold.direction === 'right' ? leftIdx : rightIdx;

            newGrid[i][targetIdx] = {
              char: numToChar(combined),
              value: combined,
              visible: true,
              depth: Math.max(leftCell.depth, rightCell.depth) + 1
            };
            newGrid[i][hideIdx].visible = false;
          }
        }
      }
    }
    return newGrid;
  };

  const addFold = (type) => {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    const position = type === 'horizontal' ? Math.floor(rows / 2) : Math.floor(cols / 2);
    const direction = type === 'horizontal' ? 'down' : 'right';
    setFoldSequence([...foldSequence, { type, position, direction }]);
  };

  const removeFold = (index) => {
    setFoldSequence(foldSequence.filter((_, i) => i !== index));
    setCurrentFold(-1);
  };

  const animateFolds = async () => {
    setIsAnimating(true);
    setMathLog([]);
    let tempGrid = JSON.parse(JSON.stringify(grid));
    
    for (let i = 0; i < foldSequence.length; i++) {
      setCurrentFold(i);
      const fold = foldSequence[i];
      setMathLog(prev => [...prev, `INITIATING ${fold.type.toUpperCase()} FOLD [POS:${fold.position}]`]);
      
      tempGrid = applyFold(tempGrid, fold);
      setGrid(tempGrid);
      
      let layerSnapshot = "";
      tempGrid.forEach(row => row.forEach(c => { if(c.visible && c.char) layerSnapshot += c.char }));
      setMathLog(prev => [...prev, `MATRIX STATE: ${layerSnapshot}`]);
      
      await new Promise(r => setTimeout(r, 600));
    }
    
    let result = '';
    tempGrid.forEach(row => row.forEach(cell => {
      if (cell.visible && cell.char) result += cell.char;
    }));
    setCiphertext(result);
    setMathLog(prev => [...prev, `>> ENCRYPTION COMPLETE: ${result}`]);
    setIsAnimating(false);
  };

  const reset = () => {
    setPlaintext('HELLOWORLD');
    setFoldSequence([]);
    setCiphertext('');
    setCurrentFold(-1);
    setMathLog([]);
  };

  const copyCiphertext = () => {
    navigator.clipboard.writeText(ciphertext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 bg-[#0a0c10]">
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              Origami<span className="text-blue-500">Cipher</span>
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest font-mono">
              Secure Engine v3.1
            </span>
          </div>
          <button onClick={reset} className="text-xs flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
            <RotateCcw className="w-3 h-3" /> System Reset
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-[#11141b] border border-white/5 rounded-xl p-6 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Unlock className="w-3 h-3" /> Input Message
            </h3>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-blue-400 focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-24"
              placeholder="Type message..."
            />
            
            <div className="mt-6">
              <div className="flex justify-between text-xs mb-3">
                <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3" /> Matrix Width
                </span>
                <span className="text-blue-500 font-mono">{gridWidth} Units</span>
              </div>
              <input
                type="range" min="3" max="10" value={gridWidth}
                onChange={(e) => setGridWidth(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </section>

          <section className="bg-[#11141b] border border-white/5 rounded-xl p-6 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Folding Engine</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => addFold('horizontal')} className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                <span className="text-xs font-medium uppercase tracking-wider">H-Fold</span>
              </button>
              <button onClick={() => addFold('vertical')} className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                <span className="text-xs font-medium uppercase tracking-wider">V-Fold</span>
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 font-mono">
              {foldSequence.map((fold, index) => (
                <div key={index} className={`flex items-center justify-between bg-black/20 p-3 rounded-lg border transition-all ${currentFold === index ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5'} group`}>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-600">{index + 1}</span>
                    <span className="text-blue-400 uppercase tracking-tighter">{fold.type} ({fold.direction})</span>
                  </div>
                  <button onClick={() => removeFold(index)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={animateFolds}
              disabled={isAnimating || foldSequence.length === 0}
              className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg font-bold text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              <Play className="w-3 h-3 fill-current" />
              {isAnimating ? 'Processing Matrix...' : 'Run Fold Sequence'}
            </button>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-6 flex items-center justify-between backdrop-blur-sm">
            <div>
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Encrypted Output
              </h3>
              <p className="text-2xl font-mono font-bold tracking-[0.2em] text-white uppercase">
                {ciphertext || "READY_TO_ENCRYPT"}
              </p>
            </div>
            {ciphertext && (
              <button onClick={copyCiphertext} className="bg-blue-600 p-3 rounded-lg hover:bg-blue-500 transition-all shadow-lg">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </section>

          <section className="bg-[#0d1016] border border-white/5 rounded-xl p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10 flex flex-col items-center">
              {grid.map((row, i) => (
                <div key={i} className="flex">
                  {row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`w-14 h-14 border flex items-center justify-center text-xl font-mono transition-all duration-700 ${
                        cell.visible 
                          ? 'border-white/20 bg-white/5 text-white' 
                          : 'border-transparent bg-transparent text-transparent pointer-events-none'
                      }`}
                      style={{
                        transform: cell.visible ? `scale(${1 - cell.depth * 0.08})` : 'scale(0.5) opacity-0',
                        zIndex: 10 - cell.depth
                      }}
                    >
                      {cell.char}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#090b10] border border-blue-500/10 rounded-xl p-4 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Process Telemetry
              </h3>
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isAnimating ? 'bg-amber-500 animate-pulse' : 'bg-green-500 opacity-50'}`}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-20"></div>
              </div>
            </div>
            <div className="font-mono text-[11px] space-y-1 h-32 overflow-y-auto text-blue-400/80 bg-black/40 p-3 rounded border border-white/5">
              {mathLog.length === 0 && <span className="text-slate-700 italic">// Awaiting execution sequence...</span>}
              {mathLog.map((log, i) => (
                <div key={i} className="flex gap-3 border-b border-white/5 py-1 last:border-0">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                  <span className="uppercase tracking-tighter">{log}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OrigamiCipher;