PROJECTS_DIR="test_env/.quickstart/projects"

if [ ! -d "test_env" ]; then
  mkdir -p $PROJECTS_DIR
  mkdir $PROJECTS_DIR/project-with-config $PROJECTS_DIR/project-without-config $PROJECTS_DIR/project-with-file
  printf '{\n\n}\n' > $PROJECTS_DIR/project-with-config/.quickstartrc
  printf '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>text</body>\n</html>\n' > $PROJECTS_DIR/project-with-file/index.html
fi
