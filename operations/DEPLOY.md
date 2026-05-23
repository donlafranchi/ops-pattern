---
purpose: Deploy + phone-dev runbook — GitHub push, Hetzner box, Termius.
layer: how
status: active
---

# Deploy + phone-dev setup — Movers, Makers & Shakers

How the two repos get to GitHub, and how to continue developing with Claude Code
from a phone via a Hetzner box and Termius.

## The shape of it

GitHub is the warehouse (two repos, source of truth). The Hetzner box is a rented
workshop that is always on and reachable from anywhere. Termius is the key to the
workshop door. You clone both repos onto the Hetzner box once, then SSH in from the
phone and run Claude Code there.

```
                   ┌─────────── GitHub ───────────┐
   Mac  ──push──▶   movers-makers-shakers (web)     │
                    movers-makers-shakers-planning  │
                   └──────────────┬─────────────────┘
                                  │ clone / pull / push
                                  ▼
                          Hetzner box (Ubuntu)
                          ~/Projects/movers-makers-shakers/
                          ├── web/        ← app repo
                          └── (planning docs) ← parent repo
                                  ▲
                                  │ SSH / Mosh
                              Termius (phone)
```

The two repos stay separate the same way they are on disk now: the parent repo
ignores `web/` (see the parent `.gitignore`), and `web/` is its own git repo.
Nesting the web clone inside the parent clone reproduces that exactly.

---

## Part 1 — Push the two repos to GitHub (one time, from the Mac)

Create two **empty** repos on GitHub first (no README, no .gitignore, no license —
an empty repo accepts the first push without conflict):

- `movers-makers-shakers` — the app (the `web/` repo)
- `movers-makers-shakers-planning` — product / planning / development docs (the parent repo)

Then, in the Mac terminal:

```bash
# 0. Clear the stale git locks the Cowork sandbox left behind
rm -f ~/Projects/mainstreetmarket/.git/index.lock \
      ~/Projects/mainstreetmarket/web/.git/index.lock

# 1. Parent repo — planning docs
cd ~/Projects/mainstreetmarket
git add -A
git commit -m "Rename to Movers, Makers & Shakers"
git remote add origin https://github.com/YOUR-GH-USERNAME/movers-makers-shakers-planning.git
git branch -M main
git push -u origin main

# 2. Web repo — the app
cd ~/Projects/mainstreetmarket/web
git add -A
git commit -m "Rename to Movers, Makers & Shakers"
git remote add origin https://github.com/YOUR-GH-USERNAME/movers-makers-shakers.git
git branch -M main
git push -u origin main
```

**Auth:** the HTTPS push above will ask for credentials. Easiest path — install the
GitHub CLI and run `gh auth login` once; `git push` then just works. If you already
use SSH keys with GitHub, swap the remote URLs for `git@github.com:USER/REPO.git`.

**Branches:** `git push -u origin main` pushes only `main`. The stale `claude/*`
branches (parent) and `phase-0-eval-complete` / `t052` (web) are not pushed — fine
to leave, or delete them with `git branch -D <name>`.

**Note — this commit bundles work in progress.** The parent repo had ~19 files with
uncommitted edits before the rename. `git add -A` commits those together with the
rename. Split into two commits first if you want them separate.

---

## Part 2 — Rename the local folder (do this last)

You chose to rename the on-disk folder too. Do this **after** the push and **after**
closing the Cowork session — renaming it mid-session breaks Cowork's mount.

```bash
mv ~/Projects/mainstreetmarket ~/Projects/movers-makers-shakers
```

Then re-add `~/Projects/movers-makers-shakers` as the folder in Cowork. Git is
unaffected (it does not care about the parent folder name); the docs already point
at the new path.

---

## Part 3 — Provision the Hetzner box

In the Hetzner Cloud Console (console.hetzner.cloud): create a project, then a server.

- **Image:** Ubuntu 24.04
- **Type:** CPX31 (4 vCPU / 8 GB / 160 GB, ~€16/mo) recommended. CPX21
  (3 vCPU / 4 GB, ~€8/mo) works but Next.js builds + Playwright will be tight.
- **Location:** a US region (Ashburn or Hillsboro) for lower latency.
- **SSH key:** paste your Mac public key (`cat ~/.ssh/id_ed25519.pub`) during
  creation. If you have no key: `ssh-keygen -t ed25519` first.
- **Firewall:** attach a Hetzner Cloud Firewall allowing inbound TCP 22 (SSH) and
  UDP 60000–61000 (Mosh).

Note the server's public IP when it finishes.

---

## Part 4 — Set up the box (SSH in from the Mac first)

```bash
ssh root@SERVER_IP

# System
apt update && apt upgrade -y
apt install -y git tmux mosh ufw

# Optional but recommended: a non-root user
adduser don && usermod -aG sudo don
# (re-copy your SSH key to /home/don/.ssh/authorized_keys, then use `ssh don@SERVER_IP`)

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Claude Code
npm install -g @anthropic-ai/claude-code

# Firewall
ufw allow OpenSSH && ufw allow 60000:61000/udp && ufw --force enable
```

**Clone both repos** (public repos clone with no auth):

```bash
mkdir -p ~/Projects && cd ~/Projects
git clone https://github.com/YOUR-GH-USERNAME/movers-makers-shakers-planning.git movers-makers-shakers
cd movers-makers-shakers
git clone https://github.com/YOUR-GH-USERNAME/movers-makers-shakers.git web
```

To **push** from the box later, give it its own key:
`ssh-keygen -t ed25519`, add `~/.ssh/id_ed25519.pub` to GitHub (Settings → SSH keys),
and switch each remote to its `git@github.com:` URL with `git remote set-url origin ...`.

**Recreate `web/.env.local`** — it is gitignored, so it is not in the repo. Copy the
template and fill in real values (including the rotated Supabase secret key):

```bash
cd ~/Projects/movers-makers-shakers/web
cp .env.local.example .env.local
nano .env.local   # paste the real values
```

**Start Claude Code:**

```bash
cd ~/Projects/movers-makers-shakers
claude
```

First run handles auth — it prints a URL you can open on any device, or set
`ANTHROPIC_API_KEY` in the environment for a headless login.

---

## Part 5 — Connect from the phone with Termius

1. Install Termius. In **Keychain**, generate a new key (or import one), and add its
   public key to the box: paste it into `~/.ssh/authorized_keys` on the server.
2. Add a **Host**: the server IP, username (`don` or `root`), and the key.
3. Enable **Mosh** for that host — it survives network changes and phone sleep far
   better than plain SSH.
4. Connect. You land in a shell.

**Always work inside tmux** so a dropped connection does not kill Claude Code:

```bash
tmux new -s dev      # first time
# ...run `claude` inside it...
# if disconnected, reconnect and:
tmux attach -t dev
```

---

## Tips

- **tmux is the whole trick** for phone dev — the session keeps running on the box
  whether or not the phone is connected.
- **Costs:** ~€16/mo for CPX31. Hetzner bills hourly; you can delete the server and
  recreate from these notes if you want to pause.
- **Security:** SSH key only (disable password auth in `/etc/ssh/sshd_config`:
  `PasswordAuthentication no`, then `systemctl restart ssh`). Keep the box patched
  (`apt update && apt upgrade`).
- **Previewing the app:** run `npm run dev` in `web/`, then either open
  `http://SERVER_IP:3000` (open port 3000 in the firewall) or, more privately,
  SSH-tunnel it: `ssh -L 3000:localhost:3000 don@SERVER_IP`.
- **Keep both repos in sync:** `git pull` on the box before a session, `git push`
  (or hand commits to the PM per the project's commit rules) after.
