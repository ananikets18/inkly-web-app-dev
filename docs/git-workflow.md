
---

### 📄 `docs/git-workflow.md`

````markdown
# 🧰 GitHub Workflow Guide – Inkly Web App Dev

This document is your go-to cheat sheet for using Git and GitHub effectively while working on `inkly-web-app-dev`.

---

## 📁 Initial Setup (One-Time)

### ✅ If cloning from GitHub:
```bash
git clone https://github.com/YOUR_USERNAME/inkly-web-app-dev.git
cd inkly-web-app-dev
````

### ✅ If starting from local folder:

```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/inkly-web-app-dev.git
git branch -M main
git push -u origin main
```

---

## 🔁 Daily Development Workflow

### 1. Check for unstaged or new changes:

```bash
git status
```

### 2. Stage changes:

#### Add everything:

```bash
git add .
```

#### Add specific files:

```bash
git add app/create/page.tsx
git add components/ink/CreateInk.tsx
```

### 3. Commit with a message:

```bash
git commit -m "Added Create Ink interface and components"
```

### 4. Push to GitHub:

```bash
git push origin main
```

---

## 🌿 Optional: Use Feature Branches

### Create a new branch:

```bash
git checkout -b feature/ink-creation
```

### Push that branch:

```bash
git push origin feature/ink-creation
```

Create a Pull Request on GitHub to merge into `main`.

---

## 🧽 Useful Git Commands

| Action                        | Command                       |
| ----------------------------- | ----------------------------- |
| Unstage a file                | `git reset HEAD filename.tsx` |
| Undo last commit (local only) | `git reset --soft HEAD~1`     |
| Pull latest changes           | `git pull origin main`        |
| See commit history (brief)    | `git log --oneline`           |

---

## 📝 Good Commit Message Examples

* `Add Create Ink page with feeling picker`
* `Implement POST /api/inks endpoint`
* `Fix XP progress bar not updating`
* `Refactor badge grid for mobile`
* `Cleanup unused props in reaction component`

---

## 🧭 Summary Workflow

```bash
# Check changes
git status

# Stage
git add .

# Commit
git commit -m "Describe your change"

# Push
git push origin main
```

---

> Keep this file updated as the project grows. It's your shared dev playbook.

````

---

### ✅ Next Step:

1. Create `docs/` folder if not already:
   ```bash
   mkdir docs
````

2. Create file and paste the above content:

   ```bash
   touch docs/git-workflow.md
   ```

3. Add & push:

   ```bash
   git add docs/git-workflow.md
   git commit -m "Add GitHub workflow guide under docs/"
   git push origin main
   ```


