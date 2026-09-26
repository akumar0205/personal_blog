let posts = [
  { title:'The Trap of Pushing Harder', date:'Apr 25, 2026', read:'1 min read', tags:['Personal Thoughts'], slug:'the-trap-of-pushing-harder', excerpt:'Every crossroads came with the same two instructions: act now or do nothing. When I was younger I always reached for action. Move first, think later.', body:['Every crossroads came with the same two instructions: act now or do nothing. When I was younger I always reached for action. Move first, think later. But the older I got the more mentors would tell me to wait. Let things play out.','There is a difference between patience and passivity. The hard part is learning which one you are practicing.'] },
  { title:'Doing More with Less', date:'Feb 16, 2026', read:'2 min read', tags:['Lifestyle','Personal Thoughts'], slug:'doing-more-with-less', excerpt:'As I approach 30 I keep thinking about how little time we actually have. It is not the first time the thought has crossed my mind.', body:['As I approach 30 I keep thinking about how little time we actually have. I remember reading On the Shortness of Life by Seneca years ago and feeling that same punch in the chest.','The useful question is not how to fit more into the day. It is what deserves the day in the first place.'] },
  { title:'The Gray Between Linear and Exponential Games', date:'Mar 2, 2025', read:'1 min read', tags:['Entrepreneurship','Personal Thoughts'], slug:'the-gray-between-linear-and-exponential-games', excerpt:'This year, I am changing the way I view the world and the probabilities I assign to outcomes.', body:['This year, I am venturing to change the way I view the world and the probabilities I assign to outcomes. This shift was driven by my recent re-reading of several of Nassim Taleb’s books.','Those who achieve success beyond the average person tend to play games that yield exponential returns. My goal is to find a middle ground: smaller sacrifices in pursuit of more attainable 10x gains.','At Vitrix Health, I chose to pursue a venture-backed startup — an exponential game. Now I am looking for problems that impact a medium-sized group of people, without the urgency of a moonshot.'] },
  { title:'I took a break and you should too', date:'Jun 16, 2022', read:'9 min read', tags:['Entrepreneurship','Health','Lifestyle'], slug:'i-took-a-break-and-you-should-too', excerpt:'Take a break, you deserve it.', body:['Take a break, you deserve it. It is easy to confuse motion with progress, especially when you are building something that matters to you.','A pause is not an interruption to the work. Sometimes it is the work.'] },
  { title:'Technical Copywriting: What Engineers Can Learn From Apple’s M1 Macbook Marketing Campaign', date:'Dec 13, 2020', read:'6 min read', tags:['Entrepreneurship'], slug:'technical-copywriting', excerpt:'How Apple’s copywriting can help us improve conversions.', body:['As far as I can remember, I have always had a disdain towards Apple products. Yet in 2020 I bought an M1 MacBook Air and could not have been happier. How did Apple convince a staunch critic? Copywriting.','Talk about impact and not numbers. At Vitrix Health, our marketing materials were heavy on accuracy, F1 scores, and technical proof. It never resonated with customers. We had to explain what those numbers changed for a doctor.','Talk like a human. The difference between bad and good copy is the ability to make it not sound like a sales pitch. People do not like being sold to.'] },
  { title:'Can You Identify Which Of These Tweets Are Written By An AI Model? – Most People Can’t', date:'Sep 2, 2020', read:'10 min read', tags:['Machine Learning'], slug:'nlp-and-disinformation', excerpt:'How easy is it to fool people with AI? As I found out, very easy.', body:['AI is a double-edged sword. It can help detect cancer earlier than most clinicians, but it can also alter video and manufacture convincing public statements.','I trained a small RNN on Trump’s tweets and ran a survey to see whether people could identify generated tweets. The average person identified the fake only 16% of the time.','The experiment was a reminder that we are more susceptible to misinformation than we think, and that the cost of creating it is falling quickly.'] },
  { title:'How We Won First Place At The Biggest AI In Medicine Conference', date:'Jul 29, 2020', read:'12 min read', tags:['Entrepreneurship','Machine Learning'], slug:'how-we-won-first-place', excerpt:'How we won 1st place at the largest AI in Medicine conference', body:['Building for medicine means respecting the difference between a promising demo and something that earns trust. Our team learned that the hard way while building tools for oral disease screening.','Winning was less about one clever model and more about the accumulation of small, careful decisions: the data, the evaluation, the story, and the people in the room.'] },
  { title:'Stoicism – The most underrated tool for entrepreneurs', date:'Jul 22, 2020', read:'6 min read', tags:['Entrepreneurship'], slug:'stoicism', excerpt:'Using Stoicism to be a better entrepreneur', body:['Failure during an entrepreneurial venture is to be expected. Running Vitrix Health for two years gave me my share of ups and downs.','Before starting, my view of startups came from TechCrunch and Hacker News: startups killing it, raising crazy funding, or hitting an unexpected milestone. Stoicism gave me a calmer measure of success.','The goal is not to stop caring. It is to care deeply about the parts you can control, and to release the rest.'] },
  { title:'Welcome', date:'Jul 8, 2020', read:'1 min read', tags:['Introduction'], slug:'welcome', excerpt:'Since you’ve stumbled across this blog, I would like to officially welcome you.', body:['Since you have stumbled across this blog, I would like to officially welcome you. Right now this blog has little direction, although I am sure that will change.','I started it to put my thoughts out there. The best way to understand what I am thinking is probably to read along.'] }
];

const app = document.querySelector('#app');
const esc = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
let agentMode = false;
try { agentMode = localStorage.getItem('qn-mode') === 'agent'; } catch {}

function applyMode() {
  document.body.classList.toggle('agent-mode', agentMode);
  const toggle = document.querySelector('#mode-toggle');
  if (!toggle) return;
  toggle.setAttribute('aria-pressed', String(agentMode));
  toggle.querySelector('[data-mode-label]').textContent = agentMode ? 'Agent' : 'Human';
}

function bindModeToggle() {
  const toggle = document.querySelector('#mode-toggle');
  if (toggle) toggle.onclick = () => {
    agentMode = !agentMode;
    try { localStorage.setItem('qn-mode', agentMode ? 'agent' : 'human'); } catch {}
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
  };
  applyMode();
}

function home() {
  const visible = posts;
  const hero = `<section class="hero"><div><p class="eyebrow">${agentMode ? 'System notes / 2020—2026' : 'Field notes / 2020—2026'}</p><h1>${agentMode ? 'Signal in context.' : 'Learning in public.'}</h1><p class="hero-intro">${agentMode ? 'A compact index of decisions, experiments, and observations from building in public.' : 'A collection of essays on building companies, making sense of technology, and trying to live a little more deliberately.'}</p></div><aside class="hero-note"><strong>${agentMode ? 'Context in. Curiosity out.' : 'Good ideas travel well.'}</strong><span>${agentMode ? 'Structured notes from Ayush Kumar, for humans and machines.' : 'Thoughts from Ayush Kumar, an entrepreneur and engineer.'}</span></aside></section>`;
  const archiveHeading = `<div class="archive-top"><h2>All writing <span class="mono">(${visible.length})</span></h2></div>`;
  if (agentMode) {
    const markdown = visible.map(p => `<div class="md-entry"><div class="md-h3">### <a href="#/post/${p.slug}">[${esc(p.title)}](#/post/${p.slug})</a></div><div>- published: ${esc(p.date)}</div><div>- read: ${esc(p.read)}</div><div class="md-quote">&gt; ${esc(p.excerpt)}</div></div>`).join('');
    app.innerHTML = `${hero}<section class="archive agent-archive">${archiveHeading}<div class="agent-markdown"><div class="md-h1"># Quixotic Nomad</div><div class="md-quote">&gt; Notes on building, technology, health, and living deliberately.</div><div class="md-h2">## Essays (${visible.length})</div>${markdown}</div></section>`;
  } else {
    app.innerHTML = `${hero}<section class="archive">${archiveHeading}<div class="post-list">${visible.map((p,i)=>`<article class="post-row"><div class="post-number">${String(i+1).padStart(2,'0')}</div><div><h3 class="post-title"><a href="#/post/${p.slug}">${esc(p.title)}</a></h3><p class="post-excerpt">${esc(p.excerpt)}</p></div><div class="post-side"><span>${p.date}</span><span>${p.read}</span><span class="read"><a href="#/post/${p.slug}">Read essay ↗</a></span></div></article>`).join('')}</div></section>`;
  }
}
function htmlToMarkdown(html) {
  const root = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html').body.firstElementChild;
  const convert = node => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, ' ');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const tag = node.tagName.toLowerCase();
    if (tag === 'pre') return `\n\n\`\`\`\n${node.textContent.trim()}\n\`\`\`\n\n`;
    if (tag === 'img') return `\n\n![${node.getAttribute('alt') || ''}](${node.getAttribute('src') || ''})\n\n`;
    const inner = [...node.childNodes].map(convert).join('');
    if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${inner.trim()}\n\n`;
    if (tag === 'p') return `\n\n${inner.trim()}\n\n`;
    if (tag === 'blockquote') return `\n\n${inner.trim().split('\n').filter(Boolean).map(line => `> ${line}`).join('\n')}\n\n`;
    if (tag === 'li') return inner.trim();
    if (tag === 'ul' || tag === 'ol') return `\n\n${[...node.children].map((item, i) => `${tag === 'ol' ? `${i + 1}.` : '-'} ${convert(item)}`).join('\n')}\n\n`;
    if (tag === 'strong' || tag === 'b') return `**${inner.trim()}**`;
    if (tag === 'em' || tag === 'i') return `*${inner.trim()}*`;
    if (tag === 'a') return `[${inner.trim()}](${node.getAttribute('href') || ''})`;
    if (tag === 'br') return '\n';
    if (tag === 'figcaption' || tag === 'cite') return `\n\n*${inner.trim()}*\n\n`;
    if (tag === 'code') return `\`${inner.trim()}\``;
    return inner;
  };
  return convert(root).replace(/\n{3,}/g, '\n\n').trim();
}
function detail(slug) {
  const p = posts.find(x=>x.slug===slug) || posts[0];
  const fallback = (p.body || []).map((x,i)=>i===1&&p.body.length>2?`<blockquote>${esc(x)}</blockquote>`:`<p>${esc(x)}</p>`).join('');
  if (agentMode) {
    const markdown = htmlToMarkdown(p.content || fallback);
    app.innerHTML = `<article class="detail agent-detail"><a class="back" href="#/">← All writing</a><pre class="agent-markdown agent-post-markdown"><code># ${esc(p.title)}\n\n- published: ${esc(p.date)}\n- read: ${esc(p.read)}\n\n> ${esc(p.excerpt)}\n\n${esc(markdown)}</code></pre></article>`;
    return;
  }
  app.innerHTML = `<article class="detail"><a class="back" href="#/">← All writing</a><p class="eyebrow">Essay</p><h1>${esc(p.title)}</h1><p class="post-meta">${p.date} · ${p.read}</p><p class="lead">${esc(p.excerpt)}</p><div class="article-copy">${p.content || fallback}<p class="mono">More from the archive → <a href="#/">Read another essay</a></p></div></article>`;
}
function about() {
  const bio = [
    'I have always been drawn to the intersection of technology, business, and impact. I started my journey at the University of Illinois at Urbana-Champaign, where I studied computer science but found myself spending more and more time in the College of Business. I became fascinated with using code to solve real problems, which led me to work with early-stage startups, run a startup consulting group (EntreCORPS), and spend time at a venture capital firm (IllinoisVENTURES) evaluating new ideas.',
    'After graduation, I briefly went into consulting before leaving it behind to build my startup full time: Orali Health (formerly Vitrix Health). Our mission was to expand access to quality oral healthcare by using machine learning to allow any minimally trained medical professional to screen for oral diseases and intelligently triage patients.',
    'We were accepted into top accelerators, from HAX, where we lived in Shenzhen to prototype hardware and build a supply chain, to Health Wildcatters, where we deployed our platform across clinics around the world. I had the chance to collaborate with some incredible people, including the Dean of Harvard Dental and the Medical Informatics Director at NASA, while traveling across China, India, Hong Kong, and Macau. One of our proudest milestones was winning 1st place at AIMed for our AI models.',
    'Today, I am a Principal Product Manager at Cloudflare, focusing on cyber security and applied machine learning, where I help build products that protect millions of users and organizations. I also recently completed my Master’s in Computer Science at the University of Texas at Austin, which strengthened my foundation in AI and security.',
    'Outside of work, I am an avid reader, a machine learning enthusiast, and someone who is always looking for new things to learn. If you ever want to chat, feel free to reach out!'
  ];
  if (agentMode) {
    const markdown = bio.map(text => `\n\n${text}`).join('');
    app.innerHTML = `<section class="about agent-detail"><a class="back" href="#/">← All writing</a><pre class="agent-markdown agent-post-markdown"><code># Who Am I?\n\n![Ayush Kumar](/assets/ayush-about.jpg)\n\n## Ayush Kumar\n\n### Always Curious${esc(markdown)}\n\n[me@ayushkumar.xyz](mailto:me@ayushkumar.xyz)</code></pre></section>`;
    return;
  }
  app.innerHTML = `<section class="about"><a class="back" href="#/">← All writing</a><p class="eyebrow">Who Am I?</p><div class="about-profile"><img class="about-portrait" src="/assets/ayush-about.jpg" alt="Ayush Kumar" /><div class="about-copy"><h1>Ayush Kumar</h1><p class="about-subtitle">Always Curious</p>${bio.map(text=>`<p>${esc(text)}</p>`).join('')}<p><a class="about-email" href="mailto:me@ayushkumar.xyz">me@ayushkumar.xyz ↗</a></p></div></div></section>`;
}
function render() { const path = location.hash.replace(/^#\/?/, ''); if(path==='about') about(); else if(path.startsWith('post/')) detail(path.slice(5)); else home(); bindModeToggle(); window.scrollTo(0,0); }
async function loadPosts() {
  try {
    const response = await fetch('/posts.json');
    if (!response.ok) throw new Error(`posts.json returned ${response.status}`);
    posts = await response.json();
    render();
  } catch (error) {
    console.warn('Using the embedded archive fallback:', error);
  }
}
window.addEventListener('hashchange', render); render(); loadPosts();
