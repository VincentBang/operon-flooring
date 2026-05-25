# Operon Flooring Deployment Workflow

## Branch Strategy

- `main` = production site
- `dev` = development work

Required workflow:

1. make changes on `dev`
2. push `dev` to GitHub
3. review Netlify preview deploy
4. verify quote flow, mobile layout, and console state
5. merge `dev` into `main`
6. Netlify deploys `main` to production

## Rules

- Never push development work directly to `main`
- All Codex changes go to `dev` only
- Always test the Netlify preview URL before merge
- Production deploys should come from `main` only

## Netlify Preview Deploys

Expected setup:

- GitHub repo connected to Netlify
- Deploy Previews enabled
- Branch Deploys enabled

Expected result:

- pushes to `dev` create a preview deployment
- preview URLs look like `https://deploy-preview-xxx.netlify.app`

## Local Preview

Optional local workflow:

```bash
netlify dev
```

Use local preview for testing only.

Do not use the Netlify CLI to deploy production directly.

## Deployment Checklist

Before merging `dev` into `main`, confirm:

- UI works
- quote flow works
- mobile works
- no console errors
- floorplan handoff works
- forms still submit correctly

## Notes

- If the repo is newly connected, create both `main` and `dev` in GitHub after the first commit
- Netlify production should point to `main`
- Netlify previews should use branch and pull request deploys

## Netlify Failure Checklist

If Netlify fails to deploy, check these first:

1. `main` is the production branch in Netlify
2. `apps/web` is the publish directory
3. Netlify UI is not overriding the repo `netlify.toml`
4. the pushed commit actually contains:
   - `apps/web/index.html`
   - `apps/web/floorplan.html`
   - `apps/web/robots.txt`
   - `apps/web/sitemap.xml`
5. `netlify.toml` exists in the repo root
6. `netlify/functions` exists if Netlify is expecting a functions directory

If a deploy fails after a Git push, compare the failed commit in GitHub with the local workspace before changing Netlify settings.
