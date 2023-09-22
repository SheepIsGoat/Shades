# query sanity
export SANITY_TOKEN="TOKEN"


export GROQ_QUERY=$(echo '*[_type == "tile"][0..9] {name,title,header,slug,status,publishDate,owner}' | jq -sRr @uri)

export GROQ_QUERY=$(echo '*[_type == "tile" && title match "*miley*"][0..9]{name,title,header,slug,status,publishDate,owner}' | jq -sRr @uri)

curl --http1.1 -H "Authorization: Bearer $SANITY_TOKEN" "https://0unlbb72.api.sanity.io/v2022-03-29/data/query/dev?query=$GROQ_QUERY"

# hit internal endpoint
curl -X GET 'http://localhost:3000/search?q=dogs'

curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"owner":"alex","name":null,"title":"cats v. dogs.","header":null,"slug":{"current":"cats-v-dogs","_type":"slug"},"status":"published","publishDate":"2022-07-05"}' \
    'http://localhost:3000/like'


# log in to aws
aws configure

# create repository
Edit the docker-task.sh to have your 
```
IMAGE_NAME="shades-backend"
DOCKER_DIR="back"
AWS_REGION="us-west-1"
```
`sh docker-task.sh createrepo`
`sh docker-task.sh buildpush`
`sh docker-task.sh showimage`

Modify again
```
IMAGE_NAME="shades-frontend"
DOCKER_DIR="front"
```
`sh docker-task.sh createrepo`
`sh docker-task.sh buildpush`
`sh docker-task.sh showimage`
