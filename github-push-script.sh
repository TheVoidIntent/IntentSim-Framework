#!/bin/bash
# push-to-github.sh - Automated script to push IntentSim[on] Framework to GitHub

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo -e "${BOLD}${BLUE}IntentSim[on] Framework GitHub Push Utility${RESET}"
echo -e "${BLUE}============================================${RESET}\n"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install git first.${RESET}"
    exit 1
fi

# Get the repository path
REPO_PATH="."
read -p "Enter repository path (default: current directory): " input_path
if [ ! -z "$input_path" ]; then
    REPO_PATH=$input_path
fi

# Navigate to the repository
cd "$REPO_PATH" || {
    echo -e "${RED}Failed to navigate to $REPO_PATH${RESET}"
    exit 1
}

# Check if it's a git repository
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}No git repository found in $REPO_PATH. Initializing new repository...${RESET}"
    git init
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to initialize git repository.${RESET}"
        exit 1
    fi
    echo -e "${GREEN}Git repository initialized successfully.${RESET}"
else
    echo -e "${GREEN}Existing git repository found.${RESET}"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}Creating .gitignore file...${RESET}"
    cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Build outputs
dist/
build/
lib/
coverage/

# Environment variables
.env
.env.local
.env.*.local

# Editor files
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS files
.DS_Store
Thumbs.db
EOL
    echo -e "${GREEN}.gitignore created successfully.${RESET}"
fi

# Stage files
echo -e "\n${BLUE}Staging files...${RESET}"
git add .
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to stage files.${RESET}"
    exit 1
fi
echo -e "${GREEN}Files staged successfully.${RESET}"

# Commit files
echo -e "\n${BLUE}Committing changes...${RESET}"
read -p "Enter commit message (default: 'Add IntentSim[on] Framework with test suite'): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Add IntentSim[on] Framework with test suite"
fi

git commit -m "$commit_message"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to commit changes.${RESET}"
    exit 1
fi
echo -e "${GREEN}Changes committed successfully.${RESET}"

# Check if remote exists
REMOTE_EXISTS=$(git remote -v | grep origin)
if [ -z "$REMOTE_EXISTS" ]; then
    echo -e "\n${YELLOW}No remote repository found.${RESET}"
    read -p "Enter GitHub repository URL (e.g., https://github.com/username/repo.git): " repo_url
    
    if [ -z "$repo_url" ]; then
        echo -e "${RED}No repository URL provided. Exiting...${RESET}"
        exit 1
    fi
    
    git remote add origin "$repo_url"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to add remote repository.${RESET}"
        exit 1
    fi
    echo -e "${GREEN}Remote repository added successfully.${RESET}"
else
    echo -e "\n${GREEN}Remote repository already configured.${RESET}"
    git remote -v
fi

# Set branch to main
echo -e "\n${BLUE}Setting branch to main...${RESET}"
git branch -M main
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to set branch to main.${RESET}"
    exit 1
fi
echo -e "${GREEN}Branch set to main successfully.${RESET}"

# Push to GitHub
echo -e "\n${BLUE}Pushing to GitHub...${RESET}"
git push -u origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push to GitHub. You might need to authenticate.${RESET}"
    echo -e "${YELLOW}Try running: git push -u origin main${RESET}"
    exit 1
fi

echo -e "\n${GREEN}${BOLD}✅ Success! IntentSim[on] Framework has been pushed to GitHub.${RESET}"
echo -e "${BLUE}Next steps:${RESET}"
echo -e "  1. Set up GitHub Actions for CI/CD"
echo -e "  2. Enable GitHub Pages for documentation"
echo -e "  3. Configure branch protection rules"
echo -e "\n${BOLD}Structural sovereignty achieved.${RESET}"
