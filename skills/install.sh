#!/usr/bin/env bash
# Install Main Street Market pipeline skills globally.
#
# Default:  symlinks each skills/pipeline-* directory into ~/.claude/skills/
#           so they auto-trigger on intent in any Claude Code session.
#
# --with-plugins:
#           ALSO installs the Cowork plugin skills the pipeline calls
#           (engineering, design, product-management, anthropic-skills).
#           See ./skills/EXTERNAL-SKILLS.md for the rationale.

set -euo pipefail

WITH_PLUGINS=0
for arg in "$@"; do
  case "$arg" in
    --with-plugins) WITH_PLUGINS=1 ;;
    -h|--help)
      sed -n '2,12p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "unknown arg: $arg"; exit 1 ;;
  esac
done

SKILLS_SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DEST="$HOME/.claude/skills"

mkdir -p "$SKILLS_DEST"

echo "Linking project pipeline skills → $SKILLS_DEST"
for skill in "$SKILLS_SRC"/pipeline-*/; do
  name="$(basename "$skill")"
  target="$SKILLS_DEST/$name"

  if [[ -L "$target" ]]; then
    existing="$(readlink "$target")"
    if [[ "$existing" == "${skill%/}" ]]; then
      echo "  ok   $name (already linked)"
      continue
    fi
    echo "  warn $name -> existing symlink points elsewhere ($existing); replacing"
    rm "$target"
  elif [[ -e "$target" ]]; then
    echo "  skip $name (real file/dir at $target — remove manually if you want to replace)"
    continue
  fi

  ln -s "${skill%/}" "$target"
  echo "  link $name"
done

if [[ "$WITH_PLUGINS" -eq 1 ]]; then
  echo
  echo "Installing knowledge-work plugins (engineering, design, product-management)"
  echo

  if ! command -v claude >/dev/null 2>&1; then
    echo "  err  'claude' CLI not on PATH. Install Claude Code, then re-run with --with-plugins."
    exit 1
  fi

  # These plugins ship in anthropics/knowledge-work-plugins.
  # Register the marketplace if it isn't already.
  MARKETPLACES="$(claude plugin marketplace list 2>/dev/null || echo '')"
  if ! echo "$MARKETPLACES" | grep -q 'knowledge-work-plugins'; then
    echo "  register marketplace anthropics/knowledge-work-plugins"
    if ! claude plugin marketplace add anthropics/knowledge-work-plugins; then
      echo "  err  failed to register marketplace. Aborting plugin install."
      exit 1
    fi
  else
    echo "  ok   marketplace anthropics/knowledge-work-plugins already registered"
  fi

  PLUGINS=(engineering design product-management)
  for plugin in "${PLUGINS[@]}"; do
    if claude plugin list 2>/dev/null | grep -q "^$plugin\b"; then
      echo "  ok   $plugin (already installed)"
      continue
    fi
    echo "  install $plugin@knowledge-work-plugins"
    if ! claude plugin install "${plugin}@knowledge-work-plugins"; then
      echo "  warn $plugin install failed — install manually:"
      echo "       claude plugin install ${plugin}@knowledge-work-plugins"
    fi
  done

  echo
  echo "  note 'anthropic-skills' (planning-filter, consolidate-memory, docx/pptx/xlsx/pdf)"
  echo "       ships separately. If you need them outside Cowork, search the official"
  echo "       marketplace: claude plugin marketplace info claude-plugins-official"
fi

echo
echo "Project skills:  $SKILLS_DEST"
echo "Verify:          ls -la $SKILLS_DEST | grep pipeline-"
if [[ "$WITH_PLUGINS" -eq 1 ]]; then
  echo "Plugin skills:   claude plugin list"
fi
echo
echo "Pipeline routing rules: see /CLAUDE.md \"Agent routing\" section."
