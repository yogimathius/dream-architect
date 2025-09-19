/**
 * Performance monitoring utilities for Dream Architect
 * Provides Web Vitals tracking and performance insights
 */

import { dev } from '$app/environment';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface WebVitals {
  CLS?: number; // Cumulative Layout Shift
  FID?: number; // First Input Delay
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  TTFB?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private webVitals: WebVitals = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.trackPageLoad();
    }
  }

  private initializeObservers() {
    // Track Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.webVitals.LCP = lastEntry.startTime;
          this.reportMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported:', e);
      }

      // Track First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.webVitals.FID = entry.processingStart - entry.startTime;
            this.reportMetric('FID', this.webVitals.FID);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported:', e);
      }

      // Track Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.webVitals.CLS = clsValue;
          this.reportMetric('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported:', e);
      }
    }
  }

  private trackPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            // First Contentful Paint
            const paintEntries = performance.getEntriesByType('paint');
            const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              this.webVitals.FCP = fcpEntry.startTime;
              this.reportMetric('FCP', fcpEntry.startTime);
            }

            // Time to First Byte
            this.webVitals.TTFB = navigation.responseStart - navigation.requestStart;
            this.reportMetric('TTFB', this.webVitals.TTFB);

            // Page load time
            const loadTime = navigation.loadEventEnd - navigation.navigationStart;
            this.reportMetric('PageLoad', loadTime);

            // DOM content loaded
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
            this.reportMetric('DOMContentLoaded', domContentLoaded);
          }
        }, 0);
      });
    }
  }

  private reportMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.metrics.push(metric);

    if (dev) {
      console.log(`Performance metric [${name}]:`, `${Math.round(value)}ms`);
    }

    // Send to analytics service in production
    if (!dev) {
      this.sendToAnalytics(metric);
    }
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // Example: Send to Google Analytics, DataDog, New Relic, etc.
    // Replace with your actual analytics service
    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'performance_metric', {
          custom_map: { metric_name: 'dimension1' },
          metric_name: metric.name,
          value: Math.round(metric.value),
          event_category: 'Performance'
        });
      }

      // Example: Send to custom endpoint
      fetch('/api/performance-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      }).catch(() => {
        // Silently fail if analytics endpoint is unavailable
      });
    } catch (error) {
      // Don't let analytics errors break the app
      console.warn('Failed to send performance metric:', error);
    }
  }

  // Public methods
  public markStart(name: string): string {
    const markName = `${name}-start`;
    if (typeof performance !== 'undefined') {
      performance.mark(markName);
    }
    return markName;
  }

  public markEnd(name: string, startMark?: string): number {
    const endMarkName = `${name}-end`;
    const startMarkName = startMark || `${name}-start`;
    
    if (typeof performance !== 'undefined') {
      performance.mark(endMarkName);
      
      try {
        performance.measure(name, startMarkName, endMarkName);
        const measure = performance.getEntriesByName(name)[0];
        this.reportMetric(name, measure.duration);
        return measure.duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getWebVitals(): WebVitals {
    return { ...this.webVitals };
  }

  public getPerformanceScore(): number {
    const { LCP, FID, CLS, FCP } = this.webVitals;
    let score = 100;

    // Scoring based on Web Vitals thresholds
    if (LCP !== undefined) {
      if (LCP > 4000) score -= 25; // Poor
      else if (LCP > 2500) score -= 10; // Needs improvement
    }

    if (FID !== undefined) {
      if (FID > 300) score -= 25; // Poor
      else if (FID > 100) score -= 10; // Needs improvement
    }

    if (CLS !== undefined) {
      if (CLS > 0.25) score -= 25; // Poor
      else if (CLS > 0.1) score -= 10; // Needs improvement
    }

    if (FCP !== undefined) {
      if (FCP > 3000) score -= 15; // Poor
      else if (FCP > 1800) score -= 5; // Needs improvement
    }

    return Math.max(0, score);
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const startMark = performanceMonitor.markStart(name);
  const startTime = performance.now();
  
  return fn().finally(() => {
    const duration = performance.now() - startTime;
    performanceMonitor.markEnd(name, startMark);
  });
}

export function measureSync<T>(name: string, fn: () => T): T {
  const startMark = performanceMonitor.markStart(name);
  try {
    return fn();
  } finally {
    performanceMonitor.markEnd(name, startMark);
  }
}

// Page visibility tracking for accurate metrics
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      performanceMonitor.cleanup();
    }
  });
}