import { useState } from 'react';
import './Footer.css';

const CONTACTS = [
  { type: 'phone', label: '手机', value: '182 8835 4327' },
  { type: 'email', label: '邮箱', value: 'xcyy0429@gmail.com' },
];

export default function Footer() {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = async (idx, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      // Clipboard may be unavailable on insecure contexts — fail silently
    }
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer__inner">
        <p className="footer__greeting">
          欢迎联系我
          <span className="footer__star" aria-hidden="true">
            ✦
          </span>
        </p>

        <ul className="footer__contacts">
          {CONTACTS.map((c, i) => (
            <li key={c.type}>
              <button
                type="button"
                className="contact-item"
                onClick={() => handleCopy(i, c.value)}
                aria-label={`复制${c.label}: ${c.value}`}
              >
                <span
                  className={`contact-item__value ${
                    copiedIdx === i ? 'is-copied' : ''
                  }`}
                >
                  {copiedIdx === i ? '已复制 ✓' : c.value}
                </span>
                <span className="contact-item__label">{c.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="footer__meta">
          成都信息工程大学 · 电子信息工程 · 本科 · 女 · 37 岁
        </p>

        <p className="footer__copyright">© 2026 陈阳</p>
      </div>
    </footer>
  );
}
