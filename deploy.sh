DIR="./Build/Assets/Videos"
DEPLOY="./Deploy"

if [ -d "$DIR" ]; then
  echo "folder exists"
else
  echo "creating folder"
  mkdir -p $DIR
fi

echo "moving videos"
cp ./Assets/Videos/* $DIR

if [ -d "$DEPLOY" ]; then
  echo "deploy folder exists"
else
  echo "creating deploy folder"
  mkdir -p $DEPLOY
fi


echo "move to deploy folder"
cp -r ./Build/* $DEPLOY