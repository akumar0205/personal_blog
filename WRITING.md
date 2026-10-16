# Adding a blog post

Create a new `.md` file in `posts/`. The filename must match the `slug` in its frontmatter. Copy this starter and replace the example text:

```markdown
---
title: "A new essay"
slug: "a-new-essay"
date: "Oct 15, 2026"
read: "4 min read"
excerpt: "A short summary for the homepage."
---

Start writing here. Use **bold**, *italics*, links, headings, lists, quotes, and code fences as usual.

## A section heading

To add an image, put it in `dist/assets/` and reference it like this:

![A description of the image](/assets/my-image.jpg)
```

Use a unique lowercase slug with hyphens. Save the file, commit it, and push to `main`; Cloudflare Pages builds `dist/posts.json` from all Markdown files in `posts/` and deploys automatically. No need to edit `posts.json` yourself.
