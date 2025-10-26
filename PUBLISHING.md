# Publishing n8n-nodes-serpex to npm

This guide explains how to publish the Serpex community node to npm using GitHub Actions.

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com)
2. **npm Access Token**: 
   - Go to [npm settings](https://www.npmjs.com/settings/~/tokens)
   - Click "Generate New Token" → "Classic Token"
   - Select "Automation" type
   - Copy the token (you won't see it again!)

3. **GitHub Repository**: 
   - This code should be in a GitHub repository
   - You need admin access to add secrets

## Setup Steps

### 1. Add npm Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm access token
6. Click **Add secret**

### 2. Verify package.json

Make sure your `package.json` has:
```json
{
  "name": "n8n-nodes-serpex",
  "version": "1.0.0",
  "keywords": ["n8n-community-node-package"],
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR-USERNAME/YOUR-REPO.git"
  }
}
```

Replace `YOUR-USERNAME` and `YOUR-REPO` with your actual GitHub details.

### 3. Update Author Information

In `package.json`, update:
```json
{
  "author": {
    "name": "Your Name",
    "email": "your-email@example.com"
  }
}
```

## Publishing Methods

### Method 1: Manual Workflow Dispatch (Recommended for First Release)

1. Go to GitHub **Actions** tab
2. Select **Publish to npm** workflow
3. Click **Run workflow**
4. Enter version number (e.g., `1.0.0`)
5. Click **Run workflow**

The workflow will:
- Install dependencies
- Build the package
- Run linter
- Publish to npm
- Create a git tag

### Method 2: GitHub Release

1. Go to **Releases** → **Create a new release**
2. Click **Choose a tag** → Type `v1.0.0` → **Create new tag**
3. Fill in release title: `v1.0.0 - Initial Release`
4. Add release notes
5. Click **Publish release**

This automatically triggers the publish workflow.

## Version Management

### Semantic Versioning

Follow [semver](https://semver.org/):
- **1.0.0** - Initial release
- **1.0.1** - Bug fixes
- **1.1.0** - New features (backwards compatible)
- **2.0.0** - Breaking changes

### Publishing Updates

1. Update version in `package.json`
2. Commit changes
3. Use GitHub Actions workflow or create a release
4. The package will be published with the new version

## Verification

### Check npm Publication

1. Go to `https://www.npmjs.com/package/n8n-nodes-serpex`
2. Verify package details
3. Check version number

### Test Installation

```bash
# In a test n8n instance
npm install n8n-nodes-serpex

# Or via n8n UI
# Settings → Community Nodes → Install → n8n-nodes-serpex
```

## Submit for n8n Verification

Once published to npm:

1. Go to [n8n community nodes submission](https://www.npmjs.com/package/n8n-nodes-serpex)
2. Fill out the form with:
   - Package name: `n8n-nodes-serpex`
   - npm URL: `https://www.npmjs.com/package/n8n-nodes-serpex`
   - GitHub URL: Your repository URL
   - Description: Brief description of functionality

3. n8n team will review and add to verified list

## Troubleshooting

### "npm ERR! 403 Forbidden"
- Verify `NPM_TOKEN` secret is set correctly
- Check token has "Automation" permissions
- Ensure you're not trying to publish over existing version

### "npm ERR! 404 Not Found"
- Package name might be taken
- Try a different name in `package.json`

### Build Errors
- Make sure all dependencies are in `package.json`
- Run `npm install` and `npm run build` locally first
- Check TypeScript errors

### Version Conflicts
- Don't publish same version twice
- Increment version number for each release
- Delete failed releases from npm if needed

## Best Practices

1. **Test Locally First**
   ```bash
   cd other-contributions/n8n-nodes-serpex
   npm install
   npm run build
   npm run lint
   ```

2. **Meaningful Versions**
   - Start with 1.0.0 for first stable release
   - Use 0.x.x for beta versions

3. **Changelog**
   - Keep CHANGELOG.md updated
   - Document breaking changes clearly

4. **Documentation**
   - Keep README.md comprehensive
   - Add examples and use cases

## Next Steps

After successful publication:

1. ✅ Test installation in fresh n8n instance
2. ✅ Submit for n8n verification
3. ✅ Share with community
4. ✅ Monitor issues and feedback
5. ✅ Plan future updates

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [n8n Community Nodes Docs](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

If you encounter issues:
- Check GitHub Actions logs for errors
- Verify all secrets are set correctly
- Test build process locally
- Open an issue on GitHub for help
