import { useEffect, useRef, useState } from 'react';
import './Experience.css';

const EXPERIENCES = [
  {
    period: '2011.08 — 2014.12',
    company: '中国银行临沧市分行',
    role: '综合柜员',
    points: [
      '办理个人存取款、贷款受理、信用卡申请等全类型柜面业务,日均服务客户稳定达标',
      '严格执行金融合规操作规范,业务办理准确率高,无差错事故记录',
      '通过校园招聘入职,在规范化金融机构体系中积累系统性业务能力与服务意识',
    ],
  },
  {
    period: '2016.12 — 2023.03',
    company: '临沧市临翔区自然资源局 · 财务部',
    role: '会计(财务核算岗)',
    points: [
      '统筹局机关日常财务核算,独立完成 6 个年度决算报告的编制与上报,数据真实准确、按时报送',
      '主导政府采购全流程工作,涵盖商务谈判、流程管控及合同对接,确保采购合规高效推进',
      '参与国家级地质灾害治理、土地整理等重大项目的审计与合规检查',
      '配合上级单位开展审计、巡察等专项工作,各项检查均顺利通过',
    ],
  },
  {
    period: '2023.04 — 至今',
    company: '临沧市临翔区自然资源局 · 不动产登记中心',
    role: '不动产登记专员',
    points: [
      '负责土地出让金的核算与票据开具,确保资金往来数据准确合规',
      '承担不动产权证办理的窗口服务与政策解读,提升群众办事体验与办结效率',
      '精准把握不动产相关法规动态,为业务办理提供政策依据与合规指导',
      '协调处理登记业务中的复杂纠纷与异常情形,保障窗口业务平稳有序运行',
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

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

  const handleToggle = (idx) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section ref={sectionRef} className="experience" id="experience">
      <div className="experience__header">
        <p className="experience__eyebrow reveal reveal--up">Work Experience</p>
        <h2 className="experience__heading reveal reveal--up reveal--delay-1">
          Where I've <em>been</em>
        </h2>
        <p className="experience__sub reveal reveal--up reveal--delay-2">
          从金融柜面到政府窗口,十年间走过的每一步。
        </p>
      </div>

      <div className="experience__timeline reveal reveal--up reveal--delay-3">
        <div className="experience__track" aria-hidden="true" />
        <ul className="experience__nodes">
          {EXPERIENCES.map((exp, i) => {
            const onLeft = i % 2 === 0;
            const isActive = activeIndex === i;
            return (
              <li
                key={i}
                className={[
                  'exp-node',
                  onLeft ? 'exp-node--left' : 'exp-node--right',
                  isActive ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--row': i + 1 }}
              >
                <button
                  type="button"
                  className="exp-node__card"
                  onClick={() => handleToggle(i)}
                  aria-expanded={isActive}
                >
                  <div className="exp-node__compact">
                    <span className="exp-node__period">{exp.period}</span>
                    <span className="exp-node__company">{exp.company}</span>
                  </div>
                  <div className="exp-node__expand">
                    <div className="exp-node__expand-inner">
                      <h3 className="exp-node__role">{exp.role}</h3>
                      <ul className="exp-node__points">
                        {exp.points.map((pt, j) => (
                          <li key={j}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
                <span className="exp-node__line" aria-hidden="true" />
                <span className="exp-node__dot" aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
