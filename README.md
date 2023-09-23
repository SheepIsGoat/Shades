# Shades
A demo web app
Requirements:
1. Typescript, Node.js, React
2. Search content from Sanity.io API, and return in web page
3. Items must have a like button that shows which posts have been liked/not-liked
4. Must be additional 'liked' section that displays all tiles that are currently liked, and keeps state between sessions
5. Must be deployed and accessible from a public IP

# Log in to aws
aws configure

# Build and push container image
Create ECR repository
`sh docker-task.sh createrepo`
Build and push image
`sh docker-task.sh buildpush`
Show image name in ECR
`sh docker-task.sh showimage`


# Deploy cloudformation stack
Deploy from the cloudformation console to take advantage of auto-populating fields like Subnets, etc. (Recommended)
Or deploy from the CLI
`aws cloudformation deploy --template-file cloudformation.yaml --option value # etc`
