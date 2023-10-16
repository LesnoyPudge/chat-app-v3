import type { CLSMetric, CLSReportCallback, Metric } from 'web-vitals';



type MetricUnion = CLSMetric | Metric;

export const webVitals = async() => {
    setTimeout(() => {
        import('web-vitals').then(({ onCLS, onFCP, onFID, onLCP, onTTFB }) => {
            let isReadyToReport = false;
            const metrics: (MetricUnion)[] = [];

            const removeListener = () => {
                document.removeEventListener('visibilitychange', visibilityHandler);
            };

            const url = '/fake-path';

            const visibilityHandler = () => {
                if (!isReadyToReport) return;
                if (document.visibilityState !== 'hidden') return;

                removeListener();

                const badMetrics = metrics.filter((metric) => metric.rating !== 'good');
                if (badMetrics.length === 0) return;

                const body = JSON.stringify(badMetrics);

                console.table(badMetrics);

                if (typeof navigator.sendBeacon !== 'undefined') {
                    navigator.sendBeacon(url, body);
                    return;
                }

                fetch(url, {
                    body,
                    method: 'POST',
                    keepalive: true,
                }).catch(console.error);
            };

            document.addEventListener('visibilitychange', visibilityHandler);

            const onMetric: CLSReportCallback = (metric) => {
                metrics.push(metric);

                if (metrics.length < 5) return;

                isReadyToReport = true;
            };

            onCLS(onMetric);
            onFID(onMetric);
            onFCP(onMetric);
            onLCP(onMetric);
            onTTFB(onMetric);
        }).catch(console.error);
    }, 5000);
};