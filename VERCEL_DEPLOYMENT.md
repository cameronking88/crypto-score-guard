# Vercel Deployment Guide for Crypto Score Guard

This guide provides step-by-step instructions for deploying the Crypto Score Guard application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub account with access to the crypto-score-guard repository
- Node.js 18+ installed locally (for testing)

## Step 1: Prepare the Repository

1. Ensure all changes are committed and pushed to the main branch:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. Verify the repository is clean and up-to-date on GitHub.

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.

2. Click on "New Project" or "Add New..." → "Project".

3. Import the `cameronking88/crypto-score-guard` repository:
   - Search for "crypto-score-guard" in the repository list
   - Click "Import" next to the repository

## Step 3: Configure Project Settings

### Build Settings

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Leave as default (`.`)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Environment Variables

Add the following environment variables in the Vercel dashboard:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

**To add environment variables:**
1. In the project settings, go to "Environment Variables"
2. Add each variable with the name and value above
3. Make sure to select "Production", "Preview", and "Development" for each variable

### Advanced Settings

1. **Node.js Version**: Set to `18.x` or `20.x`
2. **Functions**: Leave as default (no serverless functions needed)

## Step 4: Deploy

1. Click "Deploy" to start the deployment process.

2. Wait for the build to complete (usually 2-5 minutes).

3. Once deployed, you'll receive a URL like: `https://crypto-score-guard-xxx.vercel.app`

## Step 5: Configure Custom Domain (Optional)

1. In the Vercel dashboard, go to your project settings.

2. Navigate to "Domains" section.

3. Add your custom domain:
   - Enter your domain name (e.g., `cryptoscoreguard.com`)
   - Follow Vercel's DNS configuration instructions
   - Update your domain's DNS records as instructed

4. Wait for DNS propagation (can take up to 24 hours).

## Step 6: Verify Deployment

1. Visit your deployed URL to ensure the application loads correctly.

2. Test the following features:
   - Wallet connection (MetaMask, WalletConnect, etc.)
   - Score submission functionality
   - Responsive design on mobile devices
   - All UI components render properly

3. Check the browser console for any errors.

## Step 7: Configure Automatic Deployments

1. In the Vercel dashboard, go to "Git" settings.

2. Ensure "Automatic deployments" is enabled for:
   - Production branch (main)
   - Preview deployments for pull requests

3. Configure branch protection rules if needed.

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables Not Working**:
   - Double-check variable names (case-sensitive)
   - Ensure variables are added to all environments
   - Redeploy after adding new variables

3. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure network configuration matches Sepolia testnet

4. **Styling Issues**:
   - Check if Tailwind CSS is building correctly
   - Verify all CSS imports are correct
   - Check for missing font files

### Performance Optimization

1. **Enable Vercel Analytics** (optional):
   - Go to project settings
   - Enable "Vercel Analytics" for performance monitoring

2. **Configure Caching**:
   - Static assets are automatically cached
   - API routes can be configured with custom cache headers

3. **Image Optimization**:
   - Use Vercel's built-in image optimization
   - Consider using WebP format for better performance

## Security Considerations

1. **Environment Variables**:
   - Never commit sensitive keys to the repository
   - Use Vercel's environment variable system
   - Rotate API keys regularly

2. **HTTPS**:
   - Vercel automatically provides HTTPS
   - Ensure all external API calls use HTTPS

3. **CORS**:
   - Configure CORS headers if needed for API calls
   - Restrict origins to your domain only

## Monitoring and Maintenance

1. **Deployment Monitoring**:
   - Set up Vercel notifications for deployment status
   - Monitor build times and success rates

2. **Performance Monitoring**:
   - Use Vercel Analytics for performance insights
   - Monitor Core Web Vitals

3. **Error Tracking**:
   - Consider integrating error tracking services
   - Monitor console errors and user feedback

## Rollback Strategy

1. **Previous Deployments**:
   - Vercel keeps a history of deployments
   - You can rollback to any previous deployment from the dashboard

2. **Emergency Rollback**:
   - Go to "Deployments" in Vercel dashboard
   - Click on a previous successful deployment
   - Click "Promote to Production"

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/installation)
- [Wagmi Documentation](https://wagmi.sh/)

## Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] Wallet connection works properly
- [ ] All environment variables are set correctly
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active
- [ ] Performance is acceptable
- [ ] Mobile responsiveness is working
- [ ] Analytics are set up (if desired)
- [ ] Error monitoring is configured (if desired)

## Contact

For deployment issues or questions, please refer to the project documentation or create an issue in the GitHub repository.
