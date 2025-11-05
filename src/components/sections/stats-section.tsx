'use client';

import { StatCounter } from '@/components/ui/stat-counter';
import { TrendingUp } from 'lucide-react';

const stats = [
  { value: 99.5, label: 'System Uptime', suffix: '%', delay: 0 },
  { value: 10000, label: 'Concurrent Users', suffix: '+', delay: 0.1 },
  { value: 3, label: 'Page Load Time', suffix: 's', prefix: '<', delay: 0.2 },
  { value: 90, label: 'Doctor Adoption Rate', suffix: '%', delay: 0.3 },
  { value: 80, label: 'Patient Registration', suffix: '%', delay: 0.4 },
  { value: 4.5, label: 'User Satisfaction', suffix: '/5', delay: 0.5 },
];

export function StatsSection() {
  return (
    <section id="stats" className="relative py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <div data-aos="fade-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
              Performance Metrics
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Numbers That{' '}
              <span className="bg-linear-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                Speak for Themselves
              </span>
            </h2>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Our commitment to excellence is reflected in our performance
              metrics and user satisfaction rates.
            </p>
          </div>
        </div>

        <div
          data-aos="zoom-in"
          data-aos-delay="300"
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-linear-to-br from-primary/5 via-transparent to-transparent p-8 md:p-12 shadow-xl"
        >
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={stat.label} data-aos="fade-up" data-aos-delay={index * 100}>
                <StatCounter
                  value={stat.value}
                  label={stat.label}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  delay={stat.delay}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Success Criteria */}
        <div data-aos="fade-up" data-aos-delay="500">
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { label: 'System Uptime', target: '≥ 99.5%', status: 'Achieved' },
              { label: 'Patient Registration', target: '80%', status: 'On Track' },
              { label: 'Doctor Adoption', target: '90%', status: 'Achieved' },
              { label: 'User Satisfaction', target: '≥ 4.0/5.0', status: 'Exceeded' },
            ].map((item, index) => (
              <div
                key={item.label}
                data-aos="flip-up"
                data-aos-delay={index * 100}
                className="rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
              >
                <div className="mb-2 text-sm font-medium text-muted-foreground">
                  {item.label}
                </div>
                <div className="mb-2 text-2xl font-bold text-foreground lg:text-3xl">
                  {item.target}
                </div>
                <div
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === 'Achieved'
                      ? 'bg-green-500/10 text-green-500'
                      : item.status === 'Exceeded'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-blue-500/10 text-blue-500'
                  }`}
                >
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
