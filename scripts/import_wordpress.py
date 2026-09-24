from html import unescape
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
ASSETS = DIST / "assets"
FEED_URL = "https://quixoticnomad.blog/feed/"
NS = {"content": "http://purl.org/rss/1.0/modules/content/"}

def fetch(url):
    request = Request(url, headers={"User-Agent": "QuixoticNomad-Migration/1.0"})
    with urlopen(request, timeout=45) as response:
        return response.read()

def clean_text(value):
    value = re.sub(r"<[^>]+>", " ", value or "")
    return re.sub(r"\s+", " ", unescape(value)).strip()

def localize_images(content):
    ASSETS.mkdir(parents=True, exist_ok=True)
    content = re.sub(r'\s+srcset=["\'][^"\']+["\']', '', content, flags=re.I)
    def replace(match):
        prefix, url, suffix = match.group(1), unescape(match.group(2)), match.group(3)
        if not url.startswith(("http://", "https://")):
            return match.group(0)
        extension = Path(urlparse(url).path).suffix.lower() or ".jpg"
        filename = f"{hashlib.sha1(url.encode()).hexdigest()[:12]}{extension}"
        target = ASSETS / filename
        if not target.exists():
            try:
                target.write_bytes(fetch(url))
            except Exception as error:
                print(f"warning: could not download {url}: {error}")
                return match.group(0)
        return f'{prefix}/assets/{filename}{suffix}'
    return re.sub(r'(<img[^>]+\bsrc=["\'])([^"\']+)(["\'])', replace, content, flags=re.I)

def main():
    root = ET.fromstring(fetch(FEED_URL))
    posts = []
    for item in root.findall(".//item"):
        raw_content = item.findtext("content:encoded", default="", namespaces=NS)
        content = localize_images(unescape(raw_content))
        title = unescape(item.findtext("title", default=""))
        link = item.findtext("link", default="").split("?")[0]
        slug = urlparse(link).path.strip("/").split("/")[-1]
        categories = [unescape(c.text or "") for c in item.findall("category")]
        words = len(clean_text(content).split())
        published = parsedate_to_datetime(item.findtext("pubDate", default=""))
        date = published.strftime("%b %d, %Y").replace(" 0", " ")
        posts.append({
            "title": title, "slug": slug, "date": date,
            "read": f"{max(1, round(words / 220))} min read", "tags": categories,
            "excerpt": clean_text(item.findtext("description", default=""))[:260], "content": content,
        })
    (DIST / "posts.json").write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Imported {len(posts)} posts and {len(list(ASSETS.glob('*')))} inline images")

if __name__ == "__main__":
    main()
