import os
import yaml
import json
from datetime import datetime, date

# ---- Date parser ----
def parse_date(raw):
    if isinstance(raw, datetime):
        return raw
    elif isinstance(raw, date):
        return datetime.combine(raw, datetime.min.time())
    elif isinstance(raw, str):
        for fmt in ("%Y-%m-%d", "%m-%d-%Y", "%d-%m-%Y"):
            try:
                return datetime.strptime(raw, fmt)
            except ValueError:
                continue
    raise ValueError(f"Invalid date format: {raw}")

# ---- Collect post metadata ----
posts = []
posts_root = 'posts'

for post_folder in os.listdir(posts_root):
    full_path = os.path.join(posts_root, post_folder)
    index_path = os.path.join(full_path, 'index.qmd')

    if os.path.isfile(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            if lines[0].strip() == '---':
                metadata_lines = []
                for line in lines[1:]:
                    if line.strip() == '---':
                        break
                    metadata_lines.append(line)
                metadata = yaml.safe_load(''.join(metadata_lines))
                metadata['path'] = f"/{posts_root}/{post_folder}/index.html"
                metadata['date_obj'] = parse_date(metadata.get('date'))

                # Ensure these keys always exist
                metadata['subtitle'] = metadata.get('subtitle', '')
                metadata['author'] = metadata.get('author', '')

                posts.append(metadata)

# ---- Sort safely using parsed datetime ----
posts.sort(key=lambda p: p["date_obj"], reverse=True)

# ---- Clean up ----
for post in posts:
    del post["date_obj"]
    if isinstance(post.get("date"), (datetime, date)):
        post["date"] = post["date"].isoformat()

# ---- Write JSON ----
with open('posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)
