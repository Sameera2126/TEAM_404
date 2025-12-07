# Seed Users Script

This script creates test users for the AgriConnect application.

## Usage

1. Make sure your `.env` file has the correct `MONGO_URI` configured
2. Run the seed script:

```bash
npm run seed
```

## Test Credentials

### Farmers
- Email: `farmer1@agriconnect.com`, Password: `farmer123`
- Email: `farmer2@agriconnect.com`, Password: `farmer123`
- Email: `farmer3@agriconnect.com`, Password: `farmer123`

### Experts
- Email: `expert1@agriconnect.com`, Password: `expert123`
- Email: `expert2@agriconnect.com`, Password: `expert123`
- Email: `expert3@agriconnect.com`, Password: `expert123`

### Government Users
- Email: `gov1@agriconnect.com`, Password: `gov123`
- Email: `gov2@agriconnect.com`, Password: `gov123`

## Notes

- The script checks if users already exist before creating them
- Passwords are stored in plain text (for development only)
- To clear existing users, uncomment the delete line in the script

