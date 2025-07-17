"use client";

import { useEffect, useState, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  renderTime: number;
  cardCount: number;
}

interface PerformanceMonitorProps {
  cardCount: number;
  isVisible?: boolean;
}

export default function PerformanceMonitor({ cardCount, isVisible = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    cardCount: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStartTime = useRef(0);

  useEffect(() => {
    if (!isVisible) return;

    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
        }));
      }
    };

    const measureRenderTime = () => {
      renderStartTime.current = performance.now();
      requestAnimationFrame(() => {
        const renderTime = performance.now() - renderStartTime.current;
        setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime) }));
      });
    };

    measureFPS();
    measureMemory();
    measureRenderTime();

    const memoryInterval = setInterval(measureMemory, 2000);
    const renderInterval = setInterval(measureRenderTime, 1000);

    return () => {
      clearInterval(memoryInterval);
      clearInterval(renderInterval);
    };
  }, [isVisible]);

  useEffect(() => {
    setMetrics(prev => ({ ...prev, cardCount }));
  }, [cardCount]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
            {metrics.fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Cards:</span>
          <span>{metrics.cardCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Render:</span>
          <span className={metrics.renderTime > 16 ? 'text-red-400' : 'text-green-400'}>
            {metrics.renderTime}ms
          </span>
        </div>
        {metrics.memoryUsage && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className={metrics.memoryUsage > 100 ? 'text-red-400' : 'text-green-400'}>
              {metrics.memoryUsage}MB
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
