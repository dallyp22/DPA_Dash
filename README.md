# DPA Command Center 🚀

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dallyp22/DPA_Dash)

A high-tech command center dashboard built with Next.js 15, featuring real-time data visualization and administrative controls.

## Features

- **Real-time Dashboard**: Live view of revenue targets, spending, goals, and YTD profit & loss
- **Admin Panel**: Easy-to-use interface for updating all dashboard data with autosave
- **Command Center Theme**: Dark pine background with DPA green accents and cyan highlights
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and loading states
- **Type-safe**: Full TypeScript implementation with proper type checking

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom DPA theme
- **UI Components**: Shadcn UI with custom styling
- **Database**: PostgreSQL with Prisma ORM
- **Data Fetching**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Fonts**: Inter (body text) and Orbitron (headings)

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database (PostgreSQL)**:
   ```bash
   # Ensure DATABASE_URL is set to a running Postgres instance
   # Option 1: Use Docker (see docker-compose.yml below)
   # Option 2: Use your own Postgres connection
   npx prisma migrate dev --name init
   npm run db:seed
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   - Dashboard: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`

## Project Structure

```
src/
├── app/
│   ├── api/dashboard/route.ts    # REST API endpoints
│   ├── admin/page.tsx            # Admin panel
│   ├── page.tsx                  # Main dashboard
│   ├── layout.tsx                # Root layout with navigation
│   └── globals.css               # Global styles and theme
├── components/
│   ├── dashboard/                # Dashboard components
│   │   ├── revenue-card.tsx
│   │   ├── outside-spending-card.tsx
│   │   ├── goals-card.tsx
│   │   └── ytd-card.tsx
│   ├── providers/
│   │   └── query-provider.tsx    # React Query setup
│   └── ui/                       # Shadcn UI components
├── hooks/
│   └── use-dashboard.ts          # Custom hooks for data fetching
prisma/
├── schema.prisma                 # Database schema
└── seed.ts                       # Initial data
```

## Dashboard Components

### Revenue Card
- Shows progress toward revenue target
- Visual progress bar with milestone markers
- Real-time percentage calculation

### Outside Spending Card
- Lists all external spending items
- Automatic total calculation
- Easy add/remove functionality in admin

### Goals Card
- Track project goals with status indicators
- Status: Pending, In Progress, Completed
- Color-coded status visualization

### YTD Profit & Loss Card
- Year-to-date revenue and expenses
- Automatic profit calculation
- Profit margin percentage

## Admin Panel Features

- **Revenue Settings**: Update targets, current revenue, and milestones
- **YTD Management**: Modify revenue and expense figures
- **Spending Tracking**: Add, edit, and remove spending items
- **Goal Management**: Create and update goals with status tracking
- **Auto-save**: All changes save automatically on blur
- **Last Saved Indicator**: Shows when data was last updated

## Database Schema

The application uses a simple JSON-based approach with a single `Dashboard` model:

```prisma
model Dashboard {
  id        Int      @id @default(1)
  data      Json     // All dashboard data as JSON
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

- `GET /api/dashboard` - Fetch current dashboard data
- `PATCH /api/dashboard` - Update dashboard data

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables if needed
4. Deploy!

### Other Platforms
- **Netlify**: Use the Next.js build adapter
- **Railway**: Connect GitHub repo and deploy; provision a Postgres database, set `DATABASE_URL`
- **Digital Ocean**: Use App Platform with Node.js; attach a managed Postgres DB

### Environment Variables

Create a `.env` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dpa?schema=public"
ADMIN_BASIC_AUTH_USER="admin"     # optional for demo auth
ADMIN_BASIC_AUTH_PASS="changeme"  # optional for demo auth
```

For production, set these to your managed Postgres and secure admin creds.

## Customization

### Theme Colors
Edit `src/app/globals.css` to customize the color scheme:
- `--dpa-dark-pine`: Main background color
- `--dpa-green`: Primary accent color
- `--dpa-cyan`: Highlight color

### Adding New Components
1. Create component in `src/components/dashboard/`
2. Add to main dashboard in `src/app/page.tsx`
3. Update admin panel if editable

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your-migration-name`
3. Update TypeScript interfaces in `src/hooks/use-dashboard.ts`

## Local Postgres via Docker

Create a `docker-compose.yml` in the project root:
```yaml
version: '3.9'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: dpa
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
volumes:
  pg_data:
```

Then:
```bash
docker compose up -d db
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dpa?schema=public"
npx prisma migrate dev
npm run db:seed
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue or contact the development team.
