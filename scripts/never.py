#!/usr/bin/env python3
"""Fails on "never" in an authored doc. The one approved use is "never extractive" (Don, 2026-09-30).
Usage: never.py [file ...]   (no args: every authored .md; generated files and fixtures are skipped)"""
import re, subprocess, sys

GENERATED = {"STATUS.md", "README.md", "PLATFORM-IOS.md", "PLATFORM-ANDROID.md"}
WORD, ALLOWED = re.compile(r"\bnever\b", re.I), re.compile(r"never[- ]extract", re.I)

def authored():
    out = subprocess.run(["git", "ls-files", "*.md"], capture_output=True, text=True).stdout.split()
    return [f for f in out if f not in GENERATED and not f.startswith(("constraints/", "scripts/fixtures/"))]

bad = 0
for path in sys.argv[1:] or authored():
    for n, line in enumerate(open(path, encoding="utf-8"), 1):
        for m in WORD.finditer(line):
            if not ALLOWED.match(line, m.start()):
                bad += 1
                print(f"never: {path}:{n}: {line.strip()[:120]}")
sys.exit(1 if bad else 0)
