import { useEffect, useRef } from 'react';
import './Projects.css';

const PROJECTS = [
  {
    icon: 'FileText',
    title: '非税票据自动录入',
    period: '2025.03 — 至今',
    description:
      '基于影刀 RPA 搭建自动化流程，实现票据录入、开具及批量下载全流程无人化处理。',
    tags: ['影刀RPA', '自动化流程', '政务系统'],
  },
  {
    icon: 'Mic',
    title: '听写辅助小程序',
    period: '2026.04',
    description: '基于 Claude Code 开发，实现自动播报、定时听写与重复朗读功能。',
    tags: ['Claude Code', '语音合成', '小程序'],
  },
  {
    icon: 'Radar',
    title: '科技政策雷达 AI',
    period: '2026.04',
    description: '自动抓取并解析政策文件，实时推送补贴、申报与产业动态信息。',
    tags: ['AI解析', '政策抓取', '自动推送'],
  },
  {
    icon: 'Briefcase',
    title: '政府采购全流程',
    period: '2017 — 2023',
    description: '独立主导采购流程管理，确保预算合规、商务谈判及合同高效落地。',
    tags: ['政府采购', '商务谈判', '合规管理'],
  },
];

function Icon({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (name) {
    case 'FileText':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
          <path {...common} d="M14 2v5h5" />
          <path {...common} d="M9 13h6" />
          <path {...common} d="M9 17h6" />
          <path {...common} d="M9 9h2" />
        </svg>
      );
    case 'Mic':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
          <path {...common} d="M19 11a7 7 0 0 1-14 0" />
          <path {...common} d="M12 18v4" />
          <path {...common} d="M8 22h8" />
        </svg>
      );
    case 'Radar':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M12 22a10 10 0 1 1 10-10" />
          <path {...common} d="M12 18a6 6 0 1 1 6-6" />
          <path {...common} d="M12 14a2 2 0 1 1 2-2" />
          <path {...common} d="M12 12l6-6" />
        </svg>
      );
    case 'Briefcase':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
          <path {...common} d="M4 7h16a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2z" />
          <path {...common} d="M2 12h20" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M12 3v18" />
          <path {...common} d="M3 12h18" />
        </svg>
      );
  }
}

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="projects" id="projects">
      <div className="projects__header">
        <h2 className="projects__heading reveal reveal--up">
          <em>Project Experience</em>
        </h2>
        <p className="projects__sub reveal reveal--up reveal--delay-1">
          以结果为导向，用轻量工具做出可落地的自动化与 AI 应用。
        </p>
      </div>

      <div className="projects__timeline reveal reveal--up reveal--delay-3">
        <svg
          className="projects__wave"
          viewBox="0 0 1200 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(120,160,255,0)" />
              <stop offset="15%" stopColor="rgba(120,160,255,0.55)" />
              <stop offset="85%" stopColor="rgba(120,160,255,0.55)" />
              <stop offset="100%" stopColor="rgba(120,160,255,0)" />
            </linearGradient>
          </defs>
          <path
            className="projects__wave-glow"
            d="M0 250 Q 140 210 280 250 T 560 250 T 840 250 T 1120 250 T 1200 250"
          />
          <path
            className="projects__wave-stroke"
            d="M0 250 Q 140 210 280 250 T 560 250 T 840 250 T 1120 250 T 1200 250"
          />
        </svg>

        <ul className="projects__cards" aria-label="Project experience timeline">
          {PROJECTS.map((p, i) => (
            <li
              key={p.title}
              className="project-card"
              style={{ '--delay': `${i * 0.15}s` }}
            >
              <div className="project-card__icon" aria-hidden="true">
                <Icon name={p.icon} />
              </div>
              <h3 className="project-card__title">{p.title}</h3>
              <div className="project-card__period">{p.period}</div>
              <p className="project-card__desc">{p.description}</p>
              <ul className="project-card__tags" aria-label="Tech tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
