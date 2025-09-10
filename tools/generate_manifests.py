#!/usr/bin/env python3
"""Generate index.json manifests for templates and components folders.

Usage: python tools/generate_manifests.py
This script scans the `templates` and `components` directories (relative to repo root)
for .html files and writes an `index.json` file in each directory with a sorted list
of relative paths.
"""
import os
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    (ROOT / 'templates', 'templates/index.json'),
    (ROOT / 'components', 'components/index.json'),
]

def collect_html_files(base_dir: Path):
    if not base_dir.exists():
        return []
    files = []
    for p in sorted(base_dir.rglob('*.html')):
        # compute path relative to base_dir and use forward slashes
        rel = p.relative_to(base_dir).as_posix()
        files.append(rel)
    return files

def write_manifest(manifest_path: Path, entries):
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with manifest_path.open('w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    print(f'Wrote {manifest_path} ({len(entries)} entries)')

def main():
    for base_dir, manifest_rel in TARGETS:
        entries = collect_html_files(base_dir)
        manifest_path = ROOT / manifest_rel
        write_manifest(manifest_path, entries)

if __name__ == '__main__':
    main()
