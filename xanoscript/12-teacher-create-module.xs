// Teacher Create Module - Create a new module for a course
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// Security: Auth ensures only logged-in users can create modules
query "teacher/modules" verb=POST {
  api_group = "all endpoints"
  auth = "users"

  input {
    int course_id
    text title filters=trim
    text description?
    int order_index?
  }

  stack {
    // Create the module
    db.add modules {
      data = {
        created_at : "now"
        course     : $input.course_id
        title      : $input.title
        description: $input.description
        order_index: $input.order_index
      }
    } as $module
  }

  response = {
    id         : $module.id
    course     : $module.course
    title      : $module.title
    description: $input.description
    order_index: $module.order_index
    created_at : $module.created_at
  }

  tags = ["teacher", "modules"]
}
