import { useEffect, useRef } from 'react';
import './About.css';
import ProfileCard from './ProfileCard';

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
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
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="about" id="about">
      <div className="about__inner">
        <div className="about__grid">
          <div className="about__card reveal reveal--left">
            <ProfileCard
              name="陈阳"
              title="AI工具应用 · 政务数字化"
              handle="chenyang"
              status="求职中"
              contactText="联系我"
              avatarUrl={`${import.meta.env.BASE_URL}images/avatar.jpg?v=3`}
              enableTilt={true}
              enableMobileTilt={false}
              behindGlowEnabled={true}
              behindGlowColor="rgba(127, 119, 221, 0.6)"
              innerGradient="linear-gradient(145deg, #26215C8c 0%, #AFA9EC44 100%)"
              onContactClick={() => {
                navigator.clipboard.writeText('18288354327');
              }}
              showUserInfo={true}
            />
          </div>

          <div className="about__content">
            <p className="about__eyebrow reveal reveal--up">About Me</p>

            <h2 className="about__heading reveal reveal--up reveal--delay-1">
              <span className="about__heading-en">I'm</span>{' '}
              <span className="about__heading-name">陈阳</span>
            </h2>

            <div className="about__tags reveal reveal--up reveal--delay-1">
              <span className="about__tag">AI工具应用</span>
              <span className="about__tag">政务数字化</span>
            </div>

            <p className="about__intro reveal reveal--up reveal--delay-2">
              一名持续学习者,深耕体制内工作十年,现以高度热情拥抱 AI
              浪潮——用前沿工具重塑工作方式,在严谨与创新之间寻找属于自己的节奏。
            </p>

            <ul className="about__highlights reveal reveal--up reveal--delay-3">
              <li>
                <span className="about__highlight-index">01</span>
                <div>
                  <h3>持续学习 · 专业认证</h3>
                  <p>自学考取中级会计师、高级信息项目管理师资格证书。</p>
                </div>
              </li>
              <li>
                <span className="about__highlight-index">02</span>
                <div>
                  <h3>AI 工具实践</h3>
                  <p>
                    善用 Claude Code、Cursor 开发小程序,借助影刀、OpenClaw
                    显著提升工作效率。
                  </p>
                </div>
              </li>
              <li>
                <span className="about__highlight-index">03</span>
                <div>
                  <h3>十年体制内经验</h3>
                  <p>熟悉政府工作流程,擅长政府关系协调与跨部门沟通。</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
