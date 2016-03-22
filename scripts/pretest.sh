PROJECTS_DIR="test_env/.quickstart/projects"

if [ ! -d "test_env" ]; then
  mkdir -p $PROJECTS_DIR
  mkdir $PROJECTS_DIR/project-with-config $PROJECTS_DIR/project-without-config
  printf '{ "test": {} }\n' > $PROJECTS_DIR/project-with-config/.quickstartrc
fi
