# se4450-project-group-15

se4450-project-group-15 created by GitHub Classroom

## Set-up Instructions

### Database

Database password is available at Dotenv repository

#### Mac/Linux

1. Follow instructions here: https://www.mongodb.com/docs/atlas/cli/stable/install-atlas-cli/ (please make sure to run `brew install mongodb-atlas-cli`)
2. Follow instructions here: https://www.mongodb.com/docs/drivers/node/current/quick-start/ (note: `npm i` should just get you up and running since everything's already in the `package-lock.json`, please contact Juan Rodriguez if any issues arise)
3. Set environment variable in `.bashrc` or `.zshrc`. Sample `.zshrc` below (please append to your `.zshrc`, do not overwrite your configuration files):

```zsh
export DB_PASS="SECRET_FROM_DOTENV_REPOSITORY" # you got an invite to dotenv.org, the password is there
```

#### Windows

See https://docs.oracle.com/en/database/oracle/machine-learning/oml4r/1.5.1/oread/creating-and-modifying-environment-variables-on-windows.html#GUID-DD6F9982-60D5-48F6-8270-A27EC53807D0

### Frontend

#### Environment Variables

Environment variables used only in the frontend can be put in a file called .env.local  
This file is ignored by git so as to not push passwords to the remote  
If you do not yet have this file, create it in the root frontend directory /frontend/  
SMTP Password is available at Dotenv repository

#### Required Frontend Environment Variables

NEXTAUTH_URL=http://localhost:3000  
NEXT_PUBLIC_PORT=8000  
SECRET=l2DBFmxj0I5y0t3GVkvQ4tDIREzRU8tBP19PDWKfQ54=  
SMTP_PASS=
